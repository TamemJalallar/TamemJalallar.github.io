"use client";

import { useState } from "react";
import { copyToClipboard } from "./tool-utils";

type Encoding = "hex" | "base64";

type HashAlgo = "SHA-1" | "SHA-256" | "SHA-512";

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function bufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function base64ToBuffer(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function hexToBuffer(value: string) {
  const clean = value.replace(/[^0-9a-f]/gi, "");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return bytes.buffer;
}

export default function HmacSigner() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [hashAlgo, setHashAlgo] = useState<HashAlgo>("SHA-256");
  const [encoding, setEncoding] = useState<Encoding>("hex");
  const [signature, setSignature] = useState("");
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function sign() {
    setError("");
    setVerifyResult(null);
    try {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: { name: hashAlgo } },
        false,
        ["sign", "verify"],
      );

      const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
      const out = encoding === "hex" ? bufferToHex(sig) : bufferToBase64(sig);
      setSignature(out);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to sign message.");
    }
  }

  async function verify() {
    setError("");
    setVerifyResult(null);

    try {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: { name: hashAlgo } },
        false,
        ["sign", "verify"],
      );

      const signatureBuffer = encoding === "hex" ? hexToBuffer(verifyInput) : base64ToBuffer(verifyInput);
      const ok = await crypto.subtle.verify("HMAC", key, signatureBuffer, enc.encode(message));
      setVerifyResult(ok ? "Valid signature" : "Invalid signature");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to verify signature.");
    }
  }

  async function copy() {
    if (!signature) return;
    const ok = await copyToClipboard(signature);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">HMAC Signer / Verifier</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Sign messages locally with HMAC and verify signatures.
      </p>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Message</label>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="mt-1 min-h-24 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Secret key</label>
      <input
        type="text"
        value={secret}
        onChange={(event) => setSecret(event.target.value)}
        className="mt-1 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <label>
          Hash
          <select
            value={hashAlgo}
            onChange={(event) => setHashAlgo(event.target.value as HashAlgo)}
            className="ml-2 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          >
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </label>
        <label>
          Encoding
          <select
            value={encoding}
            onChange={(event) => setEncoding(event.target.value as Encoding)}
            className="ml-2 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          >
            <option value="hex">Hex</option>
            <option value="base64">Base64</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => void sign()}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Sign
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-3 text-xs dark:border-white/10 dark:bg-grey-900/70">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Signature</span>
          <button
            type="button"
            onClick={() => void copy()}
            disabled={!signature}
            className="rounded-lg border border-gray-300/80 px-2 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="mt-2 break-all font-mono text-[11px] text-black/70 dark:text-white/70">
          {signature || "No signature yet."}
        </div>
      </div>

      <label className="mt-4 block text-xs text-black/60 dark:text-white/60">Verify signature</label>
      <input
        value={verifyInput}
        onChange={(event) => setVerifyInput(event.target.value)}
        className="mt-1 w-full rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
      />

      <button
        type="button"
        onClick={() => void verify()}
        className="mt-3 rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
      >
        Verify
      </button>

      {verifyResult ? (
        <p className="mt-2 text-xs text-black/60 dark:text-white/60">{verifyResult}</p>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
