import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const VERSION_INDEX_STRIDE = 10_000;
const CLAIM_MAX_CHARS = 400;

export interface VersionPlan {
  unchanged: boolean;
  versionNumber: string;
  indexOffset: number;
  fileHash: string;
}

export interface GraphChunk {
  chunkIndex: number;
  text: string;
  vectorId: string;
}

@Injectable()
export class EvidenceGraphService {
  private readonly logger = new Logger(EvidenceGraphService.name);

  constructor(private readonly prisma: PrismaService) {}

  async planVersion(
    tenantId: string,
    documentId: string,
    content: string,
  ): Promise<VersionPlan> {
    const fileHash = createHash('sha256').update(content).digest('hex');
    const source = await this.prisma.source.findFirst({
      where: { tenantId, documentId },
      include: { versions: { orderBy: { createdAt: 'asc' } } },
    });
    const latest = source?.versions[source.versions.length - 1];

    if (latest?.fileHash === fileHash) {
      return {
        unchanged: true,
        versionNumber: latest.versionNumber,
        indexOffset: 0,
        fileHash,
      };
    }

    const next = (source?.versions.length ?? 0) + 1;
    return {
      unchanged: false,
      versionNumber: `v${next}`,
      indexOffset: (next - 1) * VERSION_INDEX_STRIDE,
      fileHash,
    };
  }

  /**
   * Writes Source, SourceVersion, Passage and Claim for a document version.
   * A second version of the same document stays active beside the previous one
   * and opens a conflict. Retrieval drops a version only after adjudication
   * marks it SUPERSEDED.
   */
  async commitVersion(input: {
    tenantId: string;
    documentId: string;
    fileHash: string;
    versionNumber: string;
    chunks: GraphChunk[];
  }): Promise<void> {
    const document = await this.prisma.document.findFirst({
      where: { id: input.documentId, tenantId: input.tenantId },
      select: { title: true },
    });
    const title = document?.title?.trim() || 'Untitled directive';

    await this.prisma.$transaction(async (tx) => {
      const source = await tx.source.upsert({
        where: { documentId: input.documentId },
        update: { title },
        create: {
          tenantId: input.tenantId,
          documentId: input.documentId,
          title,
          domain: 'OPERATIONAL_SOP',
        },
      });

      const previous = await tx.sourceVersion.findFirst({
        where: { sourceId: source.id, status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        include: { claims: { take: 1, orderBy: { createdAt: 'asc' } } },
      });

      const version = await tx.sourceVersion.create({
        data: {
          sourceId: source.id,
          versionNumber: input.versionNumber,
          status: 'ACTIVE',
          fileHash: input.fileHash,
        },
      });

      const createdClaims: { id: string }[] = [];
      for (const chunk of input.chunks) {
        const passage = await tx.passage.create({
          data: {
            sourceVersionId: version.id,
            passageIndex: chunk.chunkIndex,
            text: chunk.text,
            vectorId: chunk.vectorId,
          },
        });
        const claim = await tx.claim.create({
          data: {
            tenantId: input.tenantId,
            sourceVersionId: version.id,
            passageId: passage.id,
            statement: this.toClaimStatement(chunk.text),
          },
        });
        createdClaims.push(claim);
      }

      const previousClaim = previous?.claims[0];
      const nextClaim = createdClaims[0];
      if (previous && previousClaim && nextClaim) {
        await tx.conflict.create({
          data: {
            tenantId: input.tenantId,
            claimAId: previousClaim.id,
            claimBId: nextClaim.id,
            conflictType: 'TEMPORAL_SUPERSEDED',
            severity: 'HIGH',
            status: 'DETECTED',
          },
        });
        this.logger.log(
          `Opened conflict between ${previous.versionNumber} and ${input.versionNumber} for document ${input.documentId}`,
        );
      }
    });
  }

  /**
   * Drops chunks whose passage belongs to a SUPERSEDED source version.
   * Chunks with no evidence-graph passage stay, so older corpora keep answering.
   * `vectorId` here is the DocumentChunk id carried by RagChunk.
   */
  async excludeSuperseded<T extends { vectorId: string }>(
    tenantId: string,
    chunks: T[],
  ): Promise<T[]> {
    if (chunks.length === 0) return chunks;

    const chunkIds = chunks.map((chunk) => chunk.vectorId);
    const rows = await this.prisma.documentChunk.findMany({
      where: { tenantId, id: { in: chunkIds } },
      select: { id: true, vectorId: true },
    });
    if (rows.length === 0) return chunks;

    const blocked = await this.prisma.passage.findMany({
      where: {
        vectorId: { in: rows.map((row) => row.vectorId) },
        sourceVersion: { status: 'SUPERSEDED' },
      },
      select: { vectorId: true },
    });
    if (blocked.length === 0) return chunks;

    const blockedVectors = new Set(blocked.map((row) => row.vectorId));
    const blockedChunkIds = new Set(
      rows.filter((row) => blockedVectors.has(row.vectorId)).map((row) => row.id),
    );

    return chunks.filter((chunk) => !blockedChunkIds.has(chunk.vectorId));
  }

  private toClaimStatement(text: string): string {
    const sentence = text.replace(/\s+/g, ' ').trim();
    if (sentence.length <= CLAIM_MAX_CHARS) return sentence;
    return `${sentence.slice(0, CLAIM_MAX_CHARS - 1).trimEnd()}…`;
  }
}
