"use client";
export default function ComingSoon({ name }: { name: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-xl font-semibold">{name}</div>
      <div className="mt-2 text-sm text-white/70">
        Coming soon — this tool is in the registry but not implemented yet.
      </div>
    </div>
  );
}
