import { useId } from "react";

/* The FlowLo "F" mark (same paths as public/flowlo-logo-mark.svg) with a gradient
   deepened for light backgrounds. `shine` adds the sweep used by the preloader. */
const F_PATH =
  "M26 18C26 14.6863 28.6863 12 32 12H100.5L83.5 29H45.5V41H84.5L70 55.5H45.5V90H26V18Z";
const CHECK_PATH =
  "M61 64.5L75.5 50H100L77 73C72.8579 77.1421 66.1421 77.1421 62 73L50 61H61V64.5Z";

export function FlowMark({
  shineClass,
  className,
  title = "FlowLo",
}: {
  shineClass?: string;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const grad = `fl-g-${uid}`;
  const sheen = `fl-s-${uid}`;
  const clip = `fl-c-${uid}`;

  return (
    <svg viewBox="16 6 92 90" role="img" aria-label={title} className={className}>
      <defs>
        <linearGradient id={grad} x1="20" y1="14" x2="98" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#00b394" />
          <stop offset="0.58" stopColor="#2aa6d8" />
          <stop offset="1" stopColor="#e8a91f" />
        </linearGradient>
        {shineClass ? (
          <>
            <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.8" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <clipPath id={clip}>
              <path d={F_PATH} />
              <path d={CHECK_PATH} />
            </clipPath>
          </>
        ) : null}
      </defs>
      <path fill={`url(#${grad})`} d={F_PATH} />
      <path fill="#e8a91f" fillOpacity="0.95" d={CHECK_PATH} />
      {shineClass ? (
        <g clipPath={`url(#${clip})`}>
          <rect className={shineClass} x="0" y="0" width="22" height="110" fill={`url(#${sheen})`} />
        </g>
      ) : null}
    </svg>
  );
}
