'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MeridasLogo } from '@/components/brand/MeridasLogo';
import ApiReferencePage from '../dashboard/api-reference/page';

export default function PublicDocsPage() {
  return (
    <div className="min-h-screen bg-[#151417] text-[#F7F3EA] font-sans selection:bg-[#9E1B32]/40 selection:text-[#F7F3EA]">
      {/* Top Global Header */}
      <header className="border-b border-[#2A2832] bg-[#151417]/90 backdrop-blur-xl sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MeridasLogo size="sm" withTagline={true} />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-mono text-xs text-[#8C8A94] hover:text-[#C9A227] transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Platform Home</span>
            </Link>
            <Link
              href="/sign-in"
              className="px-3.5 py-1.5 rounded-[8px] bg-[#9E1B32] hover:bg-[#BA243F] text-[#F7F3EA] text-xs font-mono font-bold uppercase tracking-wider border border-[#C9A227]/40 transition-all shadow-md shadow-[#9E1B32]/25"
            >
              Sign In to Console
            </Link>
          </div>
        </div>
      </header>

      {/* Main Documentation Portal */}
      <main className="pb-24">
        <ApiReferencePage />
      </main>
    </div>
  );
}
