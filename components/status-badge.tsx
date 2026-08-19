type StatusBadgeProps = {
  tone: "success" | "warning" | "danger" | "neutral";
  label: string;
};

const toneClasses: Record<StatusBadgeProps["tone"], string> = {
  success:
    "border border-[color:var(--flowlo-success-border)] bg-[var(--flowlo-success-bg)] text-[var(--flowlo-success)] shadow-[0_0_24px_-18px_rgba(127,240,209,0.72)]",
  warning:
    "border border-[color:var(--flowlo-warning-border)] bg-[var(--flowlo-warning-bg)] text-[var(--flowlo-warning)] shadow-[0_0_24px_-18px_rgba(255,200,61,0.7)]",
  danger:
    "border border-[color:var(--flowlo-danger-border)] bg-[var(--flowlo-danger-bg)] text-[var(--flowlo-danger)] shadow-[0_0_24px_-18px_rgba(255,155,155,0.68)]",
  neutral:
    "border border-[color:var(--flowlo-border)] bg-[var(--flowlo-surface-muted)] text-[var(--flowlo-text-muted)]",
};

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-[2rem] max-w-full min-w-0 items-center justify-center rounded-full px-3 py-1.5 text-center text-xs font-semibold leading-[1.15] [overflow-wrap:anywhere] sm:px-3.5 ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
