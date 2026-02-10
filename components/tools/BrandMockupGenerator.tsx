"use client";

import { useEffect, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob } from "./tool-utils";

const templates = [
  { id: "twitter", label: "Twitter/X Header", width: 1500, height: 500 },
  { id: "linkedin", label: "LinkedIn Banner", width: 1584, height: 396 },
  { id: "youtube", label: "YouTube Channel Art", width: 2560, height: 1440 },
  { id: "square", label: "Square Post", width: 1080, height: 1080 },
];

export default function BrandMockupGenerator() {
  const [logo, setLogo] = useState<string | null>(null);
  const [selected, setSelected] = useState(templates[0]?.id ?? "twitter");
  const [background, setBackground] = useState("#0f172a");
  const [accent, setAccent] = useState("#5f6cff");
  const [text, setText] = useState("Your Brand");

  useEffect(() => {
    return () => {
      if (logo) URL.revokeObjectURL(logo);
    };
  }, [logo]);

  const generate = async () => {
    const template = templates.find((t) => t.id === selected) ?? templates[0];
    if (!template) return;

    const canvas = document.createElement("canvas");
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, background);
    gradient.addColorStop(1, accent);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(canvas.width * 0.08, canvas.height * 0.18, canvas.width * 0.84, canvas.height * 0.64);

    ctx.fillStyle = "white";
    ctx.font = "bold 64px sans-serif";
    ctx.fillText(text, canvas.width * 0.12, canvas.height * 0.55);

    if (logo) {
      const img = new Image();
      img.src = logo;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const size = Math.min(canvas.width, canvas.height) * 0.25;
      ctx.drawImage(img, canvas.width * 0.12, canvas.height * 0.2, size, size);
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      downloadBlob(blob, `${template.id}-mockup.png`);
    }, "image/png");
  };

  return (
    <ToolShell
      title="Brand Mockup Generator"
      description="Create quick social banners with your logo and brand colors."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-sm text-white/70">
          Template
          <select
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          >
            {templates.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-white/70">
          Brand name
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-white/70">
          Background
          <input
            type="color"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
            className="h-8 w-10 rounded-md border border-white/10 bg-black/20"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          Accent
          <input
            type="color"
            value={accent}
            onChange={(event) => setAccent(event.target.value)}
            className="h-8 w-10 rounded-md border border-white/10 bg-black/20"
          />
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            if (!file) {
              setLogo(null);
              return;
            }
            if (logo) URL.revokeObjectURL(logo);
            setLogo(URL.createObjectURL(file));
          }}
          className="block text-sm"
        />

        <button
          type="button"
          onClick={() => void generate()}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Download mockup
        </button>
      </div>
    </ToolShell>
  );
}
