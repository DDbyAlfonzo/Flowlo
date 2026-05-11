"use client";

import { BrandMark } from "@/components/brand-mark";

export function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="page-wrap items-center justify-center">
      <div className="card-surface w-full max-w-md p-8 text-center">
        <div className="relative mx-auto mb-5 grid h-14 w-14 place-items-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-romano-navy/70" />
          <BrandMark size="sm" plate="soft" className="relative z-10" priority />
        </div>
        <p className="text-base font-semibold text-romano-ink">{message}</p>
        <p className="mt-2 text-sm text-romano-slate">
          FlowLo is getting your workspace ready.
        </p>
      </div>
    </div>
  );
}
