"use client";

import React, { useEffect, useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import QrScanner from "qr-scanner";

export default function QrCodeScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const [active, setActive] = useState(false);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    return () => {
      // cleanup on unmount
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
      scannerRef.current = null;
    };
  }, []);

  const start = async () => {
    if (!videoRef.current || active) return;

    setResult("");
    const scanner = new QrScanner(
      videoRef.current,
      (scanResult) => {
        const value = typeof scanResult === "string" ? scanResult : scanResult.data;
        setResult(value);
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scannerRef.current = scanner;

    try {
      await scanner.start();
      setActive(true);
    } catch {
      setActive(false);
      scannerRef.current?.destroy();
      scannerRef.current = null;
      alert("Camera permission denied or unavailable.");
    }
  };

  const stop = () => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setActive(false);
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  };

  return (
    <ToolShell title="QR Code Scanner" description="Scan a QR code using your camera (runs locally).">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <video ref={videoRef} className="w-full rounded-lg" />
          <div className="mt-3 flex gap-2">
            <button
              onClick={start}
              disabled={active}
              className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
            >
              Start
            </button>
            <button
              onClick={stop}
              disabled={!active}
              className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
            >
              Stop
            </button>
          </div>
          <div className="mt-2 text-xs text-white/50">
            Tip: HTTPS is required for camera access in production.
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-sm text-white/70">Result</div>
          <div className="mt-2 rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-sm break-all">
            {result || "—"}
          </div>

          <button
            onClick={copy}
            disabled={!result}
            className="mt-3 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
          >
            Copy
          </button>
        </div>
      </div>
    </ToolShell>
  );
}
