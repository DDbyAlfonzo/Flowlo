"use client";

import { useEffect } from "react";

export function useOverflowDebug(scope: string) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const reportOverflow = () => {
      const viewportWidth = window.innerWidth;
      const rootWidth = document.documentElement.scrollWidth;
      const bodyWidth = document.body.scrollWidth;

      if (Math.max(rootWidth, bodyWidth) <= viewportWidth + 1) {
        return;
      }

      const offenders = Array.from(document.body.querySelectorAll<HTMLElement>("*"))
        .map((element) => ({
          element,
          rect: element.getBoundingClientRect(),
        }))
        .filter(({ rect }) => rect.width > 0 && (rect.left < -1 || rect.right > viewportWidth + 1))
        .slice(0, 8)
        .map(({ element, rect }) => ({
          tag: element.tagName.toLowerCase(),
          className: element.className,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        }));

      console.info(`[FlowLo overflow debug:${scope}]`, {
        path: window.location.pathname,
        viewportWidth,
        rootWidth,
        bodyWidth,
        offenders,
      });
    };

    const measureId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(reportOverflow);
    });

    window.addEventListener("resize", reportOverflow);

    return () => {
      window.cancelAnimationFrame(measureId);
      window.removeEventListener("resize", reportOverflow);
    };
  }, [scope]);
}
