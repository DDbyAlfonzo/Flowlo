import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
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
      <div className="card-surface relative w-full max-w-full overflow-hidden p-5 text-center sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top_left,rgba(62,242,207,0.08),transparent_44%),radial-gradient(circle_at_top_right,rgba(255,212,90,0.05),transparent_26%)]" />
        <div className="mx-auto">
          <BrandMark size="sm" />
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-[-0.04em] text-romano-ink sm:mt-5 sm:text-[1.7rem]">
          {title}
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-romano-slate [overflow-wrap:anywhere] sm:max-w-md">
          {description}
        </p>

        {actionHref && actionLabel ? (
          <Link href={actionHref} className="primary-button mt-5 w-full sm:mt-6 sm:w-auto">
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </Reveal>
  );
}
