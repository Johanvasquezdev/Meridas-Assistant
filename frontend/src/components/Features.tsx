"use client";

import { motion } from "framer-motion";

const features = [
  {
    id: "01",
    title: "Evidence before the answer",
    description: "Meridas retrieves passages first. If they do not support the question, the answer is refused.",
  },
  {
    id: "02",
    title: "Three decision states",
    description: "Supported, conditional, or refused. A contradiction is a refusal, not a blend of both procedures.",
  },
  {
    id: "03",
    title: "Versions stay visible",
    description: "A new revision does not erase the previous one. Both remain until someone on the conflict desk decides.",
  },
  {
    id: "04",
    title: "The graph is what the chat reads",
    description: "Ingest writes sources, versions, passages, and claims. Retrieval uses that graph, not an unbound document pile.",
  },
  {
    id: "05",
    title: "A person declares the binding version",
    description: "Adjudication records who decided, why, and which claim remains in force.",
  },
  {
    id: "06",
    title: "The next answer changes",
    description: "The losing version is marked superseded and drops out of the following retrieval.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-[120px] border-b border-[#2A2832] bg-[#151417] font-sans">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-[6px] border border-[#C9A227]/40 bg-[#9E1B32]/15 px-3 py-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-[#C9A227]">
              Built For Reliability
            </span>
          </div>
          <h2 className="font-sans text-[40px] sm:text-[48px] font-bold text-[#F7F3EA] mb-4">
            Answers You Can Count On
          </h2>
          <p className="font-sans text-[16px] text-[#8C8A94] max-w-[600px]">
            The difference is the circuit: ingest writes the graph, the chat reads it, and a human decision changes the next answer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-[#C9A227]/25 bg-[#C9A227]/20">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group flex items-start gap-6 border-l-2 border-l-transparent bg-[#1C1B20] p-10 transition-all hover:border-l-[#9E1B32] hover:bg-[#1C1B20]"
            >
              <span className="font-sans text-[16px] font-bold text-[#C9A227] transition-transform group-hover:scale-110">
                {feature.id}
              </span>
              <div>
                <h3 className="font-sans text-[20px] font-bold text-[#F7F3EA] mb-2.5">
                  {feature.title}
                </h3>
                <p className="font-sans text-[14px] leading-relaxed text-[#8C8A94]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
