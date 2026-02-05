"use client";

import { TOOLS } from "../tools.registry";

export default function ToolDetailClient({ slug }: { slug: string }) {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return <div className="p-6">Tool not found.</div>;
  return <div className="p-6">{tool.component}</div>;
}
