import { VerificationService } from './verification.service';
import { AiService } from './ai.service';
import { RagChunk } from '../rag/rag.service';

describe('VerificationService', () => {
  let service: VerificationService;
  let aiService: Partial<AiService>;

  beforeEach(() => {
    aiService = {
      callDirectJsonPrompt: jest.fn(),
      generateSummary: jest.fn().mockResolvedValue('Synthesized verified answer.'),
    };
    service = new VerificationService(aiService as AiService);
  });

  describe('scrubSensitiveData', () => {
    it('masks RFC 1918 IPs, MAC addresses, and credentials per POLITICS.md', () => {
      const input =
        'Connecting to gateway 192.168.1.1 on interface 00:1A:2B:3C:4D:5E with Bearer eyJhbGciOiJIUzI1Ni... and password = "SuperSecretPassword123"';
      const scrubbed = service.scrubSensitiveData(input);

      expect(scrubbed).not.toContain('192.168.1.1');
      expect(scrubbed).toContain('[REDACTED_IP_INTERNAL]');
      expect(scrubbed).not.toContain('00:1A:2B:3C:4D:5E');
      expect(scrubbed).toContain('[REDACTED_MAC]');
      expect(scrubbed).not.toContain('SuperSecretPassword123');
      expect(scrubbed).toContain('[REDACTED_CREDENTIAL]');
    });
  });

  describe('evaluateEvidenceAndAnswer', () => {
    it('returns CANNOT_ESTABLISH when context is empty', async () => {
      const result = await service.evaluateEvidenceAndAnswer('How to configure VPN?', []);

      expect(result.decisionState).toBe('CANNOT_ESTABLISH');
      expect(result.evaluations).toHaveLength(0);
      expect(result.missingEvidenceGap).toContain('Zero relevant source passages');
    });

    it('returns CANNOT_ESTABLISH when contradictory claims exist across sources', async () => {
      const mockChunks: RagChunk[] = [
        {
          vectorId: 'chunk-1',
          score: 0.9,
          text: 'Use port 443 for VPN gateway.',
          metadata: { tenantId: 't1', text: 'Use port 443 for VPN gateway.', documentTitle: 'VPN v2' },
        },
      ];

      (aiService.callDirectJsonPrompt as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({
          claims: [
            {
              claim: 'Gateway requires port 443',
              relationship: 'CONTRADICTS',
              score: 0.95,
              passageIndex: 1,
              rationale: 'Source asserts port 8443 is mandatory.',
            },
          ],
        }),
      );

      const result = await service.evaluateEvidenceAndAnswer('What port is used for VPN?', mockChunks);

      expect(result.decisionState).toBe('CANNOT_ESTABLISH');
      expect(result.contradictionsDetected).toBe(1);
      expect(result.missingEvidenceGap).toContain('Conflicting claims detected');
    });

    it('returns SUPPORTED when all claims are entailed with high score', async () => {
      const mockChunks: RagChunk[] = [
        {
          vectorId: 'chunk-1',
          score: 0.9,
          text: 'GlobalProtect VPN requires Duo Mobile MFA.',
          metadata: { tenantId: 't1', text: 'GlobalProtect VPN requires Duo Mobile MFA.', documentTitle: 'VPN SOP' },
        },
      ];

      (aiService.callDirectJsonPrompt as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({
          claims: [
            {
              claim: 'GlobalProtect VPN requires Duo Mobile MFA',
              relationship: 'SUPPORTS',
              score: 0.95,
              passageIndex: 1,
              rationale: 'Directly stated in section 1.',
            },
          ],
        }),
      );

      const result = await service.evaluateEvidenceAndAnswer('Does VPN require Duo MFA?', mockChunks);

      expect(result.decisionState).toBe('SUPPORTED');
      expect(result.supportRatio).toBe(1.0);
      expect(result.contradictionsDetected).toBe(0);
    });

    it('returns CONDITIONAL when claims are partially supported on low risk', async () => {
      const mockChunks: RagChunk[] = [
        {
          vectorId: 'chunk-1',
          score: 0.85,
          text: 'macOS clients can download profile from internal portal.',
          metadata: { tenantId: 't1', text: 'macOS clients...', documentTitle: 'VPN SOP' },
        },
      ];

      (aiService.callDirectJsonPrompt as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({
          claims: [
            {
              claim: 'macOS profile available from portal',
              relationship: 'SUPPORTS',
              score: 0.9,
              passageIndex: 1,
              rationale: 'Stated.',
            },
            {
              claim: 'Linux terminals support portal download',
              relationship: 'NEUTRAL',
              score: 0.3,
              passageIndex: 1,
              rationale: 'Linux is not mentioned in documentation.',
            },
          ],
        }),
      );

      const result = await service.evaluateEvidenceAndAnswer('Can Linux clients use the portal?', mockChunks, 'LOW');

      expect(result.decisionState).toBe('CONDITIONAL');
      expect(result.missingEvidenceGap).toContain('boundary conditions');
    });

    it('strictly returns CANNOT_ESTABLISH on HIGH_RISK queries with incomplete support', async () => {
      const mockChunks: RagChunk[] = [
        {
          vectorId: 'chunk-1',
          score: 0.8,
          text: 'Root access requires supervisor key.',
          metadata: { tenantId: 't1', text: 'Root access...', documentTitle: 'Security Manual' },
        },
      ];

      (aiService.callDirectJsonPrompt as jest.Mock).mockResolvedValueOnce(
        JSON.stringify({
          claims: [
            {
              claim: 'Supervisor key required',
              relationship: 'SUPPORTS',
              score: 0.85,
              passageIndex: 1,
              rationale: 'Confirmed.',
            },
            {
              claim: 'Temporary emergency bypass allowed without key',
              relationship: 'NEUTRAL',
              score: 0.2,
              passageIndex: 1,
              rationale: 'No mention of emergency bypass in text.',
            },
          ],
        }),
      );

      const result = await service.evaluateEvidenceAndAnswer(
        'Can I bypass supervisor key for emergency decommission?',
        mockChunks,
        'HIGH_RISK',
      );

      expect(result.decisionState).toBe('CANNOT_ESTABLISH');
      expect(result.missingEvidenceGap).toContain('Query is marked HIGH_RISK');
    });
  });
});
