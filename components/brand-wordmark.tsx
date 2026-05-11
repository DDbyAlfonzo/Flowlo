type BrandWordmarkProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  compact?: boolean;
  className?: string;
  tagline?: string;
};

const sizeClasses = {
  sm: {
    logo: "h-8 sm:h-9",
    tag: "text-[10px] tracking-[0.3em]",
  },
  md: {
    logo: "h-10 sm:h-11",
    tag: "text-[10px] tracking-[0.32em]",
  },
  lg: {
    logo: "h-12 sm:h-14",
    tag: "text-[11px] tracking-[0.34em]",
  },
} as const;

export function BrandWordmark({
  size = "md",
  showTagline = true,
  compact = false,
  className = "",
  tagline = "Manage stock, orders, and customer updates in one flow.",
}: BrandWordmarkProps) {
  const classes = sizeClasses[size];

  return (
    <div
      className={`group/brand inline-flex min-w-0 flex-col items-start ${compact ? "gap-1.5" : "gap-2"} ${className}`.trim()}
    >
      <img
        src="/flowlo-logo.svg"
        alt="FlowLo"
        className={`${classes.logo} w-auto max-w-full select-none drop-shadow-[0_0_20px_rgba(62,242,207,0.18)]`}
      />

      {showTagline ? (
        <p className={`uppercase text-romano-slate ${classes.tag}`}>
          {tagline}
        </p>
      ) : null}
    </div>
  );
}
