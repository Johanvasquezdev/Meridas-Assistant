'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/use-api';
import { 
  Settings, 
  Palette, 
  MessageSquare, 
  Code, 
  Save, 
  Check, 
  Copy, 
  ExternalLink,
  Eye,
  Info,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface WidgetConfig {
  primaryColor: string;
  position: string;
  placeholder: string;
  title: string;
  welcomeMessage: string;
  isEnabled: boolean;
  allowedOrigins: string[];
}

export default function WidgetSettingsPage() {
  const api = useApi();
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [apiKey, setApiKey] = useState<string>('mrd_live_8f3b299ae71a45cd90bc');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const { show: toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [configRes] = await Promise.all([
        api.get('/widget-admin/config'),
      ]);
      
      setConfig(configRes.data);
      const keysRes = await api.get('/auth/keys');
      if (keysRes.data?.apiKey) {
        setApiKey(keysRes.data.apiKey);
      }
    } catch (err) {
      console.error('Failed to fetch widget settings', err);
      // Fallback configuration if unseeded
      setConfig({
        primaryColor: '#9E1B32',
        position: 'bottom-right',
        placeholder: 'Query verified operational directives...',
        title: 'Meridas assistant',
        welcomeMessage: 'Hello. I am the Meridas assistant. Ask about your organization\'s policies, SOPs, and operating procedures.',
        isEnabled: true,
        allowedOrigins: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await api.put('/widget-admin/config', config);
      toast('Widget configuration updated successfully');
      
      // Refresh the widget instance
      window.location.reload();
    } catch (err) {
      toast('Failed to save widget configuration');
    } finally {
      setSaving(false);
    }
  };

  const copyEmbedCode = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://meridas.ai';
    const code = `<script 
  src="${origin}/widget/meridas-widget.js" 
  data-api-key="${apiKey}" 
  defer
></script>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast('Embed snippet copied to clipboard');
  };

  useEffect(() => {
    if (!apiKey || typeof window === 'undefined') return;

    // Clean up any existing instances
    const existingScript = document.getElementById('mrd-widget-script') || document.getElementById('smk-widget-script');
    if (existingScript) existingScript.remove();

    const existingHost = document.getElementById('meridas-widget-host') || document.getElementById('supportmind-widget-host');
    if (existingHost) existingHost.remove();

    const script = document.createElement('script');
    script.id = 'mrd-widget-script';
    script.src = '/widget/meridas-widget.js';
    script.setAttribute('data-api-key', apiKey);
    script.setAttribute('data-backend-url', API_BASE_URL);
    script.async = true;
    
    document.body.appendChild(script);

    return () => {
      script.remove();
      const host = document.getElementById('meridas-widget-host') || document.getElementById('supportmind-widget-host');
      if (host) host.remove();
    };
  }, [apiKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#C9A227] border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2832] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#C9A227] mb-1">
            <Compass className="size-4" />
            <span className="text-[11px] font-sans uppercase tracking-wider font-bold">Website &amp; Portal Integration</span>
          </div>
          <h1 className="text-3xl font-bold text-[#F7F3EA] tracking-tight">Website Chat Widget</h1>
          <p className="text-[#8C8A94] mt-1 text-sm">
            Embed the Meridas assistant on your company website, internal wiki, or portal.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#9E1B32] hover:bg-[#BA243F] disabled:opacity-50 text-[#F7F3EA] border border-[#C9A227]/40 px-6 py-2.5 rounded-[10px] font-semibold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#9E1B32]/25 cursor-pointer active:scale-95"
        >
          {saving ? <div className="h-4 w-4 animate-spin border-2 border-white/30 border-t-white rounded-full" /> : <Save className="w-4 h-4 text-[#C9A227]" />}
          Save Widget Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance Section */}
          <div className="bg-[#1C1B20] border border-[#2A2832] rounded-[16px] overflow-hidden shadow-xl">
            <div className="p-6 border-b border-[#2A2832] flex items-center gap-3">
              <div className="p-2 bg-[#9E1B32]/15 border border-[#C9A227]/30 rounded-[8px]">
                <Palette className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#F7F3EA]">Visual Palette &amp; Docking</h2>
                <p className="text-xs text-[#8C8A94]">Configure the launcher accents and viewport docking orientation</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-medium uppercase tracking-wider text-[#8C8A94]">Primary Accent</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="color" 
                      value={config?.primaryColor || '#9E1B32'}
                      onChange={(e) => setConfig(prev => prev ? {...prev, primaryColor: e.target.value} : null)}
                      className="w-12 h-10 rounded-[8px] border border-[#2A2832] bg-transparent cursor-pointer p-0.5"
                    />
                    <input 
                      type="text" 
                      value={config?.primaryColor || '#9E1B32'}
                      onChange={(e) => setConfig(prev => prev ? {...prev, primaryColor: e.target.value} : null)}
                      className="flex-1 bg-[#151417] border border-[#2A2832] rounded-[8px] px-4 py-2 font-mono text-sm text-[#F7F3EA] focus:outline-none focus:border-[#C9A227]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono font-medium uppercase tracking-wider text-[#8C8A94]">Docking Position</label>
                  <select 
                    value={config?.position || 'bottom-right'}
                    onChange={(e) => setConfig(prev => prev ? {...prev, position: e.target.value} : null)}
                    className="w-full bg-[#151417] border border-[#2A2832] rounded-[8px] px-4 py-2.5 text-sm text-[#F7F3EA] focus:outline-none focus:border-[#C9A227]"
                  >
                    <option value="bottom-right">Bottom Right (Recommended)</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-[#1C1B20] border border-[#2A2832] rounded-[16px] overflow-hidden shadow-xl">
            <div className="p-6 border-b border-[#2A2832] flex items-center gap-3">
              <div className="p-2 bg-[#9E1B32]/15 border border-[#C9A227]/30 rounded-[8px]">
                <MessageSquare className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#F7F3EA]">Operational Header &amp; Copy</h2>
                <p className="text-xs text-[#8C8A94]">Define how the console introduces itself to internal operators</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-[#8C8A94]">Console Title</label>
                <input 
                  type="text" 
                  value={config?.title || ''}
                  onChange={(e) => setConfig(prev => prev ? {...prev, title: e.target.value} : null)}
                  placeholder="MERIDAS Intelligence"
                  className="w-full bg-[#151417] border border-[#2A2832] rounded-[8px] px-4 py-2.5 text-sm text-[#F7F3EA] focus:outline-none focus:border-[#C9A227]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-[#8C8A94]">Welcome Dispatch</label>
                <textarea 
                  value={config?.welcomeMessage || ''}
                  onChange={(e) => setConfig(prev => prev ? {...prev, welcomeMessage: e.target.value} : null)}
                  placeholder="Institutional Knowledge Console. Ask any operational query grounded in verified enterprise directives."
                  rows={3}
                  className="w-full bg-[#151417] border border-[#2A2832] rounded-[8px] px-4 py-2.5 text-sm text-[#F7F3EA] focus:outline-none focus:border-[#C9A227] resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-[#8C8A94]">Query Field Placeholder</label>
                <input 
                  type="text" 
                  value={config?.placeholder || ''}
                  onChange={(e) => setConfig(prev => prev ? {...prev, placeholder: e.target.value} : null)}
                  placeholder="Query verified operational directives..."
                  className="w-full bg-[#151417] border border-[#2A2832] rounded-[8px] px-4 py-2.5 text-sm text-[#F7F3EA] focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>
          </div>

          {/* Installation Section */}
          <div className="bg-[#1C1B20] border border-[#2A2832] rounded-[16px] overflow-hidden shadow-xl">
            <div className="p-6 border-b border-[#2A2832] flex items-center gap-3">
              <div className="p-2 bg-[#C9A227]/15 border border-[#C9A227]/30 rounded-[8px]">
                <Code className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#F7F3EA]">Direct Embed Snippet</h2>
                <p className="text-xs text-[#8C8A94]">Zero-dependency script tag. Encapsulated inside shadow DOM.</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-[#8C8A94] leading-relaxed">
                Paste this script into the HTML <code className="bg-[#151417] border border-[#2A2832] px-1.5 py-0.5 rounded text-[#F7F3EA] font-mono">&lt;body&gt;</code> or <code className="bg-[#151417] border border-[#2A2832] px-1.5 py-0.5 rounded text-[#F7F3EA] font-mono">&lt;head&gt;</code> of any internal tool, admin dashboard, or knowledge base.
              </p>
              <div className="relative group">
                <pre className="bg-[#151417] border border-[#2A2832] rounded-[10px] p-5 overflow-x-auto text-xs text-[#C9A227] font-mono leading-relaxed">
{`<script 
  src="${typeof window !== 'undefined' ? window.location.origin : 'https://meridas.ai'}/widget/meridas-widget.js" 
  data-api-key="${apiKey}" 
  defer
></script>`}
                </pre>
                <button 
                  onClick={copyEmbedCode}
                  className="absolute top-3 right-3 p-2 bg-[#1C1B20] border border-[#2A2832] hover:border-[#C9A227]/50 rounded-[6px] text-[#8C8A94] hover:text-[#C9A227] transition-all cursor-pointer"
                  title="Copy Embed Snippet"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-[#151417] border border-[#C9A227]/30 rounded-[10px]">
                <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <p className="text-xs text-[#8C8A94] leading-relaxed">
                  <strong className="text-[#F7F3EA]">Cryptographic Boundary:</strong> Requests originate strictly over HTTPS. Origin verification and rate limiting are enforced server-side.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Status */}
        <div className="space-y-6">
          <div className="bg-[#1C1B20] border border-[#2A2832] rounded-[16px] overflow-hidden shadow-xl sticky top-8">
            <div className="p-5 border-b border-[#2A2832] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-[#9E1B32]/15 border border-[#C9A227]/30 rounded-[6px]">
                  <Eye className="w-4 h-4 text-[#C9A227]" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#F7F3EA]">Live Console Preview</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Active</span>
              </div>
            </div>
            
            <div className="p-8 aspect-[4/3] bg-[#151417] flex items-center justify-center relative">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-[#1C1B20] rounded-[14px] flex items-center justify-center mx-auto border border-[#2A2832] shadow-inner">
                  <Compass className="w-6 h-6 text-[#C9A227]" />
                </div>
                <p className="text-xs text-[#8C8A94] max-w-[200px] mx-auto leading-relaxed">
                  The active widget is docked in the lower corner of this viewport.
                </p>
              </div>
              
              <div className="absolute inset-0 border border-dashed border-[#2A2832]/60 rounded-[14px] m-4 pointer-events-none"></div>
            </div>

            <div className="p-4 bg-[#151417] border-t border-[#2A2832]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8C8A94] font-medium">Console Availability</span>
                <button 
                  onClick={() => setConfig(prev => prev ? {...prev, isEnabled: !prev.isEnabled} : null)}
                  className={`px-3 py-1 rounded-[6px] text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    config?.isEnabled 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-[#9E1B32]/20 text-[#DFB943] border border-[#9E1B32]/50'
                  }`}
                >
                  {config?.isEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#9E1B32]/15 to-transparent border border-[#C9A227]/30 rounded-[16px] p-6 space-y-4">
            <h3 className="font-semibold text-sm text-[#F7F3EA] flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#C9A227]" />
              Need Direct System Integration?
            </h3>
            <p className="text-xs text-[#8C8A94] leading-relaxed">
              Query MERIDAS programmatically from Python, Go, Node.js, or enterprise API gateways using our verified Evidence Verification endpoints.
            </p>
            <Link 
              href="/dashboard/api-reference"
              className="block text-center w-full py-2.5 bg-[#151417] hover:bg-[#1C1B20] text-[#C9A227] rounded-[8px] text-xs font-sans font-bold uppercase tracking-wider transition-all border border-[#C9A227]/30"
            >
              View API Documentation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
