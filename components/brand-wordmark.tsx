import Image from "next/image";

type BrandWordmarkProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  compact?: boolean;
  className?: string;
  tagline?: string;
  priority?: boolean;
};

const sizeClasses = {
  sm: {
    width: 135,
    height: 36,
    logo: "w-[126px] sm:w-[135px]",
    tag: "text-[10px] tracking-[0.3em]",
  },
  md: {
    width: 165,
    height: 44,
    logo: "w-[146px] sm:w-[165px]",
    tag: "text-[10px] tracking-[0.32em]",
  },
  lg: {
    width: 210,
    height: 56,
    logo: "w-[180px] sm:w-[210px]",
    tag: "text-[11px] tracking-[0.34em]",
  },
} as const;

export function BrandWordmark({
  size = "md",
  showTagline = true,
  compact = false,
  className = "",
  tagline = "Manage stock, orders, and customer updates in one flow.",
  priority = false,
}: BrandWordmarkProps) {
  const classes = sizeClasses[size];

  return (
    <div
      className={`group/brand inline-flex min-w-0 flex-col items-start ${compact ? "gap-1.5" : "gap-2"} ${className}`.trim()}
    >
      <Image
        src="/flowlo-logo.svg"
        alt="FlowLo"
        width={classes.width}
        height={classes.height}
        priority={priority}
        unoptimized
        sizes={`${classes.width}px`}
        draggable={false}
        className={`${classes.logo} h-auto max-w-full select-none`}
      />

      {showTagline ? (
        <p className={`uppercase text-romano-slate ${classes.tag}`}>
          {tagline}
        </p>
      ) : null}
    </div>
  );
}
