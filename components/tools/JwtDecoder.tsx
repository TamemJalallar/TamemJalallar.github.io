"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

function base64UrlToUtf8(input: string) {
  // base64url -> base64
  let b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // pad
  const pad = b64.length % 4;
  if (pad) b64 += "=".repeat(4 - pad);

  // decode
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function safeJsonParse(text: string) {
  try {
    return { ok: true as const, value: JSON.parse(text) };
  } catch (e: any) {
    return { ok: false as const, error: e?.message ?? "Invalid JSON" };
  }
}

export default function JwtDecoder() {
  const [jwt, setJwt] = useState("");

  const decoded = useMemo(() => {
    const token = jwt.trim();
    if (!token) return { status: "empty" as const };

    const parts = token.split(".");
    if (parts.length < 2) return { status: "invalid" as const, error: "JWT must have at least 2 parts (header.payload)." };

    const [h, p] = parts;

    try {
      const headerText = base64UrlToUtf8(h);
      const payloadText = base64UrlToUtf8(p);

      const header = safeJsonParse(headerText);
      const payload = safeJsonParse(payloadText);

      const signaturePresent = parts.length >= 3 && parts[2].length > 0;

      return {
        status: "ok" as const,
        signaturePresent,
        headerText,
        payloadText,
        header,
        payload,
      };
    } catch (e: any) {
      return { status: "invalid" as const, error: e?.message ?? "Failed to decode JWT." };
    }
  }, [jwt]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <ToolShell title="JWT Decoder" description="Decode JWT header and payload locally (no verification).">
      <div className="grid gap-3">
        <div>
          <label className="text-sm text-white/70">JWT</label>
          <textarea
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            placeholder="Paste JWT هنا…"
            className="mt-2 min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/40"
          />
          <div className="mt-2 text-xs text-white/50">
            Note: This tool **does not validate signatures**. It only decodes header/payload.
          </div>
        </div>

        {decoded.status === "empty" ? null : decoded.status === "invalid" ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {decoded.error}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Header */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">Header</div>
                <button
                  onClick={() => copy(JSON.stringify(decoded.header.ok ? decoded.header.value : { error: decoded.header.error }, null, 2))}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                >
                  Copy JSON
                </button>
              </div>
              <pre className="mt-3 overflow-auto rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/80">
{JSON.stringify(decoded.header.ok ? decoded.header.value : { error: decoded.header.error }, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">Payload</div>
                <button
                  onClick={() => copy(JSON.stringify(decoded.payload.ok ? decoded.payload.value : { error: decoded.payload.error }, null, 2))}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                >
                  Copy JSON
                </button>
              </div>
              <pre className="mt-3 overflow-auto rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/80">
{JSON.stringify(decoded.payload.ok ? decoded.payload.value : { error: decoded.payload.error }, null, 2)}
              </pre>
            </div>

            {/* Meta */}
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-white/80">
                Signature:{" "}
                <span className={decoded.signaturePresent ? "text-emerald-300" : "text-yellow-300"}>
                  {decoded.signaturePresent ? "present" : "missing/empty"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
