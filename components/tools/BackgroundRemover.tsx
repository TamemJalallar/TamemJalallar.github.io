"use client";

import { useEffect, useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import { canvasToBlob, downloadBlob, loadImageFromFile, sanitizeFilename } from "./tool-utils";

type Color = { r: number; g: number; b: number };

type OutputState = {
  blob: Blob;
  url: string;
  name: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const rgbToHex = (color: Color) =>
  `#${[color.r, color.g, color.b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;

const hexToRgb = (hex: string): Color => {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16) || 0;
  const g = Number.parseInt(normalized.slice(2, 4), 16) || 0;
  const b = Number.parseInt(normalized.slice(4, 6), 16) || 0;
  return { r, g, b };
};

export default function BackgroundRemover() {
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [color, setColor] = useState("#ffffff");
  const [tolerance, setTolerance] = useState(18);
  const [feather, setFeather] = useState(12);
  const [edgeRefine, setEdgeRefine] = useState(20);
  const [smartEdge, setSmartEdge] = useState(true);
  const [edgeBoost, setEdgeBoost] = useState(35);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState<OutputState | null>(null);

  useEffect(() => {
    return () => {
      if (output?.url) URL.revokeObjectURL(output.url);
    };
  }, [output?.url]);

  const resetOutput = () => {
    if (output?.url) URL.revokeObjectURL(output.url);
    setOutput(null);
  };

  const drawOriginal = async (nextFile: File | null) => {
    setFile(nextFile);
    setError("");
    resetOutput();

    if (!nextFile) {
      setImageSize(null);
      return;
    }

    try {
      const image = await loadImageFromFile(nextFile);
      setImageSize({ width: image.width, height: image.height });

      const canvas = originalCanvasRef.current;
      const outputCanvas = outputCanvasRef.current;
      if (!canvas || !outputCanvas) return;

      canvas.width = image.width;
      canvas.height = image.height;
      outputCanvas.width = image.width;
      outputCanvas.height = image.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to load image.");
    }
  };

  const pickColorFromCanvas = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = originalCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const picked = { r: pixel[0] ?? 0, g: pixel[1] ?? 0, b: pixel[2] ?? 0 };
    setColor(rgbToHex(picked));
  };

  const applyRemoval = async () => {
    const originalCanvas = originalCanvasRef.current;
    const outputCanvas = outputCanvasRef.current;
    if (!originalCanvas || !outputCanvas) return;

    setBusy(true);
    setError("");
    resetOutput();

    try {
      const ctx = originalCanvas.getContext("2d");
      const outCtx = outputCanvas.getContext("2d");
      if (!ctx || !outCtx) throw new Error("Canvas not available.");

      const { width, height } = originalCanvas;
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const target = hexToRgb(color);
      const cutoff = clamp(tolerance, 0, 100) * 2.55;
      const featherRange = clamp(feather, 0, 100) * 2.55;
      const edgeStrength = clamp(edgeRefine, 0, 100) / 100;

      let edgeMap: Float32Array | null = null;
      if (edgeStrength > 0) {
        const luminance = new Float32Array(width * height);
        for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
          luminance[p] = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) || 0;
        }

        edgeMap = new Float32Array(width * height);
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const idx = y * width + x;
            const right = x + 1 < width ? luminance[idx + 1] : luminance[idx];
            const down = y + 1 < height ? luminance[idx + width] : luminance[idx];
            const center = luminance[idx];
            const edge =
              Math.min(255, Math.abs(center - right) + Math.abs(center - down));
            edgeMap[idx] = edge;
          }
        }
      }

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] ?? 0;
        const g = data[i + 1] ?? 0;
        const b = data[i + 2] ?? 0;
        const dr = r - target.r;
        const dg = g - target.g;
        const db = b - target.b;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);

        let alpha = data[i + 3] ?? 255;
        if (dist <= cutoff) {
          alpha = 0;
        } else if (featherRange > 0 && dist <= cutoff + featherRange) {
          const t = (dist - cutoff) / featherRange;
          alpha = Math.round(255 * t);
        }

        if (edgeMap && edgeStrength > 0) {
          const idx = i / 4;
          const edge = edgeMap[idx] || 0;
          const boost = smartEdge ? 1 + edgeBoost / 100 : 1;
          const edgeAlpha = Math.round((edge / 255) * edgeStrength * boost * 255);
          alpha = Math.max(alpha, edgeAlpha);
        }

        data[i + 3] = alpha;
      }

      outCtx.putImageData(imageData, 0, 0);

      const blob = await canvasToBlob(outputCanvas, "image/png");
      const url = URL.createObjectURL(blob);
      setOutput({
        blob,
        url,
        name: `${sanitizeFilename(file?.name || "image")}-no-bg.png`,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to remove background.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Background Remover"
      description="Simple color-key background removal using local processing."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => void drawOriginal(event.target.files?.[0] ?? null)}
          className="block text-sm"
        />

        <label className="flex items-center gap-2 text-sm text-white/70">
          Background
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="h-8 w-10 rounded-md border border-white/10 bg-black/20"
          />
        </label>

        <label className="text-sm text-white/70">
          Tolerance
          <input
            type="range"
            min={0}
            max={100}
            value={tolerance}
            onChange={(event) => setTolerance(Number(event.target.value) || 0)}
            className="ml-2"
          />
          <span className="ml-2 text-xs text-white/50">{tolerance}</span>
        </label>

        <label className="text-sm text-white/70">
          Feather
          <input
            type="range"
            min={0}
            max={100}
            value={feather}
            onChange={(event) => setFeather(Number(event.target.value) || 0)}
            className="ml-2"
          />
          <span className="ml-2 text-xs text-white/50">{feather}</span>
        </label>

        <label className="text-sm text-white/70">
          Edge refine
          <input
            type="range"
            min={0}
            max={100}
            value={edgeRefine}
            onChange={(event) => setEdgeRefine(Number(event.target.value) || 0)}
            className="ml-2"
          />
          <span className="ml-2 text-xs text-white/50">{edgeRefine}</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={smartEdge}
            onChange={(event) => setSmartEdge(event.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-black/20"
          />
          Smart edge (hair/text)
        </label>

        {smartEdge ? (
          <label className="text-sm text-white/70">
            Edge boost
            <input
              type="range"
              min={0}
              max={150}
              value={edgeBoost}
              onChange={(event) => setEdgeBoost(Number(event.target.value) || 0)}
              className="ml-2"
            />
            <span className="ml-2 text-xs text-white/50">{edgeBoost}</span>
          </label>
        ) : null}

        <button
          type="button"
          onClick={() => void applyRemoval()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Processing..." : "Remove background"}
        </button>
      </div>

      {imageSize ? (
        <p className="mt-3 text-xs text-white/60">
          Click the original image to pick a background color. Size: {imageSize.width} × {imageSize.height}
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-xs text-white/60">Original (click to pick)</div>
          <canvas
            ref={originalCanvasRef}
            onClick={pickColorFromCanvas}
            className="max-w-full rounded-lg border border-white/10"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-xs text-white/60">Output</div>
          <canvas
            ref={outputCanvasRef}
            className="max-w-full rounded-lg border border-white/10"
          />

          {output ? (
            <button
              type="button"
              onClick={() => downloadBlob(output.blob, output.name)}
              className="mt-3 rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
            >
              Download PNG
            </button>
          ) : null}
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
