import type { Metadata } from "next";
import ToolsPageClient from "./tools-page-client";

export const metadata: Metadata = {
  title: "Tools",
  description: "A growing collection of browser-based utilities for everyday tasks.",
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
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold">Tools</h1>
      <p className="mt-2 text-white/70">Quick utilities you can run in-browser.</p>

      <div className="mt-6">
        <ToolsPageClient />
      </div>
    </div>
  );
}
