"use client";

import { useEffect } from "react";
import { trackEvent } from "./analytics";

type AnalyticsTrackerProps = {
  sectionIds: string[];
};

export default function AnalyticsTracker({ sectionIds }: AnalyticsTrackerProps) {
  useEffect(() => {
    const dwellStart = new Map<string, number>();

    const trackedSections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const now = performance.now();

        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!id) return;

          if (entry.isIntersecting) {
            dwellStart.set(id, now);
            return;
          }

          const startedAt = dwellStart.get(id);
          if (!startedAt) return;

          const ms = now - startedAt;
          dwellStart.delete(id);

          if (ms >= 1200) {
            trackEvent("section_dwell", {
              section: id,
              seconds: Number((ms / 1000).toFixed(1)),
            });
          }
        });
      },
      {
        threshold: [0.25, 0.45],
      }
    );

    trackedSections.forEach((section) => observer.observe(section));

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const analyticsEl = target.closest<HTMLElement>("[data-analytics]");
      if (analyticsEl) {
        trackEvent("ui_click", {
          id: analyticsEl.dataset.analytics,
          label: analyticsEl.dataset.analyticsLabel ?? analyticsEl.textContent?.trim() ?? "",
        });
      }

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      if (!href) return;

      if (href.startsWith("mailto:")) {
        trackEvent("mailto_click", { href });
        return;
      }

      if (href.startsWith("http") && !href.includes(window.location.hostname)) {
        trackEvent("outbound_click", {
          href,
          text: link.textContent?.trim() ?? "",
        });
      }
    };

    document.addEventListener("click", onClick, { passive: true });

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, [sectionIds]);

  return null;
}
