import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

export interface ResolveConflictInput {
  conflictId: string;
  userId: string;
  tenantId: string;
  decision: 'OVERRIDE_AUTHORITY' | 'MARK_FALSE_POSITIVE' | 'REQUEST_DOC_UPDATE';
  scopeOverride?: string;
  rationale: string;
  /** Claim that remains in force. The other claim's version becomes SUPERSEDED. */
  authoritativeClaimId?: string;
}

@Injectable()
export class ConflictsService {
  private readonly logger = new Logger(ConflictsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async listConflicts(tenantId: string, status?: string) {
    return this.prisma.conflict.findMany({
      where: {
        tenantId,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        claimA: {
          include: {
            sourceVersion: {
              include: { source: true },
            },
          },
        },
        claimB: {
          include: {
            sourceVersion: {
              include: { source: true },
            },
          },
        },
        decisions: {
          orderBy: { decidedAt: 'desc' },
          include: {
            user: { select: { email: true } },
          },
        },
      },
      orderBy: { detectedAt: 'desc' },
    });
  }

  async resolveConflict(input: ResolveConflictInput) {
    const conflict = await this.prisma.conflict.findFirst({
      where: { id: input.conflictId, tenantId: input.tenantId },
      include: {
        claimA: { select: { id: true, sourceVersionId: true } },
        claimB: { select: { id: true, sourceVersionId: true } },
      },
    });

    if (!conflict) {
      throw new NotFoundException('Conflict not found');
    }

    if (!input.rationale || input.rationale.trim().length < 5) {
      throw new BadRequestException('A clear operational rationale is required for human adjudication');
    }

    const newStatus = input.decision === 'MARK_FALSE_POSITIVE' ? 'FALSE_POSITIVE' : 'RESOLVED';

    // Transaction: update conflict, record decision, append audit event
    const [updatedConflict, decision] = await this.prisma.$transaction(async (tx) => {
      const dec = await tx.reviewDecision.create({
        data: {
          conflictId: input.conflictId,
          decidedByUserId: input.userId,
          decision: input.decision,
          scopeOverride: input.scopeOverride,
          rationale: input.rationale,
        },
      });

      const updated = await tx.conflict.update({
        where: { id: input.conflictId },
        data: {
          status: newStatus as any,
          resolvedAt: new Date(),
        },
      });

      // Tamper-evident Audit Event
      const payloadHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({ conflictId: input.conflictId, decision: input.decision, rationale: input.rationale }))
        .digest('hex');

      await tx.auditEvent.create({
        data: {
          tenantId: input.tenantId,
          actorId: input.userId,
          actionType: `CONFLICT_${input.decision}`,
          entityType: 'Conflict',
          entityId: input.conflictId,
          payloadHash,
          metadata: {
            rationale: input.rationale,
            decision: input.decision,
            authoritativeClaimId: input.authoritativeClaimId,
          },
        },
      });

      if (input.decision === 'OVERRIDE_AUTHORITY' && input.authoritativeClaimId) {
        const winnerIsA = input.authoritativeClaimId === conflict.claimA.id;
        const winnerIsB = input.authoritativeClaimId === conflict.claimB.id;
        if (!winnerIsA && !winnerIsB) {
          throw new BadRequestException('authoritativeClaimId must be one of the two claims in this conflict');
        }
        const winner = winnerIsA ? conflict.claimA : conflict.claimB;
        const loser = winnerIsA ? conflict.claimB : conflict.claimA;
        if (loser.sourceVersionId && winner.sourceVersionId && loser.sourceVersionId !== winner.sourceVersionId) {
          await tx.sourceVersion.update({
            where: { id: loser.sourceVersionId },
            data: {
              status: 'SUPERSEDED',
              supersededById: winner.sourceVersionId,
            },
          });
        }
      }

      return [updated, dec];
    });

    this.logger.log(`Conflict ${input.conflictId} adjudicated as ${input.decision} by user ${input.userId}`);
    return { conflict: updatedConflict, decision };
  }

  async getHealthSummary(tenantId: string) {
    const [
      activeConflicts,
      totalSources,
      totalVersions,
      staleVersions,
      recentAuditEvents,
    ] = await Promise.all([
      this.prisma.conflict.count({
        where: { tenantId, status: { in: ['DETECTED', 'IN_REVIEW'] } },
      }),
      this.prisma.source.count({ where: { tenantId } }),
      this.prisma.sourceVersion.count({
        where: { source: { tenantId } },
      }),
      this.prisma.sourceVersion.count({
        where: {
          source: { tenantId },
          status: 'SUPERSEDED',
        },
      }),
      this.prisma.auditEvent.count({
        where: { tenantId },
      }),
    ]);

    return {
      activeConflicts,
      totalSources,
      totalVersions,
      staleVersions,
      recentAuditEvents,
      complianceStatus: activeConflicts === 0 ? 'HEALTHY' : 'ATTENTION_REQUIRED',
    };
  }
}
