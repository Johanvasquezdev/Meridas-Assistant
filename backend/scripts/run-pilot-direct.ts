import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { AiService } from '../src/ai/ai.service';
import { VerificationService } from '../src/ai/verification.service';
import { RagChunk } from '../src/rag/rag.service';
require('dotenv').config();

async function main() {
  console.log('================================================================');
  console.log('MERIDAS OPERATIONAL EVIDENCE INTELLIGENCE — DIRECT PILOT RUNNER');
  console.log('Core Principle: Evidence first. Answer second.');
  console.log('================================================================\n');

  const configService = new ConfigService(process.env);
  const aiService = new AiService(configService);
  const verificationService = new VerificationService(aiService);

  const docsDir = path.join(__dirname, '..', 'seeds', 'operational-pilot-docs');
  const files = fs.readdirSync(docsDir).filter((f) => f.endsWith('.md'));

  const loadedDocs = files.map((file) => ({
    filename: file,
    title: file.replace(/\.md$/, '').replace(/-/g, ' '),
    content: fs.readFileSync(path.join(docsDir, file), 'utf-8'),
  }));

  console.log(`Loaded ${loadedDocs.length} operational SOP directives:\n` +
    loadedDocs.map((d) => `  • ${d.title}`).join('\n') + '\n');

  function getChunks(keyword: string): RagChunk[] {
    const matched = loadedDocs.filter((d) =>
      d.title.toLowerCase().includes(keyword.toLowerCase()) ||
      d.content.toLowerCase().includes(keyword.toLowerCase())
    );

    return matched.map((d, idx) => ({
      vectorId: `doc-${idx + 1}`,
      score: 0.95 - idx * 0.05,
      text: d.content,
      metadata: {
        tenantId: 'pilot-tenant',
        text: d.content,
        documentId: `doc-${idx + 1}`,
        documentTitle: d.title,
        chunkIndex: 0,
      },
    }));
  }

  const testCases = [
    {
      id: 'PILOT-Q1',
      question: 'What is the active port and MFA method for GlobalProtect VPN?',
      scope: { site: 'HQ', system: 'VPN' },
      riskLevel: 'LOW' as const,
      context: getChunks('vpn'),
    },
    {
      id: 'PILOT-Q2',
      question: 'Can an engineer retain a lab laptop for 3 weeks without warehouse check-in?',
      scope: { site: 'Lab', system: 'Hardware' },
      riskLevel: 'HIGH_RISK' as const,
      context: getChunks('custody'),
    },
    {
      id: 'PILOT-Q3',
      question: 'What authorization is required for an emergency server decommissioning?',
      scope: { site: 'Datacenter', system: 'Compute' },
      riskLevel: 'HIGH_RISK' as const,
      context: getChunks('decommissioning'),
    },
  ];

  for (const tc of testCases) {
    console.log('----------------------------------------------------------------');
    console.log(`[${tc.id}] INQUIRY: "${tc.question}"`);
    console.log(`Perimeter Scope: Site=${tc.scope.site}, System=${tc.scope.system} | Risk=${tc.riskLevel}`);
    console.log(`Retrieved Evidence Directives (${tc.context.length}):`);
    tc.context.forEach((c, i) => {
      console.log(`  [Directive ${i + 1}]: "${c.metadata.documentTitle}"`);
    });

    console.log('\nRunning NLI Verification Engine (Cohere Command R+)...');
    const start = Date.now();
    const result = await verificationService.evaluateEvidenceAndAnswer(
      tc.question,
      tc.context,
      tc.riskLevel,
      tc.scope,
    );
    const duration = Date.now() - start;

    console.log(`\n>>> DECISION STATE: [ ${result.decisionState} ] (evaluated in ${duration}ms)`);
    console.log(`    Contradictions Detected: ${result.contradictionsDetected}`);
    console.log(`    Support Ratio: ${(result.supportRatio * 100).toFixed(1)}%`);
    if (result.missingEvidenceGap) {
      console.log(`    Flagged Gap / Conflict: ${result.missingEvidenceGap}`);
    }

    console.log('\n>>> ATOMIC CLAIM EVALUATIONS:');
    result.evaluations.forEach((ev, idx) => {
      console.log(`    [Claim ${idx + 1}] "${ev.claim}"`);
      console.log(`      Relationship: ${ev.relationship} | Score: ${(ev.score * 100).toFixed(0)}%`);
      console.log(`      Direct Citation: ${ev.documentTitle || ev.passageId}`);
      console.log(`      Rationale: ${ev.rationale}`);
    });

    console.log('\n>>> CERTIFIED ANSWER / RESPONSE:');
    console.log(result.plainAnswer);
    console.log('----------------------------------------------------------------\n');
  }
}

main().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
