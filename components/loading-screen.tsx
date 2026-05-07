"use client";

export function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="page-wrap items-center justify-center">
      <div className="card-surface w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-romano-line border-t-romano-navy shadow-glow" />
        <p className="text-base font-semibold text-romano-ink">{message}</p>
        <p className="mt-2 text-sm text-romano-slate">
          FlowLo is getting your workspace ready.
        </p>
      </div>
    </div>
  );
}
