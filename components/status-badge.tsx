type StatusBadgeProps = {
  tone: "success" | "warning" | "danger" | "neutral";
  label: string;
};

const toneClasses: Record<StatusBadgeProps["tone"], string> = {
  success:
    "border border-romano-mintText/20 bg-romano-mint text-romano-mintText shadow-[0_0_24px_-18px_rgba(62,242,207,0.8)]",
  warning:
    "border border-romano-amberText/20 bg-romano-amber text-romano-amberText shadow-[0_0_24px_-18px_rgba(255,212,90,0.8)]",
  danger:
    "border border-romano-roseText/20 bg-romano-rose text-romano-roseText shadow-[0_0_24px_-18px_rgba(255,107,107,0.75)]",
  neutral:
    "border border-romano-line bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] text-romano-slate",
};

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-[2rem] max-w-full min-w-0 items-center justify-center rounded-full px-3 py-1.5 text-center text-[10px] font-semibold uppercase leading-[1.15] tracking-[0.16em] [overflow-wrap:anywhere] sm:px-3.5 sm:text-xs ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
