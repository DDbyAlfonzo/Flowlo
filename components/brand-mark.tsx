type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  plate?: "glass" | "soft" | "none";
  className?: string;
};

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
} as const;

const plateClasses = {
  glass:
    "rounded-[18px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_18px_42px_-28px_rgba(62,242,207,0.6)] backdrop-blur-xl",
  soft:
    "rounded-[16px] border border-white/8 bg-white/[0.04] shadow-[0_14px_32px_-24px_rgba(62,242,207,0.4)]",
  none: "",
} as const;

export function BrandMark({
  size = "md",
  plate = "glass",
  className = "",
}: BrandMarkProps) {
  return (
    <div
      className={`relative grid place-items-center ${sizeClasses[size]} ${plateClasses[plate]} ${className}`.trim()}
    >
      <svg
        viewBox="0 0 64 64"
        aria-hidden
        className="h-[70%] w-[70%] drop-shadow-[0_0_22px_rgba(62,242,207,0.22)]"
      >
        <defs>
          <linearGradient id="flowlo-mark-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3EF2CF" />
            <stop offset="58%" stopColor="#66E8FF" />
            <stop offset="100%" stopColor="#FFD45A" />
          </linearGradient>
        </defs>
        <path
          d="M16 18.5C16 15.4624 18.4624 13 21.5 13H47L37.2 22.8H27.2V29.4H40.8L32.2 38H27.2V50.5H16V18.5Z"
          fill="rgba(255,255,255,0.08)"
        />
        <path
          d="M21.5 13H47L37.2 22.8H27.2V29.4H40.8L32.2 38H27.2V50.5H16V18.5C16 15.4624 18.4624 13 21.5 13Z"
          fill="url(#flowlo-mark-gradient)"
        />
        <path
          d="M30 43.6L38.5 35.1H47.8L34.2 48.7C31.8061 51.0939 27.9258 51.0939 25.5319 48.7L21.6 44.8H30V43.6Z"
          fill="rgba(255,212,90,0.75)"
        />
      </svg>
    </div>
  );
}

