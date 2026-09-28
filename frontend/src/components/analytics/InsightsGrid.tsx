"use client";

import { motion } from 'framer-motion';
import { MessageSquare, Layers } from 'lucide-react';

interface InsightsGridProps {
  conversations: any[];
  documents: any[];
  isLoading: boolean;
}

export function InsightsGrid({ conversations, documents, isLoading }: InsightsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-[16px] border border-[#2A2832] bg-[#1C1B20]" />
        <div className="h-64 animate-pulse rounded-[16px] border border-[#2A2832] bg-[#1C1B20]" />
      </div>
    );
  }

  const recentConversations = Array.isArray(conversations)
    ? conversations.slice(0, 5)
    : Array.isArray((conversations as any)?.conversations)
    ? (conversations as any).conversations.slice(0, 5)
    : [];

  const topDocuments = Array.isArray(documents)
    ? documents.slice(0, 5)
    : Array.isArray((documents as any)?.documents)
    ? (documents as any).documents.slice(0, 5)
    : [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Activity Stream */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="group relative flex flex-col rounded-[16px] border border-[#2A2832] bg-[#1C1B20] p-6 shadow-xl overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="mb-6 flex items-center justify-between font-sans">
          <div>
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#8C8A94]">Chat Activity</h3>
            <p className="text-sm font-bold text-[#F7F3EA]">Recent Questions Asked</p>
          </div>
          <MessageSquare className="size-4 text-[#C9A227]" />
        </div>

        <div className="flex-1 space-y-3 font-sans">
          {recentConversations.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-xs text-[#8C8A94] italic font-sans">
              No active conversations yet
            </div>
          ) : (
            recentConversations.map((c: any) => (
              <div key={c.id} className="group flex items-center justify-between rounded-[10px] border border-[#2A2832] bg-[#151417] p-3 transition-colors hover:border-[#C9A227]/30">
                <div className="flex items-center gap-3">
                  <div className="rounded-[6px] bg-[#C9A227]/10 p-2 border border-[#C9A227]/20">
                    <MessageSquare className="size-3.5 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold truncate max-w-[150px] md:max-w-[200px] text-[#F7F3EA]">
                      Session {c.id.slice(0, 8)}
                    </p>
                    <p className="font-sans text-[11px] text-[#8C8A94]">{c.messageCount} messages</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#8C8A94]">Time</p>
                  <p className="text-[11px] font-sans text-[#F7F3EA]">{new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Document Usage */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="group relative flex flex-col rounded-[16px] border border-[#2A2832] bg-[#1C1B20] p-6 shadow-xl overflow-hidden font-sans"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="mb-6 flex items-center justify-between font-sans">
          <div>
            <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#8C8A94]">Knowledge Sources</h3>
            <p className="text-sm font-bold text-[#F7F3EA]">Most Referenced Documents</p>
          </div>
          <Layers className="size-4 text-[#C9A227]" />
        </div>

        <div className="flex-1 space-y-3 font-sans">
          {topDocuments.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-xs text-[#8C8A94] italic font-sans">
              No documents uploaded yet
            </div>
          ) : (
            topDocuments.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between rounded-[10px] border border-[#2A2832] bg-[#151417] p-3 transition-colors hover:border-[#C9A227]/30">
                <div className="flex items-center gap-3">
                  <div className="rounded-[6px] bg-[#9E1B32]/15 p-2 border border-[#9E1B32]/30">
                    <Layers className="size-3.5 text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold truncate max-w-[200px] text-[#F7F3EA]">{doc.title}</p>
                    <div className="flex items-center gap-2">
                      <span className={`size-1.5 rounded-full ${doc.status === 'READY' ? 'bg-[#C9A227]' : 'bg-amber-500'}`} />
                      <p className="font-sans text-[11px] text-[#8C8A94]">{doc.chunkCount} document sections</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-[4px] bg-[#C9A227]/10 px-2 py-0.5 font-sans text-[10px] font-bold text-[#C9A227] border border-[#C9A227]/25">
                    READY
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
