import { ConflictsService } from './conflicts.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ConflictsService', () => {
  let service: ConflictsService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      conflict: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        count: jest.fn().mockResolvedValue(1),
      },
      source: {
        count: jest.fn().mockResolvedValue(3),
      },
      sourceVersion: {
        count: jest.fn().mockResolvedValue(5),
        update: jest.fn(),
      },
      auditEvent: {
        count: jest.fn().mockResolvedValue(12),
        create: jest.fn(),
      },
      reviewDecision: {
        create: jest.fn(),
      },
      $transaction: jest.fn(async (cb) => cb(prisma)),
    };

    service = new ConflictsService(prisma as unknown as PrismaService);
  });

  describe('listConflicts', () => {
    it('queries conflicts scoped by tenantId', async () => {
      prisma.conflict.findMany.mockResolvedValueOnce([{ id: 'conf-1' }]);

      const result = await service.listConflicts('tenant-1', 'DETECTED');

      expect(prisma.conflict.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ tenantId: 'tenant-1', status: 'DETECTED' }),
        }),
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('resolveConflict', () => {
    it('throws NotFoundException if conflict does not exist in tenant', async () => {
      prisma.conflict.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.resolveConflict({
          conflictId: 'conf-missing',
          userId: 'user-1',
          tenantId: 'tenant-1',
          decision: 'OVERRIDE_AUTHORITY',
          rationale: 'Valid rationale here.',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException if rationale is missing or too short', async () => {
      prisma.conflict.findFirst.mockResolvedValueOnce({ id: 'conf-1', tenantId: 'tenant-1' });

      await expect(
        service.resolveConflict({
          conflictId: 'conf-1',
          userId: 'user-1',
          tenantId: 'tenant-1',
          decision: 'OVERRIDE_AUTHORITY',
          rationale: 'no',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('records ReviewDecision, updates status, and appends tamper-evident AuditEvent', async () => {
      prisma.conflict.findFirst.mockResolvedValueOnce({ id: 'conf-1', tenantId: 'tenant-1' });
      prisma.conflict.update.mockResolvedValueOnce({ id: 'conf-1', status: 'RESOLVED' });
      prisma.reviewDecision.create.mockResolvedValueOnce({ id: 'dec-1' });

      const result = await service.resolveConflict({
        conflictId: 'conf-1',
        userId: 'user-1',
        tenantId: 'tenant-1',
        decision: 'OVERRIDE_AUTHORITY',
        scopeOverride: 'site:HQ',
        rationale: 'v3.0 supersedes v2.4 per 2026 infrastructure policy.',
      });

      expect(prisma.reviewDecision.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            conflictId: 'conf-1',
            decidedByUserId: 'user-1',
            decision: 'OVERRIDE_AUTHORITY',
          }),
        }),
      );

      expect(prisma.conflict.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'conf-1' },
          data: expect.objectContaining({ status: 'RESOLVED' }),
        }),
      );

      expect(prisma.auditEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: 'tenant-1',
            actorId: 'user-1',
            actionType: 'CONFLICT_OVERRIDE_AUTHORITY',
            payloadHash: expect.any(String),
          }),
        }),
      );

      expect(result.conflict.status).toBe('RESOLVED');
      expect(prisma.sourceVersion.update).not.toHaveBeenCalled();
    });

    it('marks the losing source version SUPERSEDED when an authority is declared', async () => {
      prisma.conflict.findFirst.mockResolvedValueOnce({
        id: 'conf-1',
        tenantId: 'tenant-1',
        claimA: { id: 'claim-a', sourceVersionId: 'version-old' },
        claimB: { id: 'claim-b', sourceVersionId: 'version-new' },
      });
      prisma.conflict.update.mockResolvedValueOnce({ id: 'conf-1', status: 'RESOLVED' });
      prisma.reviewDecision.create.mockResolvedValueOnce({ id: 'dec-1' });

      await service.resolveConflict({
        conflictId: 'conf-1',
        userId: 'user-1',
        tenantId: 'tenant-1',
        decision: 'OVERRIDE_AUTHORITY',
        authoritativeClaimId: 'claim-b',
        rationale: 'v3.0 is the binding HQ procedure.',
      });

      expect(prisma.sourceVersion.update).toHaveBeenCalledWith({
        where: { id: 'version-old' },
        data: { status: 'SUPERSEDED', supersededById: 'version-new' },
      });
    });
  });

  describe('getHealthSummary', () => {
    it('aggregates operational health and compliance metrics', async () => {
      const summary = await service.getHealthSummary('tenant-1');

      expect(summary.activeConflicts).toBe(1);
      expect(summary.totalSources).toBe(3);
      expect(summary.complianceStatus).toBe('ATTENTION_REQUIRED');
    });
  });
});
