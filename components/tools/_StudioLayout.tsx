"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import ToolShell from "./_ToolShell";

export type StudioItem = {
  id: string;
  label: string;
  description: string;
  slug: string;
  render: () => ReactNode;
};

export type StudioSection = {
  title: string;
  items: StudioItem[];
};

export default function StudioLayout({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: StudioSection[];
}) {
  const allItems = useMemo(
    () => sections.flatMap((section) => section.items),
    [sections],
  );
  const [activeId, setActiveId] = useState(allItems[0]?.id ?? "");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((section) => [section.title, false])),
  );

  const active =
    allItems.find((item) => item.id === activeId) ?? (allItems[0] ?? null);

  return (
    <ToolShell title={title} description={description}>
      <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  setCollapsed((prev) => ({
                    ...prev,
                    [section.title]: !prev[section.title],
                  }))
                }
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/20 hover:bg-white/10"
              >
                <span>{section.title}</span>
                <span className="text-sm">
                  {collapsed[section.title] ? "▸" : "▾"}
                </span>
              </button>
              {!collapsed[section.title] ? (
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const isActive = item.id === active?.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        aria-pressed={isActive}
                        className={[
                          "w-full rounded-xl border px-3 py-2 text-left transition",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60",
                          isActive
                            ? "border-white/30 bg-white/10 text-white"
                            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10",
                        ].join(" ")}
                      >
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className="text-xs text-white/60">
                          {item.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="min-w-0 space-y-4">
          {active ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">{active.label}</div>
                  <div className="text-xs text-white/60">{active.description}</div>
                </div>
                <Link
                  href={`/tools/${active.slug}`}
                  className="text-xs font-semibold text-sky-300 hover:text-sky-200"
                >
                  Open full page
                </Link>
              </div>
              {active.render()}
            </>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              Select a tool to begin.
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
