import { BrandMark } from "@/components/brand-mark";

type BrandWordmarkProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  compact?: boolean;
  className?: string;
  tagline?: string;
};

const sizeClasses = {
  sm: {
    wrap: "gap-3",
    mark: "sm",
    name: "text-[1.08rem]",
    tag: "text-[10px] tracking-[0.32em]",
  },
  md: {
    wrap: "gap-3.5",
    mark: "md",
    name: "text-[1.26rem]",
    tag: "text-[10px] tracking-[0.34em]",
  },
  lg: {
    wrap: "gap-4",
    mark: "lg",
    name: "text-[1.52rem]",
    tag: "text-[11px] tracking-[0.36em]",
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
      className={`group/brand inline-flex items-center ${classes.wrap} ${compact ? "gap-2.5" : ""} ${className}`.trim()}
    >
      <BrandMark size={classes.mark} plate={compact ? "soft" : "glass"} />

      <div className="min-w-0">
        <p
          className={`${classes.name} font-semibold leading-none tracking-[-0.09em] text-romano-ink`}
        >
          <span className="text-romano-ink">Flow</span>
          <span className="bg-[linear-gradient(135deg,#3EF2CF_8%,#66E8FF_58%,#FFD45A_100%)] bg-clip-text text-transparent">
            Lo
          </span>
        </p>

        {showTagline ? (
          <p className={`mt-1 uppercase text-romano-slate ${classes.tag}`}>
            {tagline}
          </p>
        ) : null}
      </div>
    </div>
  );
}
