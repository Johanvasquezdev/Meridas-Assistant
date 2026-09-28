"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface StatItem {
  numericValue: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
}

const stats: StatItem[] = [
  { numericValue: 100, suffix: "%", label: "Evidence Grounding", sublabel: "Zero unverified assertions allowed" },
  { numericValue: 0, suffix: "", label: "Tolerated Hallucinations", sublabel: "Refusal protocol on unverified queries" },
  { numericValue: 240, suffix: "ms", label: "Evidence Retrieval", sublabel: "Sub-second vector provenance search" },
  { numericValue: 99, suffix: ".8%", label: "Audit Precision", sublabel: "Traceable decision trails for enterprise" },
];

function AnimatedNumber({ value, isVisible }: { value: number; isVisible: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1800;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setDisplayValue(Math.round(easedProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isVisible, value]);

  return <span>{displayValue}</span>;
}

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 border-b border-[#2A2832] bg-[#1C1B20]">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-[12px] bg-[#151417] border border-[#2A2832] shadow-md hover:border-[#C9A227]/40 transition-colors"
            >
              <div className="font-mono text-[36px] sm:text-[44px] font-bold text-[#C9A227] tracking-tight mb-2">
                {stat.prefix}
                <AnimatedNumber value={stat.numericValue} isVisible={isVisible} />
                {stat.suffix}
              </div>
              <div className="font-sans text-[15px] font-bold text-[#F7F3EA] mb-1">
                {stat.label}
              </div>
              <div className="font-sans text-[12px] text-[#8C8A94]">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
