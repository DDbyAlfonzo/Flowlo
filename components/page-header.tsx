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
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="eyebrow-label">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="section-title mt-3">{title}</h2>
        <p className="section-copy mt-3 max-w-2xl">{description}</p>
      </div>

      {actionHref && actionLabel ? (
        <Link href={actionHref} className="primary-button">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
