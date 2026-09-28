import { RagChunk } from '../../rag/rag.service';

export class ChatResponseDto {
  conversationId: string;
  message: string;
  context: RagChunk[];
  decisionState?: 'SUPPORTED' | 'CONDITIONAL' | 'CANNOT_ESTABLISH';
  missingEvidenceGap?: string;
  evaluations?: Array<{
    claim: string;
    passageId: string;
    passageText: string;
    documentTitle?: string;
    relationship: 'SUPPORTS' | 'CONTRADICTS' | 'NEUTRAL';
    score: number;
    rationale: string;
  }>;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}
