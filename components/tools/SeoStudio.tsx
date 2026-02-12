"use client";

import { useMemo, useState } from "react";
import StudioLayout, { type StudioSection } from "./_StudioLayout";
import { copyToClipboard, downloadBlob } from "./tool-utils";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const downloadText = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain" });
  downloadBlob(blob, filename);
};

type MetaState = {
  title: string;
  description: string;
  canonical: string;
  keywords: string;
  indexable: boolean;
};

type SocialState = {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  twitterHandle: string;
};

type RobotsState = {
  allow: string;
  disallow: string;
  sitemap: string;
  host: string;
};

type SitemapState = {
  baseUrl: string;
  urlsText: string;
  changefreq: string;
  priority: string;
  includeLastmod: boolean;
};

type JsonLdState = {
  preset: string;
  text: string;
};

const META_TITLE_LIMIT = 60;
const META_DESC_LIMIT = 160;

function buildMetaTags(meta: MetaState) {
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
  ];
  if (meta.keywords.trim()) {
    tags.push(`<meta name="keywords" content="${escapeHtml(meta.keywords)}" />`);
  }
  if (meta.canonical.trim()) {
    tags.push(`<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`);
  }
  tags.push(
    `<meta name="robots" content="${meta.indexable ? "index,follow" : "noindex,nofollow"}" />`,
  );
  return tags.join("\n");
}

function buildSocialTags(social: SocialState) {
  const tags = [
    `<meta property="og:title" content="${escapeHtml(social.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(social.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(social.url)}" />`,
    `<meta property="og:image" content="${escapeHtml(social.image)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(social.siteName)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(social.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(social.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(social.image)}" />`,
  ];
  if (social.twitterHandle.trim()) {
    tags.push(`<meta name="twitter:site" content="${escapeHtml(social.twitterHandle)}" />`);
  }
  return tags.join("\n");
}

function buildRobots(robots: RobotsState) {
  const lines = ["User-agent: *"];
  if (robots.allow.trim()) lines.push(`Allow: ${robots.allow.trim()}`);
  if (robots.disallow.trim()) lines.push(`Disallow: ${robots.disallow.trim()}`);
  if (robots.sitemap.trim()) lines.push(`Sitemap: ${robots.sitemap.trim()}`);
  if (robots.host.trim()) lines.push(`Host: ${robots.host.trim()}`);
  return lines.join("\n");
}

function normalizeBaseUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed.replace(/\/$/, "");
}

function buildSitemap(state: SitemapState) {
  const base = normalizeBaseUrl(state.baseUrl);
  const urls = state.urlsText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^https?:\/\//i.test(line)) return line;
      if (!base) return line;
      if (line.startsWith("/")) return `${base}${line}`;
      return `${base}/${line}`;
    });

  const lastmod = new Date().toISOString().slice(0, 10);
  const changefreq = state.changefreq.trim();
  const priority = state.priority.trim();

  const entries = urls.map((url) => {
    const parts = [`<loc>${escapeHtml(url)}</loc>`];
    if (state.includeLastmod) parts.push(`<lastmod>${lastmod}</lastmod>`);
    if (changefreq) parts.push(`<changefreq>${escapeHtml(changefreq)}</changefreq>`);
    if (priority) parts.push(`<priority>${escapeHtml(priority)}</priority>`);
    return `  <url>\n    ${parts.join("\n    ")}\n  </url>`;
  });

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    entries.join("\n"),
    "</urlset>",
  ]
    .filter(Boolean)
    .join("\n");
}

const PRESET_TEMPLATES: Record<string, (base: SocialState) => string> = {
  WebSite: (base) =>
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: base.siteName,
        url: base.url,
        description: base.description,
      },
      null,
      2,
    ),
  Organization: (base) =>
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: base.siteName,
        url: base.url,
        logo: base.image,
      },
      null,
      2,
    ),
  Person: (base) =>
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: base.siteName,
        url: base.url,
      },
      null,
      2,
    ),
  SoftwareApplication: (base) =>
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: base.siteName,
        description: base.description,
        url: base.url,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      null,
      2,
    ),
  BlogPosting: (base) =>
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: base.title,
        description: base.description,
        image: base.image,
        datePublished: new Date().toISOString().slice(0, 10),
        author: {
          "@type": "Person",
          name: base.siteName,
        },
        mainEntityOfPage: base.url,
      },
      null,
      2,
    ),
  FAQPage: () =>
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is this page about?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Explain the key takeaway in one sentence.",
            },
          },
        ],
      },
      null,
      2,
    ),
  Product: (base) =>
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: base.title,
        description: base.description,
        image: base.image,
        brand: {
          "@type": "Brand",
          name: base.siteName,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
      null,
      2,
    ),
  LocalBusiness: (base) =>
    JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: base.siteName,
        description: base.description,
        url: base.url,
        telephone: "+1-555-555-5555",
        address: {
          "@type": "PostalAddress",
          streetAddress: "123 Main St",
          addressLocality: "City",
          addressRegion: "State",
          postalCode: "00000",
          addressCountry: "US",
        },
      },
      null,
      2,
    ),
};

function validateJsonLd(text: string) {
  try {
    const parsed = JSON.parse(text);
    const root = Array.isArray(parsed) ? parsed[0] : parsed;
    const graph = root && typeof root === "object" ? (root as any)["@graph"] : null;
    const node =
      Array.isArray(graph) && graph.length
        ? graph.find((entry) => entry && entry["@type"]) ?? graph[0]
        : root;
    const rawType = node?.["@type"] ?? "";
    const type = Array.isArray(rawType) ? rawType[0] : rawType;

    const getNested = (obj: any, path: string) => {
      const parts = path.split(".");
      let current = obj;
      for (const part of parts) {
        if (current == null) return undefined;
        if (Array.isArray(current)) current = current[0];
        current = current?.[part];
      }
      return current;
    };

    const missing: string[] = [];

    const requireFields = (fields: string[]) => {
      fields.forEach((field) => {
        const value = getNested(node, field);
        if (value === undefined || value === null || value === "") {
          missing.push(field);
        }
      });
    };

    switch (type) {
      case "WebSite":
        requireFields(["name", "url"]);
        break;
      case "Organization":
        requireFields(["name", "url"]);
        break;
      case "Person":
        requireFields(["name"]);
        break;
      case "SoftwareApplication":
        requireFields(["name", "applicationCategory", "operatingSystem"]);
        break;
      case "BlogPosting":
        requireFields(["headline", "datePublished", "author.name"]);
        break;
      case "FAQPage": {
        const mainEntity = getNested(node, "mainEntity");
        if (!Array.isArray(mainEntity) || !mainEntity.length) {
          missing.push("mainEntity");
        } else {
          const first = mainEntity[0];
          if (!first?.acceptedAnswer?.text) {
            missing.push("mainEntity[].acceptedAnswer.text");
          }
        }
        break;
      }
      case "Product": {
        requireFields(["name"]);
        const offers = getNested(node, "offers");
        if (!offers) {
          missing.push("offers");
        } else if (!getNested(node, "offers.price")) {
          missing.push("offers.price");
        }
        break;
      }
      case "LocalBusiness":
        requireFields(["name", "address.streetAddress", "address.addressLocality"]);
        break;
      default:
        requireFields(["name"]);
        break;
    }

    return {
      valid: true,
      type: type || "Unknown",
      missing,
      error: "",
    };
  } catch (error) {
    return {
      valid: false,
      type: "",
      missing: [],
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

function matchPattern(path: string, pattern: string) {
  if (!pattern) return false;
  let source = pattern.replace(/[.+^${}()|[\\]\\]/g, "\\$&");
  source = source.replace(/\*/g, ".*");
  const endsWith = source.endsWith("$");
  if (endsWith) source = source.slice(0, -2);
  const regex = new RegExp(`^${source}${endsWith ? "$" : ""}`);
  return regex.test(path);
}

function checkRobots(path: string, robotsText: string) {
  const lines = robotsText
    .split(/\r?\n/)
    .map((line) => line.split("#")[0]?.trim() || "")
    .filter(Boolean);

  let currentAgents: string[] = [];
  const rules: { agent: string; type: "allow" | "disallow"; value: string }[] = [];

  for (const line of lines) {
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      currentAgents = value ? [value.toLowerCase()] : [];
      continue;
    }
    if (key === "allow" || key === "disallow") {
      currentAgents.forEach((agent) => {
        rules.push({ agent, type: key as "allow" | "disallow", value });
      });
    }
  }

  const applicable = rules.filter((rule) => rule.agent === "*" || rule.agent === "all");
  let best: { type: "allow" | "disallow"; length: number } | null = null;

  for (const rule of applicable) {
    if (!matchPattern(path, rule.value)) continue;
    const length = rule.value.length;
    if (!best || length > best.length || (length === best.length && rule.type === "allow")) {
      best = { type: rule.type, length };
    }
  }

  if (!best) return "Allowed";
  return best.type === "disallow" ? "Blocked" : "Allowed";
}

function MetaTagsBuilder({
  meta,
  setMeta,
  output,
}: {
  meta: MetaState;
  setMeta: (next: MetaState) => void;
  output: string;
}) {
  const titleCount = meta.title.length;
  const descCount = meta.description.length;
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-white/70">
          Title
          <input
            value={meta.title}
            onChange={(event) => setMeta({ ...meta, title: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
          <div className="mt-1 text-xs text-white/50">
            {titleCount}/{META_TITLE_LIMIT}
          </div>
        </label>
        <label className="text-sm text-white/70">
          Canonical URL
          <input
            value={meta.canonical}
            onChange={(event) => setMeta({ ...meta, canonical: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70 sm:col-span-2">
          Description
          <textarea
            value={meta.description}
            onChange={(event) => setMeta({ ...meta, description: event.target.value })}
            className="mt-1 min-h-[80px] w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
          <div className="mt-1 text-xs text-white/50">
            {descCount}/{META_DESC_LIMIT}
          </div>
        </label>
        <label className="text-sm text-white/70 sm:col-span-2">
          Keywords (comma separated)
          <input
            value={meta.keywords}
            onChange={(event) => setMeta({ ...meta, keywords: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={meta.indexable}
            onChange={(event) => setMeta({ ...meta, indexable: event.target.checked })}
          />
          Allow indexing
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void copyToClipboard(output)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
            >
              Copy tags
            </button>
            <button
              type="button"
              onClick={() => downloadText(output, "meta-tags.html")}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
            >
              Download
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="mt-3 min-h-[160px] w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs"
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>SERP preview</span>
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  previewMode === "desktop"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  previewMode === "mobile"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Mobile
              </button>
            </div>
          </div>
          <div
            className={`mt-3 rounded-xl border border-white/10 bg-black/20 p-3 ${
              previewMode === "mobile" ? "max-w-[280px]" : "max-w-none"
            }`}
          >
            <div className="text-sm font-semibold text-sky-300">
              {meta.title.slice(0, META_TITLE_LIMIT) || "Page title"}
            </div>
            <div className="text-xs text-emerald-400">
              {meta.canonical || "https://example.com"}
            </div>
            <div className="mt-2 text-xs text-white/70">
              {(meta.description || "Description preview.").slice(0, META_DESC_LIMIT)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialTagsBuilder({
  social,
  setSocial,
  output,
}: {
  social: SocialState;
  setSocial: (next: SocialState) => void;
  output: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-white/70">
          Title
          <input
            value={social.title}
            onChange={(event) => setSocial({ ...social, title: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70">
          Site name
          <input
            value={social.siteName}
            onChange={(event) => setSocial({ ...social, siteName: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70 sm:col-span-2">
          Description
          <textarea
            value={social.description}
            onChange={(event) => setSocial({ ...social, description: event.target.value })}
            className="mt-1 min-h-[80px] w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70">
          URL
          <input
            value={social.url}
            onChange={(event) => setSocial({ ...social, url: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70">
          Image URL
          <input
            value={social.image}
            onChange={(event) => setSocial({ ...social, image: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70 sm:col-span-2">
          Twitter handle
          <input
            value={social.twitterHandle}
            onChange={(event) => setSocial({ ...social, twitterHandle: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void copyToClipboard(output)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
            >
              Copy tags
            </button>
            <button
              type="button"
              onClick={() => downloadText(output, "social-tags.html")}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
            >
              Download
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="mt-3 min-h-[160px] w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs"
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="text-xs text-white/50">Social preview</div>
          <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="h-28 w-full bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
              <div className="h-full w-full bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${social.image})` }} />
            </div>
            <div className="p-3">
              <div className="text-xs uppercase tracking-wide text-white/50">{social.siteName}</div>
              <div className="mt-1 text-sm font-semibold text-white">{social.title}</div>
              <div className="mt-1 text-xs text-white/70">{social.description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RobotsBuilder({
  robots,
  setRobots,
  output,
}: {
  robots: RobotsState;
  setRobots: (next: RobotsState) => void;
  output: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-white/70">
          Allow
          <input
            value={robots.allow}
            onChange={(event) => setRobots({ ...robots, allow: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70">
          Disallow
          <input
            value={robots.disallow}
            onChange={(event) => setRobots({ ...robots, disallow: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70 sm:col-span-2">
          Sitemap URL
          <input
            value={robots.sitemap}
            onChange={(event) => setRobots({ ...robots, sitemap: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70 sm:col-span-2">
          Host
          <input
            value={robots.host}
            onChange={(event) => setRobots({ ...robots, host: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void copyToClipboard(output)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
        >
          Copy robots.txt
        </button>
        <button
          type="button"
          onClick={() => downloadText(output, "robots.txt")}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
        >
          Download
        </button>
      </div>

      <textarea
        value={output}
        readOnly
        className="mt-3 min-h-[140px] w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs"
      />
    </div>
  );
}

function RobotsTester({ robotsText }: { robotsText: string }) {
  const [path, setPath] = useState("/tools/");
  const result = useMemo(() => checkRobots(path, robotsText), [path, robotsText]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <label className="text-sm text-white/70">
        Test path
        <input
          value={path}
          onChange={(event) => setPath(event.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
        />
      </label>
      <div className="mt-3 text-sm">
        Result: <span className="font-semibold text-white">{result}</span>
      </div>
      <p className="mt-2 text-xs text-white/60">
        Checks allow/disallow rules for user-agent * using longest-match precedence.
      </p>
    </div>
  );
}

function JsonLdBuilder({
  jsonLd,
  setJsonLd,
  validation,
  onPresetChange,
}: {
  jsonLd: JsonLdState;
  setJsonLd: (next: JsonLdState) => void;
  validation: ReturnType<typeof validateJsonLd>;
  onPresetChange?: (preset: string) => void;
}) {
  const snippet = useMemo(
    () => `<script type="application/ld+json">\n${jsonLd.text}\n</script>`,
    [jsonLd.text],
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-white/70">
          Preset
          <select
            value={jsonLd.preset}
            onChange={(event) => {
              const next = event.target.value;
              if (onPresetChange) {
                onPresetChange(next);
              } else {
                setJsonLd({ ...jsonLd, preset: next });
              }
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          >
            {Object.keys(PRESET_TEMPLATES).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
        <div className="text-xs text-white/50">
          Detected type: {validation.valid ? validation.type : "Invalid"}
        </div>
      </div>

      <textarea
        value={jsonLd.text}
        onChange={(event) => setJsonLd({ ...jsonLd, text: event.target.value })}
        className="mt-3 min-h-[220px] w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void copyToClipboard(snippet)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
        >
          Copy JSON-LD
        </button>
        <button
          type="button"
          onClick={() => downloadText(jsonLd.text, "schema.json")}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
        >
          Download JSON
        </button>
      </div>

      {validation.valid ? (
        validation.missing.length ? (
          <p className="mt-2 text-xs text-amber-200">
            Missing fields: {validation.missing.join(", ")}
          </p>
        ) : (
          <p className="mt-2 text-xs text-emerald-200">Schema looks good.</p>
        )
      ) : (
        <p className="mt-2 text-xs text-rose-200">{validation.error}</p>
      )}
    </div>
  );
}

function SitemapBuilder({
  sitemap,
  setSitemap,
  output,
}: {
  sitemap: SitemapState;
  setSitemap: (next: SitemapState) => void;
  output: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-white/70">
          Base URL
          <input
            value={sitemap.baseUrl}
            onChange={(event) => setSitemap({ ...sitemap, baseUrl: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="text-sm text-white/70">
          Changefreq
          <select
            value={sitemap.changefreq}
            onChange={(event) => setSitemap({ ...sitemap, changefreq: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          >
            <option value="">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        <label className="text-sm text-white/70">
          Priority
          <input
            value={sitemap.priority}
            onChange={(event) => setSitemap({ ...sitemap, priority: event.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={sitemap.includeLastmod}
            onChange={(event) => setSitemap({ ...sitemap, includeLastmod: event.target.checked })}
          />
          Include lastmod
        </label>
        <label className="text-sm text-white/70 sm:col-span-2">
          URLs (one per line)
          <textarea
            value={sitemap.urlsText}
            onChange={(event) => setSitemap({ ...sitemap, urlsText: event.target.value })}
            className="mt-1 min-h-[140px] w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void copyToClipboard(output)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
        >
          Copy sitemap.xml
        </button>
        <button
          type="button"
          onClick={() => downloadText(output, "sitemap.xml")}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
        >
          Download
        </button>
      </div>

      <textarea
        value={output}
        readOnly
        className="mt-3 min-h-[180px] w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs"
      />
    </div>
  );
}

function ExportBundle({
  meta,
  social,
  robots,
  jsonLd,
  sitemap,
}: {
  meta: string;
  social: string;
  robots: string;
  jsonLd: string;
  sitemap: string;
}) {
  const [busy, setBusy] = useState(false);

  const exportAll = async () => {
    setBusy(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      zip.file("meta-tags.html", meta);
      zip.file("social-tags.html", social);
      zip.file("robots.txt", robots);
      zip.file("schema.json", jsonLd);
      zip.file("schema-snippet.html", `<script type=\"application/ld+json\">\n${jsonLd}\n</script>`);
      zip.file("sitemap.xml", sitemap);
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, "seo-studio-bundle.zip");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-white/70">
        Download everything as one bundle: meta tags, social tags, robots.txt, JSON-LD, sitemap.
      </p>
      <button
        type="button"
        onClick={() => void exportAll()}
        disabled={busy}
        className="mt-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
      >
        {busy ? "Packaging..." : "Download bundle"}
      </button>
    </div>
  );
}

export default function SeoStudio() {
  const [meta, setMeta] = useState<MetaState>({
    title: "Page Title",
    description: "A short description of the page.",
    canonical: "https://www.tomfromit.com/",
    keywords: "tools, utilities, local",
    indexable: true,
  });

  const [social, setSocial] = useState<SocialState>({
    title: "Open Graph Title",
    description: "Social preview description.",
    url: "https://www.tomfromit.com/",
    image: "https://www.tomfromit.com/Hero.png",
    siteName: "TomFromIT",
    twitterHandle: "@tomfromit",
  });

  const [robots, setRobots] = useState<RobotsState>({
    allow: "/",
    disallow: "/stream/",
    sitemap: "https://www.tomfromit.com/sitemap.xml",
    host: "https://www.tomfromit.com",
  });

  const [sitemap, setSitemap] = useState<SitemapState>({
    baseUrl: "https://www.tomfromit.com",
    urlsText: "/\n/tools/\n/games/\n/tools/seo-studio/\n",
    changefreq: "weekly",
    priority: "0.7",
    includeLastmod: true,
  });

  const [jsonLd, setJsonLd] = useState<JsonLdState>(() => ({
    preset: "WebSite",
    text: PRESET_TEMPLATES.WebSite(social),
  }));

  const metaOutput = useMemo(() => buildMetaTags(meta), [meta]);
  const socialOutput = useMemo(() => buildSocialTags(social), [social]);
  const robotsOutput = useMemo(() => buildRobots(robots), [robots]);
  const sitemapOutput = useMemo(() => buildSitemap(sitemap), [sitemap]);
  const validation = useMemo(() => validateJsonLd(jsonLd.text), [jsonLd.text]);

  const syncPreset = (preset: string) => {
    const template = PRESET_TEMPLATES[preset] ?? PRESET_TEMPLATES.WebSite;
    setJsonLd({ preset, text: template(social) });
  };

  const sections: StudioSection[] = [
    {
      title: "Core metadata",
      items: [
        {
          id: "meta-tags",
          label: "Meta + SERP Preview",
          description: "Title, description, canonical, robots, and preview.",
          slug: "seo-studio",
          render: () => <MetaTagsBuilder meta={meta} setMeta={setMeta} output={metaOutput} />,
        },
      ],
    },
    {
      title: "Social previews",
      items: [
        {
          id: "social-tags",
          label: "Open Graph + Twitter",
          description: "Create shareable social preview tags.",
          slug: "seo-studio",
          render: () => (
            <SocialTagsBuilder social={social} setSocial={setSocial} output={socialOutput} />
          ),
        },
      ],
    },
    {
      title: "Crawlers",
      items: [
        {
          id: "robots",
          label: "Robots.txt Builder",
          description: "Generate robots rules with sitemap link.",
          slug: "seo-studio",
          render: () => <RobotsBuilder robots={robots} setRobots={setRobots} output={robotsOutput} />,
        },
        {
          id: "robots-test",
          label: "Robots Tester",
          description: "Check if a URL path is allowed.",
          slug: "seo-studio",
          render: () => <RobotsTester robotsText={robotsOutput} />,
        },
      ],
    },
    {
      title: "Schema",
      items: [
        {
          id: "jsonld",
          label: "JSON-LD Generator",
          description: "Schema presets with validation.",
          slug: "seo-studio",
          render: () => (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 text-xs">
                {Object.keys(PRESET_TEMPLATES).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => syncPreset(preset)}
                    className={`rounded-full border px-3 py-1 ${
                      jsonLd.preset === preset
                        ? "border-sky-400/60 bg-sky-500/15 text-sky-200"
                        : "border-white/10 bg-white/5 text-white/70"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <JsonLdBuilder
                jsonLd={jsonLd}
                setJsonLd={setJsonLd}
                validation={validation}
                onPresetChange={syncPreset}
              />
            </div>
          ),
        },
      ],
    },
    {
      title: "Sitemaps",
      items: [
        {
          id: "sitemap",
          label: "Sitemap Builder",
          description: "Generate sitemap.xml from a URL list.",
          slug: "seo-studio",
          render: () => (
            <SitemapBuilder sitemap={sitemap} setSitemap={setSitemap} output={sitemapOutput} />
          ),
        },
      ],
    },
    {
      title: "Export",
      items: [
        {
          id: "bundle",
          label: "Export Bundle",
          description: "Download all SEO assets in one zip.",
          slug: "seo-studio",
          render: () => (
            <ExportBundle
              meta={metaOutput}
              social={socialOutput}
              robots={robotsOutput}
              jsonLd={jsonLd.text}
              sitemap={sitemapOutput}
            />
          ),
        },
      ],
    },
  ];

  return (
    <StudioLayout
      title="SEO Studio"
      description="Generate metadata, social tags, robots.txt, sitemaps, and JSON-LD."
      sections={sections}
    />
  );
}
