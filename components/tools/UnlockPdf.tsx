"use client";

export default function UnlockPdf() {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Unlock PDF</h2>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Removing passwords is not supported in-browser with the current dependencies. If you
        want this, we can add a dedicated PDF encryption library.
      </p>
    </div>
  );
}
