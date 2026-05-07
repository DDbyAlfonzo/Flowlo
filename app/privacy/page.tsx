import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="page-wrap max-w-4xl justify-center pb-12">
      <div className="card-surface p-6 sm:p-8">
        <Link href="/" className="text-sm font-semibold text-romano-mintText">
          Back to FlowLo
        </Link>
        <p className="eyebrow-label mt-5">Legal</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-romano-ink">
          Privacy
        </h1>
        <div className="mt-6 grid gap-4 text-sm leading-7 text-romano-slate">
          <p>
            FlowLo stores business, product, and order information so sellers can manage
            stock and customer sales in one place.
          </p>
          <p>
            Each account only has access to its own data, and Firebase rules are used to
            protect that ownership at the data layer.
          </p>
          <p>
            This privacy page is an MVP placeholder and should be expanded with full policy
            language before a public launch.
          </p>
        </div>
      </div>
    </main>
  );
}
