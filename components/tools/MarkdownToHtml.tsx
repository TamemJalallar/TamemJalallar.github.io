"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { marked } from "marked";

export default function MarkdownToHtml() {
  const [md, setMd] = useState("# Hello\n\nType **Markdown** here.");

  const html = useMemo(() => {
    try {
      return marked.parse(md) as string;
    } catch {
      return "";
    }
  }, [md]);

  const copy = async () => navigator.clipboard.writeText(html);

  return (
    <ToolShell title="Markdown → HTML" description="Convert Markdown to HTML locally.">
      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          className="min-h-[320px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
        />
        <div className="min-h-[320px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm overflow-auto">
          <pre className="whitespace-pre-wrap break-words">{html}</pre>
        </div>
      </div>

      <button onClick={copy} className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
        Copy HTML
      </button>
    </ToolShell>
  );
}
