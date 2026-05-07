import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="page-wrap max-w-4xl justify-center pb-12">
      <div className="card-surface p-6 sm:p-8">
        <Link href="/" className="text-sm font-semibold text-romano-mintText">
          Back to FlowLo
        </Link>
        <p className="eyebrow-label mt-5">Legal</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-romano-ink">
          Terms
        </h1>
        <div className="mt-6 grid gap-4 text-sm leading-7 text-romano-slate">
          <p>
            FlowLo is built to help small businesses manage stock, orders, and customer
            communication more clearly.
          </p>
          <p>
            By using FlowLo, you agree to use the product responsibly, keep your own
            account secure, and only manage data that belongs to your business.
          </p>
          <p>
            These terms are a simple placeholder for the MVP and can be expanded with
            legal review before public launch.
          </p>
        </div>
      </div>
    </main>
  );
}
