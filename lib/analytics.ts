/**
 * Lightweight analytics + observability stub.
 * Swap with a real provider (PostHog, Plausible, GA, Segment) later.
 *
 * Performance budgets are also reported here so a future provider
 * can flag regressions without code changes.
 */

const DEBUG =
  typeof window !== "undefined" && window.location.hostname === "localhost";

export type EventName =
  | "page_view"
  | "search"
  | "filter_change"
  | "paginate"
  | "bookmark_add"
  | "bookmark_remove"
  | "article_open"
  | "auth_signin_attempt"
  | "auth_signup_attempt";

export const track = (
  event: EventName,
  props: Record<string, unknown> = {},
) => {
  if (DEBUG) console.debug("[analytics]", event, props);
  // window.posthog?.capture(event, props);
};

export const trackPageView = (path: string) => track("page_view", { path });

/* Performance budgets — warn if exceeded */
export const PERF_BUDGETS = {
  LCP_MS: 2500,
  FID_MS: 100,
  CLS: 0.1,
  TTFB_MS: 800,
} as const;

export const initObservability = () => {
  if (typeof window === "undefined" || !("PerformanceObserver" in window))
    return;
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEntry & { value?: number };
        if (
          entry.entryType === "largest-contentful-paint" &&
          entry.startTime > PERF_BUDGETS.LCP_MS
        ) {
          track("page_view", {
            perf_warn: "LCP",
            value: Math.round(entry.startTime),
          });
        }
        if (
          entry.entryType === "layout-shift" &&
          (e.value ?? 0) > PERF_BUDGETS.CLS
        ) {
          track("page_view", { perf_warn: "CLS", value: e.value });
        }
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } catch {
    /* unsupported */
  }
};
