"use client";

export default function ProtectPdf() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Protect PDF</h2>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Password protection is not available in the current in-browser setup without extra
        dependencies. If you want full encryption support, tell me and we can add a library.
      </p>
    </div>
  );
}
