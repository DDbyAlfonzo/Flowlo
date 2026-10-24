"use client";

/* FlowLo — loading system state.

   Two small stores, both owned by <LoadingProvider> in the root layout:
   - activity: live "what is the app doing" cards (Tier 2). Callers hand in the
     real async steps; the panel only ever reports what actually ran.
   - page loads: a counter of mounted skeletons. The preloader (Tier 1) uses it
     as the real "first screen has its data" signal. */

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { fontVars } from "@/components/redesign/fonts";
import styles from "./loading.module.css";

/* ───────── tiny store ───────── */

type Listener = () => void;

function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set(next: T | ((prev: T) => T)) {
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

type Store<T> = ReturnType<typeof createStore<T>>;

function useStore<T>(store: Store<T>, serverValue: T) {
  return useSyncExternalStore(store.subscribe, store.get, () => serverValue);
}

/* ───────── activity types ───────── */

export type StepContext = {
  /** Report 0–100 progress for the running step (e.g. an upload). */
  progress: (percent: number) => void;
};

export type ActivityStep = {
  label: string;
  run: (ctx: StepContext) => Promise<unknown>;
};

export type ActivitySpec = {
  /** Shown while running, e.g. "Saving order". */
  title: string;
  /** Shown when every step finished, e.g. "Order saved". */
  successTitle?: string;
  /** Shown when a step failed, e.g. "Order not saved yet". */
  failureTitle?: string;
  /** Reassurance under the error, e.g. "Your order is still in the form." */
  failureHint?: string;
  steps: ActivityStep[];
};

export type ActivityResult = { ok: true } | { ok: false; error: Error };

type StepStatus = "idle" | "act" | "done" | "err";

export type ActivityItem = {
  id: number;
  title: string;
  phase: "running" | "error" | "done";
  steps: { label: string; status: StepStatus }[];
  percent: number;
  message?: string;
};

type ActivityController = {
  retry: () => void;
  dismiss: () => void;
};

type LoadingApi = {
  run: (spec: ActivitySpec) => Promise<ActivityResult>;
  registerPageLoad: () => () => void;
  activity: Store<ActivityItem[]>;
  pageLoads: Store<number>;
  retry: (id: number) => void;
  dismiss: (id: number) => void;
};

const LoadingContext = createContext<LoadingApi | null>(null);

function toError(error: unknown, fallback: string) {
  return error instanceof Error ? error : new Error(fallback);
}

const DONE_VISIBLE_MS = 2200;

export function LoadingProvider({ children }: { children: ReactNode }) {
  const apiRef = useRef<LoadingApi | null>(null);

  if (!apiRef.current) {
    const activity = createStore<ActivityItem[]>([]);
    const pageLoads = createStore(0);
    const controllers = new Map<number, ActivityController>();
    let nextId = 1;

    const patch = (id: number, update: (item: ActivityItem) => ActivityItem) =>
      activity.set((items) => items.map((item) => (item.id === id ? update(item) : item)));

    const remove = (id: number) => {
      controllers.delete(id);
      activity.set((items) => items.filter((item) => item.id !== id));
    };

    apiRef.current = {
      activity,
      pageLoads,
      registerPageLoad() {
        pageLoads.set((count) => count + 1);
        let released = false;
        return () => {
          if (released) return;
          released = true;
          pageLoads.set((count) => Math.max(0, count - 1));
        };
      },
      retry: (id) => controllers.get(id)?.retry(),
      dismiss: (id) => controllers.get(id)?.dismiss(),
      run(spec) {
        const id = nextId++;
        const total = spec.steps.length;

        activity.set((items) => [
          ...items.slice(-2),
          {
            id,
            title: spec.title,
            phase: "running",
            steps: spec.steps.map((step) => ({ label: step.label, status: "idle" as StepStatus })),
            percent: 0,
          },
        ]);

        return new Promise<ActivityResult>((resolve) => {
          const execute = async (from: number) => {
            patch(id, (item) => ({ ...item, phase: "running", title: spec.title, message: undefined }));

            for (let index = from; index < total; index += 1) {
              patch(id, (item) => ({
                ...item,
                percent: (index / total) * 100,
                steps: item.steps.map((step, i) =>
                  i === index ? { ...step, status: "act" } : step,
                ),
              }));

              try {
                await spec.steps[index].run({
                  progress: (percent) =>
                    patch(id, (item) => ({
                      ...item,
                      percent: ((index + Math.min(100, Math.max(0, percent)) / 100) / total) * 100,
                    })),
                });
              } catch (rawError) {
                const error = toError(rawError, "Something went wrong.");

                patch(id, (item) => ({
                  ...item,
                  phase: "error",
                  title: spec.failureTitle ?? "That didn’t go through",
                  message: [error.message, spec.failureHint].filter(Boolean).join(" "),
                  steps: item.steps.map((step, i) =>
                    i === index ? { ...step, status: "err" } : step,
                  ),
                }));

                // Wait for the person: retry resumes at the failed step (earlier
                // steps are never re-run), dismiss hands the failure back.
                controllers.set(id, {
                  retry: () => {
                    controllers.delete(id);
                    void execute(index);
                  },
                  dismiss: () => {
                    remove(id);
                    resolve({ ok: false, error });
                  },
                });
                return;
              }

              patch(id, (item) => ({
                ...item,
                percent: ((index + 1) / total) * 100,
                steps: item.steps.map((step, i) =>
                  i === index ? { ...step, status: "done" } : step,
                ),
              }));
            }

            patch(id, (item) => ({
              ...item,
              phase: "done",
              title: spec.successTitle ?? "All done",
              percent: 100,
            }));
            resolve({ ok: true });
            window.setTimeout(() => remove(id), DONE_VISIBLE_MS);
          };

          void execute(0);
        });
      },
    };
  }

  const api = apiRef.current;

  return (
    <LoadingContext.Provider value={api}>
      {children}
      <ActivityDock />
    </LoadingContext.Provider>
  );
}

function useLoadingApi() {
  const api = useContext(LoadingContext);
  if (!api) {
    throw new Error("Loading hooks must be used inside LoadingProvider.");
  }
  return api;
}

/** Run real async steps with a live, non-blocking progress panel. */
export function useActivity() {
  const api = useLoadingApi();
  return useCallback((spec: ActivitySpec) => api.run(spec), [api]);
}

/** Mark the current screen as still loading its data (skeleton on screen). */
export function usePageLoading(active = true) {
  const api = useLoadingApi();

  useEffect(() => {
    if (!active) return;
    return api.registerPageLoad();
  }, [active, api]);
}

/** Number of screens currently showing a skeleton. */
export function usePageLoadCount() {
  const api = useLoadingApi();
  return useStore(api.pageLoads, 0);
}

/* ───────── activity panel UI ───────── */

function ActivityDock() {
  const api = useLoadingApi();
  const items = useStore(api.activity, []);

  if (!items.length) {
    return null;
  }

  return (
    <div className={`${styles.root} ${fontVars} ${styles.dock}`} data-fl-activity>
      {items.map((item) => (
        <section
          key={item.id}
          className={styles.panel}
          role={item.phase === "error" ? "alert" : "status"}
          aria-live={item.phase === "error" ? "assertive" : "polite"}
          aria-label={item.title}
        >
          <h4 className={item.phase === "done" ? styles.okTitle : undefined}>{item.title}</h4>
          <div
            className={styles.bar}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(item.percent)}
            aria-label={`${item.title} progress`}
          >
            <i style={{ width: `${item.percent}%` }} />
          </div>
          <ul className={styles.st}>
            {item.steps.map((step, index) => (
              <li
                key={`${index}-${step.label}`}
                className={
                  step.status === "act"
                    ? styles.act
                    : step.status === "done"
                      ? styles.done
                      : step.status === "err"
                        ? styles.err
                        : undefined
                }
              >
                <span className={styles.dot} aria-hidden="true">
                  {step.status === "done" ? "✓" : step.status === "err" ? "!" : ""}
                </span>
                {step.label}
              </li>
            ))}
          </ul>
          {item.phase === "error" ? (
            <>
              {item.message ? <p className={styles.pmsg}>{item.message}</p> : null}
              <div className={styles.pact}>
                <button type="button" className={styles.p} onClick={() => api.retry(item.id)} autoFocus>
                  Try again
                </button>
                <button type="button" onClick={() => api.dismiss(item.id)}>
                  Dismiss
                </button>
              </div>
            </>
          ) : null}
        </section>
      ))}
    </div>
  );
}
