'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/use-api';
import { 
  Terminal, 
  Key, 
  MessageSquare, 
  Search, 
  FileText, 
  Activity,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Code,
  BookOpen,
  Lock,
  Scale,
  Compass,
  AlertTriangle,
  HeartPulse,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_V1_URL = `${API_BASE_URL}/api/v1`;

type DocSection = 
  | 'getting-started' 
  | 'authentication' 
  | 'verification-protocol' 
  | 'widget-integration' 
  | 'chat' 
  | 'search' 
  | 'documents' 
  | 'usage' 
  | 'health' 
  | 'rate-limits';

interface NavItem {
  id: DocSection;
  label: string;
  icon: any;
  badge?: string;
  badgeColor?: 'emerald' | 'blue';
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function ApiReferencePage() {
  const api = useApi();
  const { show: toast } = useToast();
  const [apiKey, setApiKey] = useState('mrd_live_8f3b299ae71a45cd90bc');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<DocSection>('getting-started');
  const [codeLang, setCodeLang] = useState<'curl' | 'ts' | 'py'>('curl');

  useEffect(() => {
    async function fetchData() {
      try {
        const keysRes = await api.get('/auth/keys');
        if (keysRes.data?.apiKey) {
          setApiKey(keysRes.data.apiKey);
        }
      } catch (err) {
        console.warn('Using seeded institutional API token');
      }
    }
    fetchData();
  }, []);

  const copyToClipboard = (text: string, id: string, isKey = false) => {
    navigator.clipboard.writeText(text);
    if (isKey) {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
      toast('API key copied to clipboard');
    } else {
      setCopiedSnippet(id);
      setTimeout(() => setCopiedSnippet(null), 2000);
      toast('Snippet copied to clipboard');
    }
  };

  const navGroups: NavGroup[] = [
    {
      title: 'Architecture & Overview',
      items: [
        { id: 'getting-started' as DocSection, label: 'Getting Started', icon: BookOpen },
        { id: 'authentication' as DocSection, label: 'Authentication & Tokens', icon: Lock },
        { id: 'verification-protocol' as DocSection, label: 'Evidence Verification Protocol', icon: Scale },
        { id: 'widget-integration' as DocSection, label: 'Embeddable Widget', icon: Compass },
      ]
    },
    {
      title: 'REST Endpoints',
      items: [
        { id: 'chat' as DocSection, label: 'POST /chat', icon: MessageSquare, badge: 'POST', badgeColor: 'emerald' },
        { id: 'search' as DocSection, label: 'POST /search', icon: Search, badge: 'POST', badgeColor: 'emerald' },
        { id: 'documents' as DocSection, label: 'GET /documents', icon: FileText, badge: 'GET', badgeColor: 'blue' },
        { id: 'usage' as DocSection, label: 'GET /usage', icon: Activity, badge: 'GET', badgeColor: 'blue' },
        { id: 'health' as DocSection, label: 'GET /health', icon: HeartPulse, badge: 'GET', badgeColor: 'blue' },
      ]
    },
    {
      title: 'Governance & Ops',
      items: [
        { id: 'rate-limits' as DocSection, label: 'Rate Limits & Errors', icon: AlertTriangle },
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Top Banner */}
      <div className="space-y-4 border-b border-[#2A2832] pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#C9A227]">
            <Terminal className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">Developer Architecture</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/settings/widget"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#1C1B20] hover:bg-[#25232B] border border-[#2A2832] text-[#8C8A94] hover:text-[#F7F3EA] text-xs font-mono transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Widget Settings</span>
            </Link>
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] bg-[#9E1B32] hover:bg-[#BA243F] border border-[#C9A227]/40 text-[#F7F3EA] text-xs font-mono font-semibold transition-all shadow-md shadow-[#9E1B32]/25"
            >
              <span>Query Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-[#F7F3EA] tracking-tight">API Governance &amp; Reference</h1>
        <p className="text-sm text-[#8C8A94] max-w-3xl leading-relaxed">
          Comprehensive developer reference for MERIDAS Operational Intelligence. Ground programmatic answers
          in verified enterprise directives, execute hybrid vector/lexical search, and embed verifiable shadow DOM widgets.
        </p>

        {/* API Ingress Key Card */}
        <div className="mt-4 bg-[#1C1B20] border border-[#2A2832] rounded-[14px] p-5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#9E1B32]/15 border border-[#C9A227]/30 rounded-[8px]">
                <Key className="w-4 h-4 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#F7F3EA]">Active Tenant Ingress Token</h3>
                <p className="text-xs text-[#8C8A94]">Scoped to your isolated operational knowledge vault</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-[#151417] border border-[#2A2832] rounded-[8px] px-3.5 py-2">
              <code className="font-mono text-xs text-[#DFB943] select-all">{apiKey}</code>
              <button 
                onClick={() => copyToClipboard(apiKey, 'main-key', true)}
                className="p-1 hover:bg-white/5 rounded text-[#8C8A94] hover:text-[#C9A227] transition-colors cursor-pointer"
                title="Copy API Token"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <h3 className="text-[11px] font-mono font-bold text-[#8C8A94] uppercase tracking-wider px-3">
                {group.title}
              </h3>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-[8px] transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#9E1B32]/15 text-[#F7F3EA] font-semibold border border-[#C9A227]/40 shadow-sm' 
                        : 'text-[#8C8A94] hover:bg-[#1C1B20] hover:text-[#F7F3EA]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#C9A227]' : 'text-[#8C8A94]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        item.badgeColor === 'emerald' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Evidence Contract Quick Card */}
          <div className="rounded-[14px] border border-[#2A2832] bg-[#1C1B20] p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F7F3EA]">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>Evidence Contract</span>
            </div>
            <p className="text-[11px] text-[#8C8A94] leading-relaxed">
              Every inference payload returns strict <code className="text-[#C9A227]">decisionState</code>, NLI claim validations, and SHA-256 source citations.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8 min-w-0">

          {/* 1. GETTING STARTED */}
          {activeSection === 'getting-started' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A227] font-bold">Introduction</span>
                <h2 className="text-2xl font-bold text-[#F7F3EA]">Getting Started with MERIDAS</h2>
                <p className="text-sm text-[#8C8A94] leading-relaxed">
                  MERIDAS is engineered under the principle: <strong className="text-[#F7F3EA]">Evidence first. Answer second.</strong> The system
                  does not generate speculative text when authoritative operational directives are absent, superseded, or contradictory.
                </p>
              </div>

              {/* Base URLs */}
              <div className="rounded-[14px] border border-[#2A2832] bg-[#1C1B20] p-5 space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F7F3EA] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#C9A227]" />
                  API Base URLs
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#151417] border border-[#2A2832]">
                    <span className="text-[#8C8A94]">Local Ingress:</span>
                    <span className="text-[#DFB943]">http://localhost:3001/api/v1</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-[8px] bg-[#151417] border border-[#2A2832]">
                    <span className="text-[#8C8A94]">Production Gateway:</span>
                    <span className="text-[#DFB943]">https://api.meridas.ai/api/v1</span>
                  </div>
                </div>
              </div>

              {/* 3 Step Workflow */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A94]">
                  Operational Ingestion Cycle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-[12px] border border-[#2A2832] bg-[#1C1B20] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#C9A227]">01. INGEST</span>
                      <FileText className="w-4 h-4 text-[#8C8A94]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#F7F3EA]">Directives &amp; SOPs</h4>
                    <p className="text-[11px] text-[#8C8A94] leading-relaxed">
                      Upload security runbooks, hardware policies, and architecture directives into the Knowledge Vault.
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-[#2A2832] bg-[#1C1B20] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#C9A227]">02. VERIFY</span>
                      <Scale className="w-4 h-4 text-[#C9A227]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#F7F3EA]">NLI Contradiction Scan</h4>
                    <p className="text-[11px] text-[#8C8A94] leading-relaxed">
                      Proactive scanner evaluates conflicting claims across versions (e.g. VPN v2.4 vs v3.0) and routes to Conflict Desk.
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-[#2A2832] bg-[#1C1B20] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#C9A227]">03. SERVE</span>
                      <Cpu className="w-4 h-4 text-[#8C8A94]" />
                    </div>
                    <h4 className="text-xs font-bold text-[#F7F3EA]">Grounded Generation</h4>
                    <p className="text-[11px] text-[#8C8A94] leading-relaxed">
                      Cohere Command R+ synthesizes grounded answers with strict citation indexes and decision states.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quickstart snippet */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A94]">
                    Quickstart: First Evidence Request
                  </h3>
                  <div className="flex items-center gap-1.5 bg-[#151417] p-1 rounded-[6px] border border-[#2A2832]">
                    {(['curl', 'ts', 'py'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setCodeLang(lang)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold transition-colors cursor-pointer ${
                          codeLang === lang ? 'bg-[#9E1B32] text-[#F7F3EA]' : 'text-[#8C8A94] hover:text-[#F7F3EA]'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#151417] border border-[#2A2832] rounded-[12px] p-5 relative group">
                  <button
                    onClick={() => copyToClipboard(
                      codeLang === 'curl' 
                        ? `curl -X POST ${API_V1_URL}/chat \\\n  -H "x-api-key: ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "What is the active port and MFA method for GlobalProtect VPN v3.0?"}'`
                        : codeLang === 'ts'
                        ? `const res = await fetch('${API_V1_URL}/chat', {\n  method: 'POST',\n  headers: { 'x-api-key': '${apiKey}', 'Content-Type': 'application/json' },\n  body: JSON.stringify({ message: 'What is the active port and MFA method for GlobalProtect VPN v3.0?' })\n});\nconst data = await res.json();\nconsole.log(data.decisionState, data.answer);`
                        : `import requests\n\nres = requests.post(\n    '${API_V1_URL}/chat',\n    headers={'x-api-key': '${apiKey}'},\n    json={'message': 'What is the active port and MFA method for GlobalProtect VPN v3.0?'}\n)\nprint(res.json())`,
                      'quickstart'
                    )}
                    className="absolute top-4 right-4 p-2 bg-[#1C1B20] border border-[#2A2832] rounded-[6px] text-[#8C8A94] hover:text-[#C9A227] transition-all cursor-pointer"
                  >
                    {copiedSnippet === 'quickstart' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <pre className="font-mono text-xs text-[#DFB943] leading-relaxed overflow-x-auto">
                    {codeLang === 'curl' && `curl -X POST ${API_V1_URL}/chat \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "What is the active port and MFA method for GlobalProtect VPN v3.0?",
    "mode": "answer"
  }'`}

                    {codeLang === 'ts' && `// Node.js 18+ / Browser Fetch
const response = await fetch('${API_V1_URL}/chat', {
  method: 'POST',
  headers: {
    'x-api-key': '${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'What is the active port and MFA method for GlobalProtect VPN v3.0?',
    mode: 'answer'
  })
});

const data = await response.json();
console.log('Decision State:', data.decisionState); // "SUPPORTED"
console.log('Verified Answer:', data.answer);
console.log('Evaluations:', data.evaluations);`}

                    {codeLang === 'py' && `# Python 3.10+
import requests

url = "${API_V1_URL}/chat"
headers = {
    "x-api-key": "${apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "message": "What is the active port and MFA method for GlobalProtect VPN v3.0?",
    "mode": "answer"
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()

print(f"Decision: {data.get('decisionState')}")
print(f"Answer: {data.get('answer')}")`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 2. AUTHENTICATION */}
          {activeSection === 'authentication' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A227] font-bold">Security Architecture</span>
                <h2 className="text-2xl font-bold text-[#F7F3EA]">Authentication &amp; Cryptography</h2>
                <p className="text-sm text-[#8C8A94] leading-relaxed">
                  All requests to the MERIDAS REST API must be authenticated using an enterprise ingress key.
                  Raw keys follow the prefix standard <code className="text-[#C9A227]">mrd_live_&lt;32 hex chars&gt;</code> and are
                  hashed via SHA-256 upon generation.
                </p>
              </div>

              <div className="rounded-[14px] border border-[#2A2832] bg-[#1C1B20] p-6 space-y-4">
                <h3 className="text-sm font-semibold text-[#F7F3EA] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#C9A227]" />
                  Ingress Header Specifications
                </h3>
                <p className="text-xs text-[#8C8A94] leading-relaxed">
                  Pass your key in either the <code className="text-[#C9A227]">x-api-key</code> custom header or as a standard Bearer token:
                </p>
                <div className="bg-[#151417] border border-[#2A2832] rounded-[10px] p-4 font-mono text-xs text-[#DFB943] space-y-2">
                  <div>x-api-key: {apiKey}</div>
                  <div className="text-[#8C8A94]"># OR</div>
                  <div>Authorization: Bearer {apiKey}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-[14px] border border-[#2A2832] bg-[#1C1B20] p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F3EA] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Zero Plaintext Storage
                  </h4>
                  <p className="text-xs text-[#8C8A94] leading-relaxed">
                    MERIDAS never stores your raw API key in plaintext. Only the deterministic SHA-256 digest is persisted,
                    preventing credential leakage even in catastrophic database dump scenarios.
                  </p>
                </div>
                <div className="rounded-[14px] border border-[#2A2832] bg-[#1C1B20] p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F3EA] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C9A227]" />
                    Cryptographic Tenant Isolation
                  </h4>
                  <p className="text-xs text-[#8C8A94] leading-relaxed">
                    Every API request is bound to the tenant ID resolved from the key hash. Vector namespaces, PostgreSQL
                    rows, and message logs cannot cross tenant boundaries.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. VERIFICATION PROTOCOL */}
          {activeSection === 'verification-protocol' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A227] font-bold">Decision Contract</span>
                <h2 className="text-2xl font-bold text-[#F7F3EA]">Evidence Verification &amp; NLI Protocol</h2>
                <p className="text-sm text-[#8C8A94] leading-relaxed">
                  Unlike traditional RAG systems that blindly pipe retrieved passages to an LLM, MERIDAS executes
                  an intermediate Natural Language Inference (NLI) step before approving any output.
                </p>
              </div>

              {/* Decision State Matrix */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A94]">
                  Inference Decision States
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-[12px] border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400">SUPPORTED</span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">High Confidence</span>
                    </div>
                    <p className="text-xs text-[#8C8A94] leading-relaxed">
                      Every claim in the proposed answer directly entails verified operational directives. Source citations and scores are attached.
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">CONDITIONAL</span>
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Caveat Flag</span>
                    </div>
                    <p className="text-xs text-[#8C8A94] leading-relaxed">
                      Directive applies only under specific constraints, or superseded versions exist. The system returns the caveat and identifies the responsible custodian.
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-[#9E1B32]/40 bg-[#9E1B32]/10 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#DFB943]">CANNOT_ESTABLISH</span>
                      <span className="text-[10px] font-mono bg-[#9E1B32]/30 text-[#DFB943] px-1.5 py-0.5 rounded">Zero Hallucination</span>
                    </div>
                    <p className="text-xs text-[#8C8A94] leading-relaxed">
                      Directives do not contain sufficient evidence to answer. Output explicitly declares the evidentiary void without inventing policies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Evaluations Contract */}
              <div className="rounded-[14px] border border-[#2A2832] bg-[#1C1B20] p-5 space-y-3">
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-[#F7F3EA] flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#C9A227]" />
                  Statement Verification Object
                </h3>
                <p className="text-xs text-[#8C8A94] leading-relaxed">
                  Inside the <code className="text-[#C9A227]">evaluations</code> array, each statement is verified independently against uploaded documents:
                </p>
                <div className="bg-[#151417] border border-[#2A2832] rounded-[10px] p-4 font-mono text-xs text-[#DFB943] leading-relaxed overflow-x-auto">
{`{
  "claim": "All remote connections must terminate on UDP 443 with FIDO2 WebAuthn.",
  "passageId": "chunk_sop_042_p1",
  "documentTitle": "SOP-SEC-042-VPN-Gateway-v3.0.md",
  "relationship": "SUPPORTS", // "SUPPORTS" | "CONTRADICTS" | "NEUTRAL"
  "score": 0.985,
  "rationale": "Directly matches Section 2.1 of active VPN SOP v3.0."
}`}
                </div>
              </div>
            </div>
          )}

          {/* 4. WIDGET INTEGRATION */}
          {activeSection === 'widget-integration' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A227] font-bold">Client Embed</span>
                <h2 className="text-2xl font-bold text-[#F7F3EA]">Embeddable Verification Widget</h2>
                <p className="text-sm text-[#8C8A94] leading-relaxed">
                  Embed MERIDAS directly into internal portals, Confluence, back-office tools, or service dashboards
                  using a single, zero-dependency script tag.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A94]">
                    HTML Installation Snippet
                  </h3>
                  <button
                    onClick={() => copyToClipboard(
                      `<script \n  src="${typeof window !== 'undefined' ? window.location.origin : 'https://meridas.ai'}/widget/meridas-widget.js" \n  data-api-key="${apiKey}" \n  defer\n></script>`,
                      'widget-code'
                    )}
                    className="flex items-center gap-1.5 text-xs text-[#8C8A94] hover:text-[#C9A227] transition-colors cursor-pointer"
                  >
                    {copiedSnippet === 'widget-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Snippet</span>
                  </button>
                </div>
                <div className="bg-[#151417] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#DFB943] leading-relaxed overflow-x-auto">
{`<script 
  src="${typeof window !== 'undefined' ? window.location.origin : 'https://meridas.ai'}/widget/meridas-widget.js" 
  data-api-key="${apiKey}" 
  defer
></script>`}
                </div>
              </div>

              {/* Attributes table */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A94]">
                  Script Configuration Attributes
                </h3>
                <div className="border border-[#2A2832] rounded-[12px] overflow-hidden bg-[#1C1B20]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#151417] border-b border-[#2A2832] text-[#8C8A94] font-mono">
                      <tr>
                        <th className="py-2.5 px-4">Attribute</th>
                        <th className="py-2.5 px-4">Type</th>
                        <th className="py-2.5 px-4">Default</th>
                        <th className="py-2.5 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2832] text-[#F7F3EA]">
                      <tr>
                        <td className="py-3 px-4 font-mono text-[#DFB943]">data-api-key</td>
                        <td className="py-3 px-4 font-mono text-[#8C8A94]">string</td>
                        <td className="py-3 px-4 font-mono text-[#8C8A94]">Required</td>
                        <td className="py-3 px-4 text-[#8C8A94]">Your workspace ingress key (e.g. mrd_live_...).</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-[#DFB943]">data-backend-url</td>
                        <td className="py-3 px-4 font-mono text-[#8C8A94]">string</td>
                        <td className="py-3 px-4 font-mono text-[#8C8A94]">http://localhost:3001</td>
                        <td className="py-3 px-4 text-[#8C8A94]">Target MERIDAS API backend host.</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-[#DFB943]">data-position</td>
                        <td className="py-3 px-4 font-mono text-[#8C8A94]">&quot;bottom-right&quot; | &quot;bottom-left&quot;</td>
                        <td className="py-3 px-4 font-mono text-[#8C8A94]">&quot;bottom-right&quot;</td>
                        <td className="py-3 px-4 text-[#8C8A94]">Viewport docking position for the launcher.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-[12px] border border-[#2A2832] bg-[#1C1B20]">
                <div>
                  <h4 className="text-xs font-bold text-[#F7F3EA]">Custom Branding &amp; Welcome Directive</h4>
                  <p className="text-xs text-[#8C8A94] mt-0.5">Customize accent hex colors, console titles, and placeholders without touching code.</p>
                </div>
                <Link
                  href="/dashboard/settings/widget"
                  className="px-4 py-2 rounded-[8px] bg-[#9E1B32] hover:bg-[#BA243F] text-[#F7F3EA] text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                >
                  Open Widget Studio →
                </Link>
              </div>
            </div>
          )}

          {/* 5. POST /chat */}
          {activeSection === 'chat' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold px-2.5 py-1 rounded border border-emerald-500/30">POST</span>
                  <code className="text-xl font-mono text-[#F7F3EA]">/api/v1/chat</code>
                </div>
                <p className="text-sm text-[#8C8A94] leading-relaxed">
                  Submit an operational query against enterprise directives. Returns a grounded answer accompanied by
                  verified statements, document citations, and confidence status.
                </p>
              </div>

              {/* Parameters */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A94]">Body Parameters</h3>
                <div className="border border-[#2A2832] rounded-[12px] overflow-hidden bg-[#1C1B20]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#151417] border-b border-[#2A2832] text-[#8C8A94] font-mono">
                      <tr>
                        <th className="py-2.5 px-4">Field</th>
                        <th className="py-2.5 px-4">Type</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2832] text-[#F7F3EA]">
                      <tr>
                        <td className="py-3 px-4 font-mono text-[#DFB943]">message</td>
                        <td className="py-3 px-4 font-mono text-[#8C8A94]">string</td>
                        <td className="py-3 px-4"><span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold bg-[#9E1B32]/25 text-[#DFB943]">Required</span></td>
                        <td className="py-3 px-4 text-[#8C8A94]">The operational inquiry to evaluate. (Max 2,000 chars).</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-[#DFB943]">conversationId</td>
                        <td className="py-3 px-4 font-mono text-[#8C8A94]">UUID</td>
                        <td className="py-3 px-4"><span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold bg-white/5 text-[#8C8A94]">Optional</span></td>
                        <td className="py-3 px-4 text-[#8C8A94]">Maintain conversational context across multi-turn queries.</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-[#DFB943]">mode</td>
                        <td className="py-3 px-4 font-mono text-[#8C8A94]">&quot;answer&quot; | &quot;exact&quot; | &quot;summary&quot;</td>
                        <td className="py-3 px-4"><span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-bold bg-white/5 text-[#8C8A94]">Optional</span></td>
                        <td className="py-3 px-4 text-[#8C8A94]">Formatting mode. Defaults to &quot;answer&quot;.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* cURL Request & JSON Response */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A94]">Example Request</h3>
                  <button onClick={() => copyToClipboard(`curl -X POST ${API_V1_URL}/chat \\\n  -H "x-api-key: ${apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"message": "What is the active port and MFA method for GlobalProtect VPN v3.0?"}'`, 'curl-chat')} className="flex items-center gap-1.5 text-xs text-[#8C8A94] hover:text-[#C9A227] cursor-pointer">
                    {copiedSnippet === 'curl-chat' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy cURL</span>
                  </button>
                </div>
                <div className="bg-[#151417] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#DFB943] leading-relaxed overflow-x-auto">
{`curl -X POST ${API_V1_URL}/chat \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "What is the active port and MFA method for GlobalProtect VPN v3.0?",
    "mode": "answer"
  }'`}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C8A94]">Grounded Response Object</h3>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">HTTP 200 OK</span>
                </div>
                <div className="bg-[#1C1B20] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#F7F3EA] leading-relaxed overflow-x-auto">
{`{
  "id": "msg_9841f3e0",
  "answer": "GlobalProtect VPN v3.0 routes exclusively through UDP port 443 with mandatory FIDO2 hardware token multi-factor authentication [1]. Legacy SMS verification and port 4443 are strictly deprecated.",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "decisionState": "SUPPORTED",
  "evaluations": [
    {
      "claim": "GlobalProtect VPN v3.0 operates on UDP port 443 with mandatory FIDO2 WebAuthn authentication.",
      "passageId": "chunk_sop_042_p1",
      "documentTitle": "SOP-SEC-042-VPN-Gateway-v3.0.md",
      "relationship": "SUPPORTS",
      "score": 0.985,
      "rationale": "Explicitly defined in Section 2.1 (Transport & Port Allocation) and Section 3.2 (MFA Authentication Standard)."
    }
  ],
  "sources": [
    {
      "documentId": "3c0100f6-7028-4e1a-b97d-a72b56e23447",
      "documentTitle": "VPN GlobalProtect v3.0 Active HQ",
      "excerpt": "Effective Q1 2026, all remote engineering connections must terminate at the Primary HQ VPN Gateway on UDP 443. Hardware FIDO2 tokens are mandatory...",
      "score": 0.985
    }
  ],
  "usage": {
    "inputTokens": 418,
    "outputTokens": 92,
    "totalTokens": 510
  },
  "model": "command-r-plus",
  "latencyMs": 196
}`}
                </div>
              </div>
            </div>
          )}

          {/* 6. POST /search */}
          {activeSection === 'search' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold px-2.5 py-1 rounded border border-emerald-500/30">POST</span>
                  <code className="text-xl font-mono text-[#F7F3EA]">/api/v1/search</code>
                </div>
                <p className="text-sm text-[#8C8A94] leading-relaxed">
                  Execute Reciprocal Rank Fusion (RRF) search across Pinecone dense embeddings and PostgreSQL full-text indices.
                </p>
              </div>

              <div className="bg-[#151417] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#DFB943] leading-relaxed overflow-x-auto">
{`curl -X POST ${API_V1_URL}/search \\
  -H "x-api-key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "GlobalProtect VPN UDP 443 hardware custody",
    "limit": 3
  }'`}
              </div>

              <div className="bg-[#1C1B20] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#F7F3EA] leading-relaxed overflow-x-auto">
{`{
  "results": [
    {
      "documentId": "3c0100f6-7028-4e1a-b97d-a72b56e23447",
      "documentTitle": "VPN GlobalProtect v3.0 Active HQ",
      "excerpt": "Primary HQ VPN Gateway operates on UDP port 443 with mandatory hardware FIDO2 authentication.",
      "hybridScore": 0.964,
      "vectorScore": 0.932,
      "keywordScore": 0.996,
      "chunkIndex": 0
    }
  ],
  "query": "GlobalProtect VPN UDP 443 hardware custody",
  "totalResults": 1,
  "latencyMs": 48
}`}
              </div>
            </div>
          )}

          {/* 7. GET /documents */}
          {activeSection === 'documents' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-500/10 text-blue-400 text-xs font-mono font-bold px-2.5 py-1 rounded border border-blue-500/30">GET</span>
                  <code className="text-xl font-mono text-[#F7F3EA]">/api/v1/documents</code>
                </div>
                <p className="text-sm text-[#8C8A94] leading-relaxed">
                  List all indexed operational directives in your workspace along with chunk counts and parsing states.
                </p>
              </div>

              <div className="bg-[#151417] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#DFB943] leading-relaxed overflow-x-auto">
{`curl -X GET "${API_V1_URL}/documents?limit=5&status=READY" \\
  -H "x-api-key: ${apiKey}"`}
              </div>

              <div className="bg-[#1C1B20] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#F7F3EA] leading-relaxed overflow-x-auto">
{`{
  "documents": [
    {
      "id": "e9794239-4b67-400a-bbc9-3c10f9d083bc",
      "title": "Zero Trust Access Regional Pilot",
      "status": "READY",
      "chunkCount": 6,
      "createdAt": "2026-09-28T01:03:30.016Z"
    },
    {
      "id": "3c0100f6-7028-4e1a-b97d-a72b56e23447",
      "title": "VPN GlobalProtect v3.0 Active HQ",
      "status": "READY",
      "chunkCount": 5,
      "createdAt": "2026-09-28T01:03:29.902Z"
    },
    {
      "id": "da03aafa-0734-4988-a38f-f8d0d9bfc471",
      "title": "Hardware Custody 15 Day Policy",
      "status": "READY",
      "chunkCount": 4,
      "createdAt": "2026-09-28T01:03:29.675Z"
    },
    {
      "id": "27bbb9b2-aab8-4333-bc60-bcd3b64f70ed",
      "title": "Emergency Server Decommissioning",
      "status": "READY",
      "chunkCount": 5,
      "createdAt": "2026-09-28T01:03:29.507Z"
    }
  ],
  "total": 5,
  "limit": 5,
  "offset": 0
}`}
              </div>
            </div>
          )}

          {/* 8. GET /usage */}
          {activeSection === 'usage' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-500/10 text-blue-400 text-xs font-mono font-bold px-2.5 py-1 rounded border border-blue-500/30">GET</span>
                  <code className="text-xl font-mono text-[#F7F3EA]">/api/v1/usage</code>
                </div>
                <p className="text-sm text-[#8C8A94] leading-relaxed">
                  Telemetry on token usage and request throttles for this tenant.
                </p>
              </div>

              <div className="bg-[#151417] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#DFB943] leading-relaxed overflow-x-auto">
{`curl -X GET ${API_V1_URL}/usage \\
  -H "x-api-key: ${apiKey}"`}
              </div>

              <div className="bg-[#1C1B20] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#F7F3EA] leading-relaxed overflow-x-auto">
{`{
  "period": {
    "start": "2026-09-01T00:00:00.000Z",
    "end": "2026-10-01T00:00:00.000Z"
  },
  "messages": {
    "used": 420,
    "limit": 10000,
    "remaining": 9580
  },
  "apiRequests": {
    "used": 1840,
    "limit": 100000
  }
}`}
              </div>
            </div>
          )}

          {/* 9. GET /health */}
          {activeSection === 'health' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-500/10 text-blue-400 text-xs font-mono font-bold px-2.5 py-1 rounded border border-blue-500/30">GET</span>
                  <code className="text-xl font-mono text-[#F7F3EA]">/api/v1/health</code>
                </div>
                <p className="text-sm text-[#8C8A94] leading-relaxed">
                  Check API gateway readiness, database connectivity, and RAG inference pipelines.
                </p>
              </div>

              <div className="bg-[#151417] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#DFB943] leading-relaxed overflow-x-auto">
{`curl -X GET ${API_V1_URL}/health \\
  -H "x-api-key: ${apiKey}"`}
              </div>

              <div className="bg-[#1C1B20] border border-[#2A2832] rounded-[12px] p-5 font-mono text-xs text-[#F7F3EA] leading-relaxed overflow-x-auto">
{`{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-09-28T01:35:55.943Z"
}`}
              </div>
            </div>
          )}

          {/* 10. RATE LIMITS & ERRORS */}
          {activeSection === 'rate-limits' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A227] font-bold">Operational Resiliency</span>
                <h2 className="text-2xl font-bold text-[#F7F3EA]">Rate Limits &amp; Error Handling</h2>
                <p className="text-sm text-[#8C8A94] leading-relaxed">
                  All error responses adhere to standard HTTP status codes and the RFC-7807 problem details specification.
                </p>
              </div>

              {/* Status Codes Table */}
              <div className="border border-[#2A2832] rounded-[12px] overflow-hidden bg-[#1C1B20]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#151417] border-b border-[#2A2832] text-[#8C8A94] font-mono">
                    <tr>
                      <th className="py-2.5 px-4">Status Code</th>
                      <th className="py-2.5 px-4">Condition</th>
                      <th className="py-2.5 px-4">Remediation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2832] text-[#F7F3EA]">
                    <tr>
                      <td className="py-3 px-4 font-mono text-emerald-400">200 OK</td>
                      <td className="py-3 px-4 text-[#8C8A94]">Request succeeded with verified evidence.</td>
                      <td className="py-3 px-4 text-[#8C8A94]">Inspect decisionState and answer.</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-amber-400">401 Unauthorized</td>
                      <td className="py-3 px-4 text-[#8C8A94]">Missing or invalid API key hash.</td>
                      <td className="py-3 px-4 text-[#8C8A94]">Verify x-api-key header matches active token.</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-amber-400">403 Forbidden</td>
                      <td className="py-3 px-4 text-[#8C8A94]">Feature disabled for this tenant.</td>
                      <td className="py-3 px-4 text-[#8C8A94]">Enable the feature in tenant settings.</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono text-[#DFB943]">429 Too Many Requests</td>
                      <td className="py-3 px-4 text-[#8C8A94]">Exceeded the request rate limit.</td>
                      <td className="py-3 px-4 text-[#8C8A94]">Apply exponential backoff and retry.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
