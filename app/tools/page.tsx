import type { Metadata } from "next";
import ToolsPageClient from "./tools-page-client";
import { TOOL_META } from "./tools.data";

const SITE_URL = "https://www.tomfromit.com";

export const metadata: Metadata = {
  title: "Tools",
  description: "A growing collection of browser-based utilities for everyday tasks.",
  alternates: {
    canonical: "/tools/",
  },
  openGraph: {
    title: "Tools | TomFromIT",
    description: "A growing collection of browser-based utilities for everyday tasks.",
    url: "/tools/",
    images: ["/Hero.png"],
  },
  twitter: {
    title: "Tools | TomFromIT",
    description: "A growing collection of browser-based utilities for everyday tasks.",
    images: ["/Hero.png"],
  },
};

export const dynamic = "force-static";

export default function ToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tools",
    description: "A growing collection of browser-based utilities for everyday tasks.",
    url: `${SITE_URL}/tools/`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: TOOL_META.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.title,
        url: `${SITE_URL}/tools/${tool.slug}/`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="p-6">
        <h1 className="text-3xl font-semibold">Tools</h1>
        <p className="mt-2 text-white/70">Quick utilities you can run in-browser.</p>

        <div className="mt-6">
          <ToolsPageClient />
        </div>
      </div>
    </>
  );
}
