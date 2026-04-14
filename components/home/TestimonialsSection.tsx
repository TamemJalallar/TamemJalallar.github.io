"use client";

import SectionWrapper from "@/components/SectionWrapper";

type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
};

type TestimonialsSectionProps = {
  title: string;
  subtitle: string;
  bodyHtml?: string;
  items: TestimonialItem[];
};

export default function TestimonialsSection({
  title,
  subtitle,
  bodyHtml,
  items,
}: TestimonialsSectionProps) {
  return (
    <SectionWrapper id="testimonials" className="scroll-mt-24 py-10 md:py-16">
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

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.id}
              className="fx-glow rounded-3xl border border-black/10 bg-white/80 p-5 shadow-soft dark:border-white/10 dark:bg-white/5"
            >
              <blockquote className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                "{item.quote}"
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">{item.name}</span>
                <span className="mt-1 block text-slate-600 dark:text-slate-300">
                  {item.role} · {item.company}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
