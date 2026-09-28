type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  highlight: string;
  subtitle: string;
};

export function SectionHeading({ eyebrow, title, highlight, subtitle }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-16 max-w-4xl text-center">
      {eyebrow ? (
        <div className="mb-3 inline-flex items-center gap-2 rounded-[6px] border border-[#C9A227]/30 bg-[#9E1B32]/10 px-3 py-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-[#C9A227]">{eyebrow}</p>
        </div>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-[#F7F3EA] md:text-5xl">
        {title}{" "}
        <span className="text-[#C9A227]">
          {highlight}
        </span>
      </h2>
      <p className="mx-auto mt-4 max-w-2xl font-sans text-base text-[#8C8A94] md:text-lg">{subtitle}</p>
    </div>
  );
}
