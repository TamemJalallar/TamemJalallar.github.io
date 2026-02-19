"use client";

import { FormEvent, useMemo, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { trackEvent } from "./analytics";

type LeadCaptureFormProps = {
  title: string;
  submitLabel: string;
};

type FormState = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
  website: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  message: "",
  website: "",
};

export default function LeadCaptureForm({ title, submitLabel }: LeadCaptureFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [startedAt] = useState(() => Date.now());

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()),
    [form.email]
  );

  const validate = () => {
    const nextErrors: string[] = [];

    if (!form.name.trim()) nextErrors.push("Name is required.");
    if (!emailValid) nextErrors.push("A valid email is required.");
    if (!form.projectType.trim()) nextErrors.push("Project type is required.");
    if (form.message.trim().length < 24) {
      nextErrors.push("Message should be at least 24 characters.");
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.website.trim()) {
      setStatus("Submission blocked.");
      return;
    }

    if (Date.now() - startedAt < 2500) {
      setStatus("Please take a moment before submitting.");
      return;
    }

    const lastSubmit = Number(localStorage.getItem("lead_form_last_submit") ?? "0");
    if (Date.now() - lastSubmit < 60000) {
      setStatus("Please wait about a minute before sending another request.");
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);

    if (nextErrors.length > 0) return;

    const body = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Company: ${form.company.trim() || "N/A"}`,
      `Project Type: ${form.projectType.trim()}`,
      "",
      "Details:",
      form.message.trim(),
    ].join("\n");

    localStorage.setItem("lead_form_last_submit", String(Date.now()));

    trackEvent("lead_form_submit", {
      projectType: form.projectType.trim().toLowerCase(),
      source: "homepage",
    });

    window.location.href = `mailto:tjalallar@att.net?subject=${encodeURIComponent(
      `Website Lead: ${form.projectType.trim()}`
    )}&body=${encodeURIComponent(body)}`;

    setStatus("Opening your email client...");
    setForm(initialForm);
  };

  return (
    <SectionWrapper id="lead" className="scroll-mt-24 py-10 md:py-16">
      <div className="mx-4 md:mx-6 lg:mx-auto lg:w-5/6 2xl:w-3/4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
          <p className="mt-3 text-sm text-black/70 dark:text-white/70 md:text-base">
            Share your environment and goals. I will reply with a practical plan and next steps.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="fx-glow mx-auto mt-8 max-w-3xl rounded-3xl border border-black/10 bg-white/85 p-5 shadow-soft dark:border-white/10 dark:bg-white/5 md:p-7"
          data-analytics="lead_form_submit"
        >
          <input
            type="text"
            value={form.website}
            onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
            className="hidden"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden
          />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-700 dark:text-slate-200">
              Name
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 dark:border-white/20 dark:bg-[#0b1220]/40"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              Email
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 dark:border-white/20 dark:bg-[#0b1220]/40"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              Company
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 dark:border-white/20 dark:bg-[#0b1220]/40"
                value={form.company}
                onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
              />
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              Project Type
              <input
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 dark:border-white/20 dark:bg-[#0b1220]/40"
                value={form.projectType}
                onChange={(event) => setForm((prev) => ({ ...prev, projectType: event.target.value }))}
                placeholder="IAM, Endpoint, Automation, Security"
                required
              />
            </label>
          </div>

          <label className="mt-4 block text-sm text-slate-700 dark:text-slate-200">
            Details
            <textarea
              className="mt-1 min-h-[132px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-sky-500 dark:border-white/20 dark:bg-[#0b1220]/40"
              value={form.message}
              onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
              required
            />
          </label>

          {errors.length ? (
            <ul className="mt-4 list-disc pl-5 text-sm text-red-600 dark:text-red-300">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}

          {status ? <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{status}</p> : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="fx-glow rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
              data-analytics="lead_form_submit_button"
              data-analytics-label={submitLabel}
            >
              {submitLabel}
            </button>

            <a
              href="mailto:tjalallar@att.net"
              className="fx-glow rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
              data-analytics="lead_form_direct_email"
            >
              Email directly
            </a>
          </div>
        </form>
      </div>
    </SectionWrapper>
  );
}
