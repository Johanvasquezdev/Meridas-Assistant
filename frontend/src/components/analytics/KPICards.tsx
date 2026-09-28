"use client";

import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  ShieldCheck, 
  FileText, 
  Zap, 
  Coins, 
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface KPICardsProps {
  data: any;
  isLoading: boolean;
}

export function KPICards({ data, isLoading }: KPICardsProps) {
  const cards = [
    {
      title: "Queries This Month",
      value: data?.totalMessages || 0,
      trend: "+12.4%",
      icon: MessageSquare,
    },
    {
      title: "Verified Answers",
      value: data?.aiResponses || 0,
      trend: "+100%",
      icon: ShieldCheck,
    },
    {
      title: "Uploaded Documents",
      value: data?.documentsUploaded || 0,
      trend: "+3",
      icon: FileText,
    },
    {
      title: "Avg Response Speed",
      value: `${data?.averageResponseTimeMs || 240}ms`,
      trend: "Fast",
      icon: Clock,
    },
    {
      title: "AI Tokens Used",
      value: data?.totalTokens?.toLocaleString() || 0,
      trend: "+18%",
      icon: Zap,
    },
    {
      title: "Estimated Cost",
      value: `$${((data?.totalTokens || 0) * 0.00002).toFixed(2)}`,
      trend: "Optimal",
      icon: Coins,
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 font-sans">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="group relative overflow-hidden rounded-[14px] border border-[#2A2832] bg-[#1C1B20] p-4.5 hover:border-[#C9A227]/40 transition-all shadow-md font-sans"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex size-8 items-center justify-center rounded-[8px] bg-[#9E1B32]/15 border border-[#C9A227]/30">
              <card.icon className="size-4 text-[#C9A227]" strokeWidth={2} />
            </div>
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-[4px] bg-[#9E1B32]/20 font-sans text-[10px] font-bold text-[#C9A227]">
              {card.trend}
              <ArrowUpRight className="size-2.5" />
            </span>
          </div>

          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-[#8C8A94] mb-1">
              {card.title}
            </p>
            {isLoading ? (
              <div className="mt-1 h-7 w-20 animate-pulse rounded-[4px] bg-[#232229]" />
            ) : (
              <h4 className="text-2xl font-bold tracking-tight text-[#F7F3EA] font-sans">
                {card.value}
              </h4>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
