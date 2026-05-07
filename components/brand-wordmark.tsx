type BrandWordmarkProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  tagline?: string;
};

const sizeClasses = {
  sm: {
    wrap: "gap-3",
    icon: "h-10 w-10 rounded-2xl text-base",
    name: "text-[1.1rem]",
    tag: "text-[10px] tracking-[0.32em]",
  },
  md: {
    wrap: "gap-3.5",
    icon: "h-11 w-11 rounded-2xl text-lg",
    name: "text-[1.28rem]",
    tag: "text-[10px] tracking-[0.34em]",
  },
  lg: {
    wrap: "gap-4",
    icon: "h-12 w-12 rounded-[1.1rem] text-lg",
    name: "text-[1.5rem]",
    tag: "text-[11px] tracking-[0.36em]",
  },
} as const;

export function BrandWordmark({
  size = "md",
  showTagline = true,
  className = "",
  tagline = "Clean stock. Clear orders. Faster sales.",
}: BrandWordmarkProps) {
  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center ${classes.wrap} ${className}`.trim()}>
      <div
        className={`flex ${classes.icon} items-center justify-center border border-romano-navy/20 bg-romano-primary font-semibold text-[#041215] shadow-glow`}
      >
        F
      </div>

      <div className="min-w-0">
        <p
          className={`${classes.name} font-bold leading-none tracking-[-0.08em] text-romano-ink`}
        >
          Flow<span className="bg-romano-primary bg-clip-text text-transparent">Lo</span>
        </p>
        {showTagline ? (
          <p className={`mt-1 uppercase text-romano-slate ${classes.tag}`}>{tagline}</p>
        ) : null}
      </div>
    </div>
  );
}
