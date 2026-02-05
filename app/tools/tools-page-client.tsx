"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TOOL_META } from "./tools.data";
import { FiArrowUpRight, FiChevronDown, FiSearch } from "react-icons/fi";

type SortMode = "title" | "category" | "random" | "grouped";

// Change this order to whatever you want.
const GROUP_ORDER = ["pdf", "dev", "text", "data", "image", "color", "utility", "fun"] as const;

type GroupKey = (typeof GROUP_ORDER)[number] | "other";

function pickGroup(tags?: string[]): GroupKey {
  if (!tags?.length) return "other";
  for (const g of GROUP_ORDER) {
    if (tags.includes(g)) return g;
  }
  return "other";
}

function labelForGroup(g: GroupKey) {
  const map: Record<GroupKey, string> = {
    pdf: "PDF",
    dev: "Developer",
    text: "Text",
    data: "Data",
    image: "Image",
    color: "Color",
    utility: "Utility",
    fun: "Fun",
    other: "Other",
  };
  return map[g];
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

export default function ToolsPageClient() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string>("all");
  const [sortMode, setSortMode] = useState<SortMode>("grouped");
  const [shuffleSeed, setShuffleSeed] = useState<number>(() => Date.now());
  const [collapsedGroups, setCollapsedGroups] = useState<Partial<Record<GroupKey, boolean>>>({});

  const groupKeys = useMemo<GroupKey[]>(() => [...GROUP_ORDER, "other"], []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    TOOL_META.forEach((t) => (t.tags ?? []).forEach((x) => set.add(x)));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return TOOL_META.filter((t) => {
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
      const next: Record<GroupKey, boolean> = {};
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
                      <div className="text-xs font-semibold uppercase tracking-widest text-white/50">
                        {group.label}
                      </div>
                      <div className="text-xs text-white/40">{group.tools.length}</div>
                      <div className="h-px flex-1 bg-white/10" />
                    </button>
                  </div>

                  {!isCollapsed
                    ? group.tools.map((t) => (
                        <Link
                          key={t.slug}
                          href={`/tools/${t.slug}`}
                          className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
                        >
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
                              {t.tags.map((x) => (
                                <span
                                  key={x}
                                  className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-white/70"
                                >
                                  {x}
                                </span>
                              ))}
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
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{t.title}</div>
                    <div className="mt-2 text-sm text-white/70">{t.description}</div>
                  </div>
                  <FiArrowUpRight className="mt-1 opacity-50 transition-opacity group-hover:opacity-100" />
                </div>

                {t.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.tags.map((x) => (
                      <span
                        key={x}
                        className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-white/70"
                      >
                        {x}
                      </span>
                    ))}
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
