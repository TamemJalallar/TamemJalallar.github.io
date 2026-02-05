"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import TurndownService from "turndown";

export default function HtmlToMarkdown() {
  const [html, setHtml] = useState("<h1>Hello</h1><p>Convert <strong>HTML</strong> to markdown.</p>");

  const md = useMemo(() => {
    try {
      const td = new TurndownService();
      return td.turndown(html);
    } catch {
      return "";
    }
  }, [html]);

  const copy = async () => navigator.clipboard.writeText(md);

  return (
    <ToolShell title="HTML → Markdown" description="Convert HTML to Markdown locally.">
      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          className="min-h-[320px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"
        />
        <div className="min-h-[320px] w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm overflow-auto">
          <pre className="whitespace-pre-wrap break-words">{md}</pre>
        </div>
      </div>

      <button onClick={copy} className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
        Copy Markdown
      </button>
    </ToolShell>
  );
}
