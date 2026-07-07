"use client";

import { useEffect, useState } from "react";

export function PWARegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
      return;
    }

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
        }

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingWorker(worker);
            }
          });
        });
      });
    });
  }, []);

  if (!waitingWorker) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] mx-auto flex max-w-md items-center justify-between gap-3 rounded-[1.2rem] border border-romano-line bg-[linear-gradient(180deg,rgba(16,22,30,0.96),rgba(8,12,17,0.98))] p-3 shadow-soft backdrop-blur-2xl">
      <p className="text-sm font-medium text-romano-ink">Update available</p>
      <button
        type="button"
        className="secondary-button min-h-[2.75rem] rounded-[1rem] px-4 py-2 text-sm"
        onClick={() => waitingWorker.postMessage({ type: "SKIP_WAITING" })}
      >
        Update
      </button>
    </div>
  );
}
