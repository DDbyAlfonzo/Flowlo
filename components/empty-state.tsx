import Link from "next/link";
import { Reveal } from "@/components/reveal";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <Reveal>
      <div className="card-surface relative overflow-hidden p-9 text-center sm:p-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.1),transparent_44%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.06),transparent_26%)]" />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] border border-romano-navy/20 bg-romano-mint text-[#041215] shadow-glow">
          <span className="text-xl font-semibold">R</span>
        </div>
        <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-romano-ink">{title}</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-romano-slate">
          {description}
        </p>

        {actionHref && actionLabel ? (
          <Link href={actionHref} className="primary-button mt-7">
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </Reveal>
  );
}
