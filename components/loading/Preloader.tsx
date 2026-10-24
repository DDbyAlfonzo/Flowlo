"use client";

/* FlowLo — Tier 1: brand preloader, once per browser session.

   Progress is driven by real signals, not a timer:
     1. Signing you in               -> Firebase auth has resolved
     2. Loading your business        -> access check + business profile are in
     3. Getting your orders and stock -> the first screen has swapped its
                                         skeletons for real data
   A short minimum keeps the logo reveal from flashing on fast connections, and a
   hard cap means it can never trap someone behind a slow request. */

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { fontVars } from "@/components/redesign/fonts";
import { FlowMark } from "./FlowMark";
import { usePageLoadCount } from "./loading-context";
import styles from "./loading.module.css";

const SEEN_KEY = "flowlo:preloader-seen";
const MIN_VISIBLE_MS = 1500;
const MAX_VISIBLE_MS = 12000;
const SETTLE_MS = 250;

const PHASES = [
  "Signing you in",
  "Loading your business",
  "Getting your orders and stock",
] as const;
const MILESTONES = [0, 34, 68, 100];

/* Public and marketing pages never show it. */
function isEligible(pathname: string) {
  if (pathname === "/") return false;
  return !["/track", "/privacy", "/terms", "/register", "/forgot-password"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

const NO_FLASH_SCRIPT = `try{if(sessionStorage.getItem(${JSON.stringify(SEEN_KEY)}))document.documentElement.setAttribute("data-fl-pre-seen","")}catch(e){}`;

export function Preloader() {
  const pathname = usePathname();
  const eligible = useRef(isEligible(pathname)).current;
  const { user, loading, accessLoading, businessLoading } = useAuth();
  const pageLoads = usePageLoadCount();

  const [revealed, setRevealed] = useState(false);
  const [shineGo, setShineGo] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [phase3, setPhase3] = useState(false);
  const [forced, setForced] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);
  const [percent, setPercent] = useState(0);
  const currentRef = useRef(0);
  const finishing = useRef(false);

  const p1 = forced || Boolean(user) || !loading;
  const p2 = forced || (p1 && !accessLoading && !businessLoading);
  const completed = (p1 ? 1 : 0) + (p2 ? 1 : 0) + (forced || (p2 && phase3) ? 1 : 0);

  // Decide whether to play at all, then start the reveal.
  useEffect(() => {
    if (!eligible) return;

    try {
      if (sessionStorage.getItem(SEEN_KEY)) {
        setGone(true);
        return;
      }
    } catch {
      /* storage blocked: just play */
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(reduceMotion);

    document.documentElement.style.overflow = "hidden";
    const timers = [
      window.setTimeout(() => setRevealed(true), 120),
      window.setTimeout(() => setShineGo(true), reduceMotion ? 220 : 1020),
      window.setTimeout(() => setMinElapsed(true), reduceMotion ? 500 : MIN_VISIBLE_MS),
      window.setTimeout(() => setForced(true), MAX_VISIBLE_MS),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.documentElement.style.overflow = "";
    };
  }, [eligible]);

  // Phase 3: the first screen has no skeleton left, held briefly so a hand-off
  // between two skeletons does not count as "ready".
  useEffect(() => {
    if (!p2 || phase3) return;
    if (pageLoads > 0) return;

    const timer = window.setTimeout(() => setPhase3(true), SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [p2, phase3, pageLoads]);

  // Ease the number toward the real milestone; creep slowly while waiting.
  useEffect(() => {
    if (!eligible || gone) return;

    let frame = 0;

    const tick = () => {
      const floor = MILESTONES[completed];
      const goal = completed >= 3 ? 100 : floor + 24;
      const rate = completed >= 3 ? 0.16 : completed > 0 ? 0.05 : 0.012;

      currentRef.current += (goal - currentRef.current) * rate;
      if (currentRef.current < floor) currentRef.current += (floor - currentRef.current) * 0.2;
      if (completed >= 3 && currentRef.current > 99.4) currentRef.current = 100;

      setPercent(Math.min(100, currentRef.current));
      if (currentRef.current < 100) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [completed, eligible, gone]);

  // Done: show "Ready", wipe away, remember for the session. Fires once.
  const canFinish = eligible && !gone && completed >= 3 && minElapsed && percent >= 100;

  useEffect(() => {
    if (!canFinish || finishing.current) return;
    finishing.current = true;

    setReady(true);
    window.setTimeout(() => setOut(true), 320);
    window.setTimeout(
      () => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          /* ignore */
        }
        document.documentElement.style.overflow = "";
        setGone(true);
      },
      320 + (reduce ? 450 : 900),
    );
  }, [canFinish, reduce]);

  if (!eligible || gone) {
    return null;
  }

  const label = ready ? "Ready" : PHASES[Math.min(completed, 2)];
  const className = [
    styles.root,
    fontVars,
    styles.pre,
    revealed ? styles.in : "",
    shineGo ? styles.shineGo : "",
    out ? styles.out : "",
    reduce ? styles.fade : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      <div className={className} data-fl-preloader aria-label="Loading FlowLo">
        <span className={`${styles.blob} ${styles.b1}`} />
        <span className={`${styles.blob} ${styles.b2}`} />
        <span className={`${styles.blob} ${styles.b3}`} />
        <div className={styles.pc}>
          <div className={styles.mark}>
            <FlowMark shineClass={styles.shine} />
          </div>
          <div className={styles.wm}>
            flow<i>lo</i>
          </div>
          <div
            className={styles.track}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percent)}
            aria-label="Loading FlowLo"
          >
            <div className={styles.fill} style={{ width: `${percent}%` }} />
          </div>
          <div className={styles.meta}>
            <span role="status" aria-live="polite">
              {label}
            </span>
            <output aria-hidden="true">{Math.round(percent)}%</output>
          </div>
          <div className={styles.steps3} aria-hidden="true">
            {PHASES.map((phase, index) => (
              <i key={phase} className={index <= completed || ready ? styles.on : undefined} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
