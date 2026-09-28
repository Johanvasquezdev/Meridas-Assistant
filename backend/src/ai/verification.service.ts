import { Injectable, Logger } from '@nestjs/common';
import { RagChunk } from '../rag/rag.service';
import { AiService } from './ai.service';

export type EntailmentRelationship = 'SUPPORTS' | 'CONTRADICTS' | 'NEUTRAL';
export type DecisionState = 'SUPPORTED' | 'CONDITIONAL' | 'CANNOT_ESTABLISH';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH_RISK';

export interface ClaimEntailment {
  claim: string;
  passageId: string;
  passageText: string;
  documentTitle?: string;
  relationship: EntailmentRelationship;
  score: number;
  rationale: string;
}

export interface DecisionEvaluationResult {
  decisionState: DecisionState;
  plainAnswer: string;
  missingEvidenceGap?: string;
  evaluations: ClaimEntailment[];
  contradictionsDetected: number;
  supportRatio: number;
}

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(private readonly aiService: AiService) {}

  /**
   * Sanitizes payloads in accordance with docs/POLITICS.md Section 4.2:
   * Masks RFC 1918 private IPs, MAC addresses, and credentials before external dispatch.
   */
  scrubSensitiveData(text: string): string {
    if (!text) return '';

    return text
      // RFC 1918 IPs: 10.x.x.x, 172.16-31.x.x, 192.168.x.x
      .replace(/\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[REDACTED_IP_INTERNAL]')
      .replace(/\b172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b/g, '[REDACTED_IP_INTERNAL]')
      .replace(/\b192\.168\.\d{1,3}\.\d{1,3}\b/g, '[REDACTED_IP_INTERNAL]')
      // MAC addresses
      .replace(/\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\b/g, '[REDACTED_MAC]')
      // API Keys / Bearer tokens
      .replace(/Bearer\s+[A-Za-z0-9_\-\.]{16,}/gi, 'Bearer [REDACTED_TOKEN]')
      .replace(/(?:password|secret|apikey|api_key)\s*[:=]\s*["']?[^\s"']+["']?/gi, 'secret: [REDACTED_CREDENTIAL]');
  }

  /**
   * Evaluates the query against retrieved passages using deterministic entailment gating.
   * "Evidence first. Answer second."
   */
  async evaluateEvidenceAndAnswer(
    query: string,
    context: RagChunk[],
    riskLevel: RiskLevel = 'LOW',
    targetScope?: { site?: string; system?: string },
  ): Promise<DecisionEvaluationResult> {
    const cleanQuery = query.trim();

    // 1. Zero evidence check
    if (!context || context.length === 0) {
      return {
        decisionState: 'CANNOT_ESTABLISH',
        plainAnswer:
          'Cannot establish an answer. No verified organizational documentation was found for this query within the requested scope.',
        missingEvidenceGap:
          'Zero relevant source passages retrieved. An authoritative standard operating procedure or policy document must be ingested.',
        evaluations: [],
        contradictionsDetected: 0,
        supportRatio: 0,
      };
    }

    // 2. Perform claim extraction & Natural Language Inference
    const evaluations = await this.performNliVerification(cleanQuery, context, targetScope);

    // 3. Count relationships
    const contradictions = evaluations.filter((e) => e.relationship === 'CONTRADICTS');
    const supported = evaluations.filter((e) => e.relationship === 'SUPPORTS' && e.score >= 0.7);
    const neutral = evaluations.filter((e) => e.relationship === 'NEUTRAL' || e.score < 0.7);

    const supportRatio = evaluations.length > 0 ? supported.length / evaluations.length : 0;

    // 4. Deterministic State Evaluation
    let decisionState: DecisionState = 'SUPPORTED';
    let missingEvidenceGap: string | undefined;

    if (contradictions.length > 0) {
      // Direct contradiction detected across retrieved sources!
      decisionState = 'CANNOT_ESTABLISH';
      missingEvidenceGap = `Conflicting claims detected between active documentation versions (${contradictions.length} contradiction(s)). An operational custodian must adjudicate authority before an answer can be certified.`;
    } else if (riskLevel === 'HIGH_RISK' && supportRatio < 1.0) {
      // High-risk questions (security, credentials, hardware wipe) require 100% verified support
      decisionState = 'CANNOT_ESTABLISH';
      missingEvidenceGap = `Query is marked HIGH_RISK. Only ${Math.round(supportRatio * 100)}% of candidate claims are strictly entailed by active documentation. Full policy proof required.`;
    } else if (supported.length === 0 || supportRatio < 0.5) {
      decisionState = 'CANNOT_ESTABLISH';
      missingEvidenceGap = `Insufficient evidence: only ${Math.round(supportRatio * 100)}% of claims could be verified against retrieved passages.`;
    } else if (supportRatio < 1.0 || neutral.length > 0) {
      decisionState = 'CONDITIONAL';
      missingEvidenceGap = `Answer is conditional: verified for primary procedure, but boundary conditions for ${neutral.map((n) => `"${n.claim}"`).join(', ')} cannot be established from current documentation.`;
    }

    // 5. Plain Answer Synthesis
    let plainAnswer: string;

    if (decisionState === 'CANNOT_ESTABLISH') {
      plainAnswer = `**Evidence Assessment: Cannot Establish Answer**\n\n${missingEvidenceGap}\n\n*Action Required:* This knowledge gap has been flagged for human review. Please consult the Conflict Desk or request a documentation update.`;
    } else {
      // Synthesize answer based strictly on supported claims
      plainAnswer = await this.synthesizeGroundedAnswer(cleanQuery, context, supported, decisionState, missingEvidenceGap);
    }

    return {
      decisionState,
      plainAnswer,
      missingEvidenceGap,
      evaluations,
      contradictionsDetected: contradictions.length,
      supportRatio,
    };
  }

  private async performNliVerification(
    query: string,
    context: RagChunk[],
    scope?: { site?: string; system?: string },
  ): Promise<ClaimEntailment[]> {
    const formattedPassages = context.map((c, i) => {
      return `[P${i + 1} | id: ${c.vectorId} | doc: ${c.metadata?.documentTitle || 'Document'}]\n${this.scrubSensitiveData(c.text)}`;
    }).join('\n\n');

    const prompt = `You are the MERIDAS Evidence Verification Engine.
Operating Principle: "Evidence first. Answer second."

Analyze the following operational question and candidate source passages.
Question: "${query}"
Scope Constraints: Site="${scope?.site || 'Any'}", System="${scope?.system || 'Any'}"

Candidate Passages:
${formattedPassages}

Tasks:
1. Extract 1 to 4 atomic, verifiable operational claims required to answer the question.
2. For each claim, evaluate against the passages and determine:
   - "relationship": "SUPPORTS" (passage directly entails and proves claim), "CONTRADICTS" (passage directly refutes or contradicts claim), or "NEUTRAL" (passage does not address or is ambiguous).
   - "score": confidence between 0.0 and 1.0.
   - "passageIndex": 1-based index (e.g. 1 for P1) of the strongest relevant passage.
   - "rationale": 1 short sentence citing specific wording.

Output JSON ONLY in this format:
{
  "claims": [
    {
      "claim": "Atomic claim statement",
      "relationship": "SUPPORTS" | "CONTRADICTS" | "NEUTRAL",
      "score": 0.95,
      "passageIndex": 1,
      "rationale": "Directly stated in section 2."
    }
  ]
}`;

    try {
      const response = await this.aiService.callDirectJsonPrompt(prompt);
      const parsed = JSON.parse(response);

      if (Array.isArray(parsed?.claims)) {
        return parsed.claims.map((item: any) => {
          const pIndex = Math.max(0, Math.min(context.length - 1, (item.passageIndex || 1) - 1));
          const chunk = context[pIndex];
          return {
            claim: String(item.claim || 'Operational claim'),
            passageId: chunk?.vectorId || `passage-${pIndex}`,
            passageText: chunk?.text || '',
            documentTitle: chunk?.metadata?.documentTitle || 'Operational Document',
            relationship: ['SUPPORTS', 'CONTRADICTS', 'NEUTRAL'].includes(item.relationship)
              ? item.relationship
              : 'NEUTRAL',
            score: Number(item.score) || 0.5,
            rationale: String(item.rationale || 'Evaluated against passage'),
          };
        });
      }
    } catch (err: any) {
      this.logger.warn(`NLI verification fallback triggered: ${err.message}`);
    }

    // Heuristic fallback if JSON fails or model returns non-JSON
    return context.map((c, i) => ({
      claim: `Passage assertion from ${c.metadata?.documentTitle || 'source'}`,
      passageId: c.vectorId,
      passageText: c.text,
      documentTitle: c.metadata?.documentTitle,
      relationship: c.score >= 0.65 ? 'SUPPORTS' : 'NEUTRAL',
      score: c.score,
      rationale: `Retrieved with hybrid score ${c.score.toFixed(3)}`,
    }));
  }

  private async synthesizeGroundedAnswer(
    query: string,
    context: RagChunk[],
    supported: ClaimEntailment[],
    decisionState: DecisionState,
    missingEvidenceGap?: string,
  ): Promise<string> {
    const supportedPoints = supported.map((s, idx) => `[${idx + 1}] ${s.claim} (Source: ${s.documentTitle})`).join('\n');

    const prompt = `Synthesize a clear, direct operational answer strictly from the following verified facts:

Question: "${query}"

Verified Evidence Points:
${supportedPoints}

Decision State: ${decisionState}
${missingEvidenceGap ? `Known Missing Boundaries: ${missingEvidenceGap}` : ''}

Rules:
1. State the verified facts directly and concisely.
2. Cite the source evidence points as [1], [2], etc.
3. If State is CONDITIONAL, include a clear "Operational Caveat / Limit" paragraph noting what is not covered.
4. Do NOT speculate or invent extra steps not listed in the verified points.`;

    const summary = await this.aiService.generateSummary(prompt);
    return summary;
  }
}
