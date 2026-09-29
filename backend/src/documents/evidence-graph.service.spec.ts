import { EvidenceGraphService } from './evidence-graph.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EvidenceGraphService', () => {
  let service: EvidenceGraphService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      source: { findFirst: jest.fn() },
      documentChunk: { findMany: jest.fn() },
      passage: { findMany: jest.fn() },
    };
    service = new EvidenceGraphService(prisma as unknown as PrismaService);
  });

  it('plans v1 at index 0 when the document has no source yet', async () => {
    prisma.source.findFirst.mockResolvedValueOnce(null);

    const plan = await service.planVersion('tenant-1', 'doc-1', 'Active port is 8443.');

    expect(plan.unchanged).toBe(false);
    expect(plan.versionNumber).toBe('v1');
    expect(plan.indexOffset).toBe(0);
    expect(plan.fileHash).toHaveLength(64);
  });

  it('plans the next version offset when a previous version exists', async () => {
    prisma.source.findFirst.mockResolvedValueOnce({
      versions: [{ fileHash: 'old', versionNumber: 'v1', createdAt: new Date() }],
    });

    const plan = await service.planVersion('tenant-1', 'doc-1', 'Active port is 8443.');

    expect(plan.versionNumber).toBe('v2');
    expect(plan.indexOffset).toBe(10_000);
    expect(plan.unchanged).toBe(false);
  });

  it('drops chunks whose passage belongs to a superseded version', async () => {
    prisma.documentChunk.findMany.mockResolvedValueOnce([
      { id: 'chunk-old', vectorId: 'vec-old' },
      { id: 'chunk-new', vectorId: 'vec-new' },
    ]);
    prisma.passage.findMany.mockResolvedValueOnce([{ vectorId: 'vec-old' }]);

    const kept = await service.excludeSuperseded('tenant-1', [
      { vectorId: 'chunk-old', text: 'port 443' },
      { vectorId: 'chunk-new', text: 'port 8443' },
    ]);

    expect(kept).toEqual([{ vectorId: 'chunk-new', text: 'port 8443' }]);
  });
});
