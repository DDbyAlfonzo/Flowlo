import Link from "next/link";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex w-full max-w-full min-w-0 flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <p className="eyebrow-label">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="section-title mt-3">{title}</h2>
        <p className="section-copy mt-3 max-w-2xl leading-7 [overflow-wrap:anywhere] sm:leading-8">{description}</p>
      </div>

      {actionHref && actionLabel ? (
        <Link href={actionHref} className="primary-button w-full sm:w-auto">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
