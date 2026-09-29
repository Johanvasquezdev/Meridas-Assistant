import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Meridas Operational Evidence Pilot Dataset...');

  // 1. Resolve or create Default Tenant
  const pilotKeyHash = crypto.createHash('sha256').update('mrd_live_8f3b299ae71a45cd90bc').digest('hex');
  let tenant = await prisma.tenant.findUnique({
    where: { apiKeyHash: pilotKeyHash },
  });
  if (!tenant) {
    const firstTenant = await prisma.tenant.findFirst();
    if (firstTenant) {
      tenant = await prisma.tenant.update({
        where: { id: firstTenant.id },
        data: { apiKeyHash: pilotKeyHash, name: 'Blue Hawk Operations Workspace' },
      });
    } else {
      tenant = await prisma.tenant.create({
        data: {
          name: 'Blue Hawk Operations Workspace',
          apiKeyHash: pilotKeyHash,
        },
      });
    }
  }

  console.log(`Using Tenant: ${tenant.name} (${tenant.id}) with apiKeyHash: ${pilotKeyHash.slice(0, 12)}...`);

  const docsDir = path.join(__dirname, 'operational-pilot-docs');
  const files = fs.readdirSync(docsDir).filter((f) => f.endsWith('.md'));

  // 2. Ingest Source: VPN Gateway Standard
  const vpnSource = await prisma.source.upsert({
    where: { id: 'source-vpn-gateway' },
    update: {},
    create: {
      id: 'source-vpn-gateway',
      tenantId: tenant.id,
      title: 'GlobalProtect VPN Standard Operating Procedure',
      domain: 'IT_INFRASTRUCTURE',
      scopeSite: 'HQ',
      scopeSystem: 'NETWORK',
      ownerEmail: 'johan.vasquez@bluehawk.tech',
      authorityRank: 1,
    },
  });

  // Version 2.4 (Superseded)
  const v24Content = fs.readFileSync(path.join(docsDir, 'VPN-GlobalProtect-v2.4-Superseded.md'), 'utf-8');
  const v24Hash = crypto.createHash('sha256').update(v24Content).digest('hex');
  const v24 = await prisma.sourceVersion.upsert({
    where: { sourceId_versionNumber: { sourceId: vpnSource.id, versionNumber: 'v2.4' } },
    update: {},
    create: {
      sourceId: vpnSource.id,
      versionNumber: 'v2.4',
      status: 'SUPERSEDED',
      fileHash: v24Hash,
      effectiveDate: new Date('2024-01-15'),
      expirationDate: new Date('2025-12-31'),
      author: 'Infrastructure Ops',
    },
  });

  const p24 = await prisma.passage.create({
    data: {
      sourceVersionId: v24.id,
      passageIndex: 1,
      text: 'Gateway Address: vpn-legacy.internal.bluehawk.com. Default Port: Port 443 (TCP/SSL). Authentication: Single username/password with optional SMS OTP.',
      sectionTitle: 'Gateway Parameters',
    },
  });

  const claim24 = await prisma.claim.create({
    data: {
      tenantId: tenant.id,
      sourceVersionId: v24.id,
      passageId: p24.id,
      statement: 'GlobalProtect VPN gateway connects on Port 443 with optional SMS OTP.',
      scopeKey: 'site:HQ;sys:VPN',
      temporalScope: '2024',
    },
  });

  // Version 3.0 (Active)
  const v30Content = fs.readFileSync(path.join(docsDir, 'VPN-GlobalProtect-v3.0-Active-HQ.md'), 'utf-8');
  const v30Hash = crypto.createHash('sha256').update(v30Content).digest('hex');
  const v30 = await prisma.sourceVersion.upsert({
    where: { sourceId_versionNumber: { sourceId: vpnSource.id, versionNumber: 'v3.0' } },
    update: {},
    create: {
      sourceId: vpnSource.id,
      versionNumber: 'v3.0',
      status: 'ACTIVE',
      fileHash: v30Hash,
      effectiveDate: new Date('2026-01-01'),
      author: 'Johan Vasquez',
      supersededById: v24.id,
    },
  });

  const p30 = await prisma.passage.create({
    data: {
      sourceVersionId: v30.id,
      passageIndex: 1,
      text: 'Gateway Address: vpn-hq.internal.bluehawk.com. Mandatory Port: Port 8443 (TLS 1.3 Strict). Authentication: Active Directory + Mandatory Duo Mobile Hardware Push MFA. SMS strictly prohibited.',
      sectionTitle: 'Gateway Connection Parameters',
    },
  });

  const claim30 = await prisma.claim.create({
    data: {
      tenantId: tenant.id,
      sourceVersionId: v30.id,
      passageId: p30.id,
      statement: 'GlobalProtect VPN gateway connects on Port 8443 with mandatory Duo Push MFA (SMS prohibited).',
      scopeKey: 'site:HQ;sys:VPN',
      temporalScope: '2026',
    },
  });

  // Pre-seed detected Conflict between v2.4 and v3.0!
  await prisma.conflict.create({
    data: {
      tenantId: tenant.id,
      claimAId: claim24.id,
      claimBId: claim30.id,
      conflictType: 'DIRECT_CONTRADICTION',
      severity: 'HIGH',
      status: 'DETECTED',
      assignedTo: 'johan.vasquez@bluehawk.tech',
    },
  });

  // Also ingest into Document and DocumentChunk tables for RAG hybrid search compatibility across all tenants
  const allTenants = await prisma.tenant.findMany();
  console.log(`Ingesting 5 operational directives across ${allTenants.length} workspaces...`);

  for (const t of allTenants) {
    for (const file of files) {
      const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');
      const title = file.replace(/\.md$/, '').replace(/-/g, ' ');
      let doc = await prisma.document.findFirst({
        where: { tenantId: t.id, title },
      });
      if (doc) {
        doc = await prisma.document.update({
          where: { id: doc.id },
          data: { content, status: 'READY' },
        });
      } else {
        doc = await prisma.document.create({
          data: {
            tenantId: t.id,
            title,
            content,
            status: 'READY',
          },
        });
      }

      // Delete existing chunks for this document to prevent duplicates
      await prisma.documentChunk.deleteMany({
        where: { documentId: doc.id },
      });

      // Create semantic section chunks + full text chunk
      const rawSections = content.split(/\n(?=###?\s)/).filter((s) => s.trim().length > 0);
      const chunkTexts = [content, ...rawSections];

      for (let i = 0; i < chunkTexts.length; i++) {
        const text = chunkTexts[i].trim();
        const chunkId = crypto.randomUUID();
        const vectorId = `mrd-vec-${doc.id}-${i}`;

        await prisma.documentChunk.create({
          data: {
            id: chunkId,
            tenantId: t.id,
            documentId: doc.id,
            chunkIndex: i,
            text,
            vectorId,
          },
        });
      }
    }

    // Ensure full-text search vectors are computed for all chunks
    await prisma.$executeRaw`
      UPDATE "DocumentChunk"
      SET search_vector = to_tsvector('english', text)
      WHERE "tenantId" = ${t.id}
    `;
    console.log(`Seeded directives for workspace: ${t.name} (${t.id})`);
  }

  await linkPilotPassagesToChunks(tenant.id, v24.id, p24.id, 'VPN GlobalProtect v2.4 Superseded');
  await linkPilotPassagesToChunks(tenant.id, v30.id, p30.id, 'VPN GlobalProtect v3.0 Active HQ');

  console.log('Meridas Pilot Dataset Seed Complete: 5 operational docs across all workspaces, DocumentChunks generated with tsvector.');
}

async function linkPilotPassagesToChunks(
  tenantId: string,
  versionId: string,
  primaryPassageId: string,
  title: string,
) {
  const doc = await prisma.document.findFirst({ where: { tenantId, title } });
  if (!doc) return;

  const chunks = await prisma.documentChunk.findMany({
    where: { documentId: doc.id },
    orderBy: { chunkIndex: 'asc' },
  });

  if (chunks[0]) {
    await prisma.passage.update({
      where: { id: primaryPassageId },
      data: { vectorId: chunks[0].vectorId },
    });
  }

  for (const chunk of chunks.slice(1)) {
    await prisma.passage.create({
      data: {
        sourceVersionId: versionId,
        passageIndex: chunk.chunkIndex,
        text: chunk.text.slice(0, 2000),
        vectorId: chunk.vectorId,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
