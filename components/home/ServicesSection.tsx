"use client";

import SectionWrapper from "@/components/SectionWrapper";
import type { ServiceItem } from "@/lib/content/home-content";

type ServicesSectionProps = {
  title: string;
  subtitle: string;
  bodyHtml?: string;
  items: ServiceItem[];
};

export default function ServicesSection({
  title,
  subtitle,
  bodyHtml,
  items,
}: ServicesSectionProps) {
  return (
    <SectionWrapper id="services" className="scroll-mt-24 py-10 md:py-16">
      <div className="mx-4 md:mx-6 lg:mx-auto lg:w-5/6 2xl:w-3/4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
          <p className="mt-3 text-sm text-black/70 dark:text-white/70 md:text-base">{subtitle}</p>
          {bodyHtml ? (
            <div
              className="mt-3 text-sm text-black/60 dark:text-white/60"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : null}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="fx-glow rounded-3xl border border-black/10 bg-white/75 p-5 shadow-soft dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>

              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>

              {item.ctaLabel && item.ctaHref ? (
                <a
                  href={item.ctaHref}
                  className="fx-glow mt-5 inline-flex rounded-xl bg-sky-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                  data-analytics={`services_${item.id}_cta`}
                  data-analytics-label={item.ctaLabel}
                >
                  {item.ctaLabel}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
