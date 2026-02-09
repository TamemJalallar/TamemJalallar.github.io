"use client";

import { useEffect, useMemo, useState } from "react";

const STREAM_URL = process.env.NEXT_PUBLIC_STREAM_URL ?? "";
const STREAM_PASSWORD = process.env.NEXT_PUBLIC_STREAM_PASS ?? "change-me";
const CONTACT_EMAIL = "tjalallar@att.net";

const STORAGE_KEY = "private-stream-unlocked";

function buildMailto(name: string) {
  const subject = "Private Stream Access Request";
  const body = `Name: ${name}\n\nPlease grant access to the private stream.`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function PrivateStreamClient() {
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") setUnlocked(true);
  }, []);

  const isConfigured = STREAM_PASSWORD !== "";

  const streamType = useMemo(() => {
    if (!STREAM_URL) return "none";
    if (STREAM_URL.endsWith(".m3u8")) return "hls";
    return "iframe";
  }, []);

  const unlock = () => {
    setError("");
    if (!password.trim()) {
      setError("Enter the stream password.");
      return;
    }
    if (password !== STREAM_PASSWORD) {
      setError("Incorrect password.");
      return;
    }
    setUnlocked(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, "true");
    }
  };

  const requestAccess = () => {
    if (!name.trim()) {
      setError("Please enter your name before requesting access.");
      return;
    }
    window.location.href = buildMailto(name.trim());
  };

  return (
    <div className="rounded-3xl border border-gray-200/70 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-grey-900/60">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h2 className="text-xl font-semibold">Private Stream</h2>
          <p className="text-xs text-black/60 dark:text-white/60">
            Password required. Client-side gate only.
          </p>
        </div>
        {!isConfigured || STREAM_PASSWORD === "change-me" ? (
          <span className="rounded-full border border-amber-200/70 bg-amber-50 px-3 py-1 text-xs text-amber-700">
            Update stream password
          </span>
        ) : null}
      </div>

      {!unlocked ? (
        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-sm text-black/60 dark:text-white/60">Stream password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={unlock}
              className="mt-3 rounded-xl bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
            >
              Unlock stream
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 text-sm text-black/70 dark:border-white/10 dark:bg-grey-900/50 dark:text-white/70">
            <div className="font-semibold">Request access</div>
            <p className="mt-1 text-xs text-black/60 dark:text-white/60">
              Enter your name and we’ll open an email request.
            </p>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-3 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
              placeholder="Your name"
            />
            <button
              type="button"
              onClick={requestAccess}
              className="mt-3 rounded-xl border border-gray-300/70 px-4 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
            >
              Request access
            </button>
          </div>

          {error ? <p className="text-xs text-red-600 dark:text-red-300">{error}</p> : null}
        </div>
      ) : (
        <div className="mt-6">
          {!STREAM_URL ? (
            <div className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 text-sm text-black/70 dark:border-white/10 dark:bg-grey-900/50 dark:text-white/70">
              <div className="font-semibold">Stream URL not set</div>
              <p className="mt-1 text-xs">
                Set `NEXT_PUBLIC_STREAM_URL` to your player embed URL or HLS `.m3u8` link.
              </p>
            </div>
          ) : null}

          {STREAM_URL ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-black dark:border-white/10">
              {streamType === "hls" ? (
                <video
                  controls
                  playsInline
                  src={STREAM_URL}
                  className="h-[360px] w-full bg-black"
                />
              ) : (
                <iframe
                  src={STREAM_URL}
                  title="Private stream"
                  className="h-[360px] w-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          ) : null}

          <p className="mt-3 text-xs text-black/60 dark:text-white/60">
            This page is client-gated only. For real protection, use Cloudflare Access.
          </p>
        </div>
      )}
    </div>
  );
}
