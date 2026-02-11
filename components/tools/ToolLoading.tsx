"use client";

import ToolShell from "./_ToolShell";

export default function ToolLoading({ title }: { title: string }) {
  return (
    <ToolShell title={title} description="Preparing the tool engine…">
      <div className="space-y-3">
        <div className="h-4 w-2/3 rounded-full bg-white/10" />
        <div className="h-4 w-1/2 rounded-full bg-white/10" />
        <div className="h-28 w-full rounded-2xl border border-white/10 bg-white/5" />
        <div className="h-10 w-32 rounded-xl bg-white/10" />
      </div>
    </ToolShell>
  );
}
