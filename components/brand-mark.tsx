import Image from "next/image";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  plate?: "glass" | "soft" | "none";
  className?: string;
  priority?: boolean;
};

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
} as const;

const imageClasses = {
  sm: {
    width: 24,
    height: 24,
    className: "h-6 w-6",
  },
  md: {
    width: 28,
    height: 28,
    className: "h-7 w-7",
  },
  lg: {
    width: 32,
    height: 32,
    className: "h-8 w-8",
  },
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
  priority = false,
}: BrandMarkProps) {
  const imageSize = imageClasses[size];

  return (
    <div
      className={`relative grid place-items-center ${sizeClasses[size]} ${plateClasses[plate]} ${className}`.trim()}
    >
      <Image
        src="/flowlo-logo-mark.svg"
        alt="FlowLo"
        width={imageSize.width}
        height={imageSize.height}
        priority={priority}
        unoptimized
        sizes={`${imageSize.width}px`}
        draggable={false}
        className={`${imageSize.className} select-none`}
      />
    </div>
  );
}
