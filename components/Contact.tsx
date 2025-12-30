"use client";

import SectionWrapper from "./SectionWrapper";

export default function Contact() {
  const bookingsUrl =
    "https://outlook.office.com/book/ScheduleTimewithTom@omgww.onmicrosoft.com/";

  return (
    <SectionWrapper id="contact" className="py-10 md:py-16">
      <div className="mx-4 md:mx-6 lg:mx-auto lg:w-5/6 2xl:w-3/4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">
          Contact
        </h2>
        <p className="mt-3 text-center text-black/70 dark:text-white/70">
          The fastest way to reach me is to book time directly on my calendar.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Left: Booking card */}
          <div className="rounded-3xl bg-white/70 dark:bg-white/5 p-6 md:p-8 shadow-lift border border-black/10 dark:border-white/10">
            <h3 className="text-lg md:text-xl font-semibold">
              Schedule time with me
            </h3>
            <p className="mt-2 text-sm md:text-base text-black/70 dark:text-white/70">
              Choose a time that works for you and get an instant confirmation.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={bookingsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm md:text-base bg-violet-600 hover:bg-violet-700 text-white transition shadow-soft"
              >
                Book a meeting
              </a>

              <a
                href="mailto:tjalallar@att.net"
                className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm md:text-base bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 transition"
              >
                Email instead
              </a>
            </div>

            <div className="mt-6 text-sm text-black/60 dark:text-white/60">
              <div className="flex flex-col gap-1">
                <span>
                  <span className="font-medium">Email:</span> tjalallar@att.net
                </span>
                <span>
                  <span className="font-medium">Location:</span> Parsippany, NJ
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick note / expectations */}
          <div className="rounded-3xl bg-white/70 dark:bg-white/5 p-6 md:p-8 shadow-lift border border-black/10 dark:border-white/10">
            <h3 className="text-lg md:text-xl font-semibold">What to expect</h3>
            <ul className="mt-3 space-y-2 text-sm md:text-base text-black/70 dark:text-white/70 list-disc pl-5">
              <li>15-30 minute intro call (or longer if needed)</li>
              <li>IT Systems / Endpoint / IAM / Automation focus</li>
              <li>Happy to discuss enterprise roles and contract work</li>
            </ul>

            <div className="mt-6 rounded-2xl bg-black/5 dark:bg-white/5 p-4">
              <p className="text-sm text-black/70 dark:text-white/70">
                Prefer async? Email me a quick summary of what you're looking for
                and I'll respond ASAP.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}