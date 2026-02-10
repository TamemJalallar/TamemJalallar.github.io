"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TOOL_META } from "./tools.data";
import { FiArrowUpRight, FiChevronDown, FiSearch } from "react-icons/fi";

type SortMode = "title" | "category" | "random" | "grouped";

// Change this order to whatever you want.
const GROUP_ORDER = ["studio", "utility", "fun"] as const;

type GroupKey = (typeof GROUP_ORDER)[number] | "other";

const GROUP_STYLES: Record<
  string,
  { badge: string; dot: string; label: string; count: string; bar: string }
> = {
  pdf: {
    badge: "border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-200",
    dot: "bg-amber-400",
    label: "text-amber-700 dark:text-amber-200",
    count: "text-amber-600/80 dark:text-amber-200/70",
    bar: "bg-amber-400/80",
  },
  dev: {
    badge: "border-sky-500/40 bg-sky-500/15 text-sky-700 dark:text-sky-200",
    dot: "bg-sky-400",
    label: "text-sky-700 dark:text-sky-200",
    count: "text-sky-600/80 dark:text-sky-200/70",
    bar: "bg-sky-400/80",
  },
  text: {
    badge: "border-indigo-500/40 bg-indigo-500/15 text-indigo-700 dark:text-indigo-200",
    dot: "bg-indigo-400",
    label: "text-indigo-700 dark:text-indigo-200",
    count: "text-indigo-600/80 dark:text-indigo-200/70",
    bar: "bg-indigo-400/80",
  },
  data: {
    badge: "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200",
    dot: "bg-emerald-400",
    label: "text-emerald-700 dark:text-emerald-200",
    count: "text-emerald-600/80 dark:text-emerald-200/70",
    bar: "bg-emerald-400/80",
  },
  image: {
    badge: "border-cyan-500/40 bg-cyan-500/15 text-cyan-700 dark:text-cyan-200",
    dot: "bg-cyan-400",
    label: "text-cyan-700 dark:text-cyan-200",
    count: "text-cyan-600/80 dark:text-cyan-200/70",
    bar: "bg-cyan-400/80",
  },
  video: {
    badge: "border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-200",
    dot: "bg-rose-400",
    label: "text-rose-700 dark:text-rose-200",
    count: "text-rose-600/80 dark:text-rose-200/70",
    bar: "bg-rose-400/80",
  },
  color: {
    badge: "border-orange-500/40 bg-orange-500/15 text-orange-700 dark:text-orange-200",
    dot: "bg-orange-400",
    label: "text-orange-700 dark:text-orange-200",
    count: "text-orange-600/80 dark:text-orange-200/70",
    bar: "bg-orange-400/80",
  },
  utility: {
    badge: "border-slate-500/40 bg-slate-500/15 text-slate-700 dark:text-slate-200",
    dot: "bg-slate-400",
    label: "text-slate-700 dark:text-slate-200",
    count: "text-slate-600/80 dark:text-slate-200/70",
    bar: "bg-slate-400/80",
  },
  fun: {
    badge: "border-pink-500/40 bg-pink-500/15 text-pink-700 dark:text-pink-200",
    dot: "bg-pink-400",
    label: "text-pink-700 dark:text-pink-200",
    count: "text-pink-600/80 dark:text-pink-200/70",
    bar: "bg-pink-400/80",
  },
  other: {
    badge: "border-gray-400/40 bg-gray-400/10 text-gray-600 dark:text-gray-300",
    dot: "bg-gray-400",
    label: "text-gray-600 dark:text-gray-300",
    count: "text-gray-500/80 dark:text-gray-300/70",
    bar: "bg-gray-400/70",
  },
  studio: {
    badge: "border-teal-500/40 bg-teal-500/15 text-teal-700 dark:text-teal-200",
    dot: "bg-teal-400",
    label: "text-teal-700 dark:text-teal-200",
    count: "text-teal-600/80 dark:text-teal-200/70",
    bar: "bg-teal-400/80",
  },
};

function pickGroup(tags?: string[]): GroupKey {
  if (!tags?.length) return "other";
  for (const g of GROUP_ORDER) {
    if (tags.includes(g)) return g;
  }
  return "other";
}

function labelForGroup(g: GroupKey) {
  const map: Record<string, string> = {
    studio: "Studios",
    pdf: "PDF",
    dev: "Developer",
    text: "Text",
    data: "Data",
    image: "Image",
    video: "Video",
    color: "Color",
    utility: "Utility",
    fun: "Fun",
    other: "Other",
  };
  return map[g] ?? "Other";
}

function styleForTag(tag: string) {
  if (GROUP_ORDER.includes(tag as any)) {
    return GROUP_STYLES[tag as GroupKey];
  }
  return GROUP_STYLES.other;
}

function stableShuffle<T>(arr: T[], seed: number) {
  const out = [...arr];
  let s = seed >>> 0;

  const rand = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };

  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const LIST_TAGS = new Set(["studio", "utility", "fun"]);

function shouldShowTool(t: (typeof TOOL_META)[number]) {
  return (t.tags ?? []).some((tag) => LIST_TAGS.has(tag));
}

export default function ToolsPageClient() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string>("all");
  const [sortMode, setSortMode] = useState<SortMode>("grouped");
  const [shuffleSeed, setShuffleSeed] = useState<number>(() => Date.now());
  const [collapsedGroups, setCollapsedGroups] = useState<Partial<Record<GroupKey, boolean>>>(() => {
    const next: Partial<Record<GroupKey, boolean>> = {};
    [...GROUP_ORDER, "other"].forEach((key) => {
      next[key] = key !== "studio";
    });
    return next;
  });

  const groupKeys = useMemo<GroupKey[]>(() => [...GROUP_ORDER, "other"], []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    TOOL_META.filter(shouldShowTool).forEach((t) =>
      (t.tags ?? []).forEach((x) => set.add(x)),
    );
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return TOOL_META.filter(shouldShowTool).filter((t) => {
      const matchesQuery =
        !query ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        (t.tags ?? []).some((x) => x.toLowerCase().includes(query));

      const matchesTag = tag === "all" || (t.tags ?? []).includes(tag);
      return matchesQuery && matchesTag;
    });
  }, [q, tag]);

  const flatSorted = useMemo(() => {
    const base = [...filtered];

    if (sortMode === "title") {
      return base.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );
    }

    if (sortMode === "category") {
      return base.sort((a, b) => {
        const ga = pickGroup(a.tags);
        const gb = pickGroup(b.tags);
        const ra = ga === "other" ? 999 : GROUP_ORDER.indexOf(ga as any);
        const rb = gb === "other" ? 999 : GROUP_ORDER.indexOf(gb as any);
        if (ra !== rb) return ra - rb;
        return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
      });
    }

    if (sortMode === "random") {
      return stableShuffle(base, shuffleSeed);
    }

    // grouped mode handled separately
    return base;
  }, [filtered, sortMode, shuffleSeed]);

  const grouped = useMemo(() => {
    if (sortMode !== "grouped") return [];

    const buckets = new Map<GroupKey, typeof filtered>();
    for (const t of filtered) {
      const g = pickGroup(t.tags);
      const arr = buckets.get(g) ?? [];
      arr.push(t);
      buckets.set(g, arr);
    }

    const groups: { key: GroupKey; label: string; tools: typeof filtered }[] = [];

    for (const g of GROUP_ORDER) {
      const tools = buckets.get(g);
      if (!tools?.length) continue;
      groups.push({
        key: g,
        label: labelForGroup(g),
        tools: tools.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
        ),
      });
    }

    const other = buckets.get("other");
    if (other?.length) {
      groups.push({
        key: "other",
        label: labelForGroup("other"),
        tools: other.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
        ),
      });
    }

    return groups;
  }, [filtered, sortMode]);

  const shuffle = () => setShuffleSeed(Date.now());
  const toggleGroup = (key: GroupKey) => {
    setCollapsedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setAllCollapsed = (value: boolean) => {
    setCollapsedGroups(() => {
      const next: Partial<Record<GroupKey, boolean>> = {};
      groupKeys.forEach((key) => {
        next[key] = value;
      });
      return next;
    });
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:max-w-md">
          <FiSearch className="opacity-60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tools…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
          >
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
            >
              <option value="grouped">Sort: Grouped</option>
              <option value="title">Sort: Title</option>
              <option value="category">Sort: Category</option>
              <option value="random">Sort: Random</option>
            </select>

            {sortMode === "random" ? (
              <button
                type="button"
                onClick={shuffle}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10"
              >
                Shuffle
              </button>
            ) : null}

            {sortMode === "grouped" ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAllCollapsed(true)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10"
                >
                  Collapse all
                </button>
                <button
                  type="button"
                  onClick={() => setAllCollapsed(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10"
                >
                  Expand all
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortMode === "grouped"
          ? grouped.map((group) => {
              const isCollapsed = collapsedGroups[group.key];
              const groupStyle = GROUP_STYLES[group.key] ?? GROUP_STYLES.other;
              return (
                <div key={group.key} className="contents">
                  <div className="sm:col-span-2 lg:col-span-3">
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.key)}
                      className="flex w-full items-center gap-3 text-left"
                    >
                      <FiChevronDown
                        className={`text-white/60 transition-transform ${
                          isCollapsed ? "-rotate-90" : "rotate-0"
                        }`}
                      />
                      <span className={`h-2 w-2 rounded-full ${groupStyle.dot}`} />
                      <div
                        className={`text-xs font-semibold uppercase tracking-widest ${groupStyle.label}`}
                      >
                        {group.label}
                      </div>
                      <div className={`text-xs ${groupStyle.count}`}>
                        {group.tools.length}
                      </div>
                      <div className="h-px flex-1 bg-white/10" />
                    </button>
                  </div>

                  {!isCollapsed
                    ? group.tools.map((t) => (
                        <Link
                          key={t.slug}
                          href={`/tools/${t.slug}`}
                          className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 pl-6 transition-colors hover:bg-white/10`}
                        >
                          <span
                            className={`absolute left-0 top-0 h-full w-1 ${GROUP_STYLES[pickGroup(t.tags)].bar}`}
                          />
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-lg font-semibold">{t.title}</div>
                              <div className="mt-2 text-sm text-white/70">
                                {t.description}
                              </div>
                            </div>
                            <FiArrowUpRight className="mt-1 opacity-50 transition-opacity group-hover:opacity-100" />
                          </div>

                          {t.tags?.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {t.tags.map((x) => {
                                const style = styleForTag(x);
                                return (
                                  <span
                                    key={x}
                                    className={`rounded-full border px-2 py-0.5 text-xs ${style.badge}`}
                                  >
                                    {x}
                                  </span>
                                );
                              })}
                            </div>
                          ) : null}
                        </Link>
                      ))
                    : null}
                </div>
              );
            })
          : flatSorted.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 pl-6 transition-colors hover:bg-white/10"
              >
                <span
                  className={`absolute left-0 top-0 h-full w-1 ${GROUP_STYLES[pickGroup(t.tags)].bar}`}
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{t.title}</div>
                    <div className="mt-2 text-sm text-white/70">{t.description}</div>
                  </div>
                  <FiArrowUpRight className="mt-1 opacity-50 transition-opacity group-hover:opacity-100" />
                </div>

                {t.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.tags.map((x) => {
                      const style = styleForTag(x);
                      return (
                        <span
                          key={x}
                          className={`rounded-full border px-2 py-0.5 text-xs ${style.badge}`}
                        >
                          {x}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
              </Link>
            ))}

        {(sortMode === "grouped" ? grouped.length === 0 : flatSorted.length === 0) ? (
          <div className="text-white/70">No tools match your search.</div>
        ) : null}
      </div>
    </div>
  );
}
