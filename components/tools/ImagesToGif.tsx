"use client";

import { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import {
  canvasToBlob,
  downloadBlob,
  formatBytes,
  loadImageFromFile,
  sanitizeFilename,
} from "./tool-utils";
import { getFfmpeg, toUint8Array } from "./_ffmpeg";

const WIDTH_PRESETS = [0, 320, 480, 640, 800];

type Result = {
  name: string;
  blob: Blob;
  size: number;
};

type FitMode = "contain" | "cover";

function drawToCanvas(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  fit: FitMode,
  background: string,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const scale = fit === "cover"
    ? Math.max(width / image.width, height / image.height)
    : Math.min(width / image.width, height / image.height);

  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const dx = (width - drawWidth) / 2;
  const dy = (height - drawHeight) / 2;

  ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
}

export default function ImagesToGif() {
  const [files, setFiles] = useState<File[]>([]);
  const [fps, setFps] = useState(10);
  const [widthPreset, setWidthPreset] = useState(480);
  const [fit, setFit] = useState<FitMode>("contain");
  const [background, setBackground] = useState("#000000");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const hasFiles = files.length > 0;

  const maxName = useMemo(() => {
    if (!hasFiles) return "slideshow";
    return sanitizeFilename(files[0]?.name || "slideshow");
  }, [files, hasFiles]);

  const buildGif = async () => {
    if (!files.length) return;

    setBusy(true);
    setError("");
    setResult(null);

    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const outputName = `output-${stamp}.gif`;
    const framePrefix = `frame-${stamp}-`;

    try {
      const ffmpeg = await getFfmpeg();
      const images = await Promise.all(files.map((file) => loadImageFromFile(file)));

      let maxWidth = 0;
      let maxHeight = 0;
      for (let i = 0; i < images.length; i += 1) {
        maxWidth = Math.max(maxWidth, images[i]?.width || 0);
        maxHeight = Math.max(maxHeight, images[i]?.height || 0);
      }

      if (!maxWidth || !maxHeight) {
        throw new Error("Unable to read image dimensions.");
      }

      const targetWidth = widthPreset > 0 ? Math.min(widthPreset, maxWidth) : maxWidth;
      const scale = targetWidth / maxWidth;
      const targetHeight = Math.max(2, Math.round(maxHeight * scale));

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(2, Math.round(targetWidth));
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported.");

      const frameNames: string[] = [];

      for (let i = 0; i < images.length; i += 1) {
        const image = images[i];
        if (!image) continue;
        drawToCanvas(ctx, image, canvas.width, canvas.height, fit, background);
        const blob = await canvasToBlob(canvas, "image/png");
        const frameName = `${framePrefix}${String(i + 1).padStart(3, "0")}.png`;
        await ffmpeg.writeFile(frameName, await toUint8Array(blob));
        frameNames.push(frameName);
      }

      const inputPattern = `${framePrefix}%03d.png`;
      const filter = `fps=${Math.max(1, fps)},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse=dither=bayer`;

      await ffmpeg.exec([
        "-framerate",
        String(Math.max(1, fps)),
        "-i",
        inputPattern,
        "-vf",
        filter,
        "-loop",
        "0",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: "image/gif" });

      setResult({
        name: `${maxName}.gif`,
        blob,
        size: blob.size,
      });

      for (let i = 0; i < frameNames.length; i += 1) {
        await ffmpeg.deleteFile(frameNames[i]);
      }
      await ffmpeg.deleteFile(outputName);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to build GIF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Images to GIF"
      description="Create an animated GIF from a set of images locally."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            setFiles(Array.from(event.target.files ?? []));
            setResult(null);
            setError("");
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          FPS
          <input
            type="number"
            min={1}
            max={30}
            value={fps}
            onChange={(event) => setFps(Number(event.target.value) || 10)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Width
          <select
            value={widthPreset}
            onChange={(event) => setWidthPreset(Number(event.target.value) || 0)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {WIDTH_PRESETS.map((value) => (
              <option key={value} value={value}>
                {value === 0 ? "Original" : `${value}px`}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-white/70">
          Fit
          <select
            value={fit}
            onChange={(event) => setFit(event.target.value as FitMode)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            <option value="contain">Contain</option>
            <option value="cover">Cover</option>
          </select>
        </label>

        <label className="text-sm text-white/70">
          Background
          <input
            type="color"
            value={background}
            onChange={(event) => setBackground(event.target.value)}
            className="ml-2 h-8 w-10 rounded-md border border-white/10 bg-black/20"
          />
        </label>

        <button
          type="button"
          onClick={() => void buildGif()}
          disabled={!hasFiles || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Building..." : "Build GIF"}
        </button>
      </div>

      {hasFiles ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>{files.length} image(s) selected</div>
        </div>
      ) : null}

      {result ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <div className="text-xs text-white/70">{result.name}</div>
            <div className="text-[11px] text-white/50">{formatBytes(result.size)}</div>
          </div>
          <button
            type="button"
            onClick={() => downloadBlob(result.blob, result.name)}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
          >
            Download
          </button>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
