"use client";

import React, { useEffect, useState } from "react";
import ToolShell from "./_ToolShell";
import QRCode from "qrcode";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://tomfromit.com");
  const [size, setSize] = useState(256);
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let alive = true;

    QRCode.toDataURL(text || " ", { width: size, margin: 1 })
      .then((url) => {
        if (alive) setSrc(url);
      })
      .catch(() => {
        if (alive) setSrc("");
      });

    return () => {
      alive = false;
    };
  }, [text, size]);

  const download = () => {
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = "qr.png";
    a.click();
  };

  return (
    <ToolShell title="QR Code Generator" description="Generate a QR code PNG from text or a URL.">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm text-white/70">Text / URL</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">Size</label>
          <input
            type="number"
            min={128}
            max={1024}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 flex justify-center">
        {src ? <img src={src} alt="QR code" className="h-auto max-w-full" /> : <div className="text-sm text-white/70">Enter text to generate.</div>}
      </div>

      <button
        onClick={download}
        disabled={!src}
        className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
      >
        Download PNG
      </button>
    </ToolShell>
  );
}
