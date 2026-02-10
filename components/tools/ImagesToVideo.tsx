"use client";

import { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, loadImageFromFile, sanitizeFilename } from "./tool-utils";

const MIME_TYPES = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];

type VideoResult = {
  blob: Blob;
  size: number;
  name: string;
  duration: number;
  mimeType: string;
};

type FitMode = "contain" | "cover";

type OrderMode = "selection" | "name";

const getSupportedMimeType = () =>
  MIME_TYPES.find((type) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) ||
  "video/webm";

function drawImageToCanvas(
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

export default function ImagesToVideo() {
  const [files, setFiles] = useState<File[]>([]);
  const [orderMode, setOrderMode] = useState<OrderMode>("selection");
  const [fps, setFps] = useState(12);
  const [secondsPerImage, setSecondsPerImage] = useState(0.7);
  const [fit, setFit] = useState<FitMode>("contain");
  const [background, setBackground] = useState("#000000");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState("");

  const orderedFiles = useMemo(() => {
    if (orderMode === "name") {
      return [...files].sort((a, b) => a.name.localeCompare(b.name));
    }
    return files;
  }, [files, orderMode]);

  const estimatedDuration = useMemo(() => {
    if (!orderedFiles.length) return 0;
    return Math.max(0, secondsPerImage) * orderedFiles.length;
  }, [orderedFiles.length, secondsPerImage]);

  const buildVideo = async () => {
    if (!orderedFiles.length) return;
    if (typeof MediaRecorder === "undefined") {
      setError("Your browser does not support MediaRecorder.");
      return;
    }

    setBusy(true);
    setError("");
    setResult(null);

    try {
      const images: HTMLImageElement[] = [];
      for (const file of orderedFiles) {
        const image = await loadImageFromFile(file);
        images.push(image);
      }

      if (!images.length) throw new Error("No images loaded.");

      const width = images[0]?.width || 1280;
      const height = images[0]?.height || 720;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported.");

      if (typeof (canvas as HTMLCanvasElement).captureStream !== "function") {
        throw new Error("Canvas captureStream is not supported in this browser.");
      }

      const mimeType = getSupportedMimeType();
      const stream = canvas.captureStream(Math.max(1, Math.floor(fps)));
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size) chunks.push(event.data);
      });

      const stopPromise = new Promise<void>((resolve) => {
        recorder.addEventListener("stop", () => resolve(), { once: true });
      });

      recorder.start();

      const holdMs = Math.max(0.1, secondsPerImage) * 1000;

      for (const image of images) {
        drawImageToCanvas(ctx, image, width, height, fit, background);
        await new Promise((resolve) => setTimeout(resolve, holdMs));
      }

      recorder.stop();
      await stopPromise;
      stream.getTracks().forEach((track) => track.stop());

      const blob = new Blob(chunks, { type: mimeType || "video/webm" });
      const baseName = orderedFiles[0] ? sanitizeFilename(orderedFiles[0].name) : "slideshow";
      const name = `${baseName}-slideshow.webm`;

      setResult({
        blob,
        size: blob.size,
        name,
        duration: estimatedDuration,
        mimeType,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to create video.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Images to Video"
      description="Stitch images into a local WebM slideshow video."
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
          Order
          <select
            value={orderMode}
            onChange={(event) => setOrderMode(event.target.value as OrderMode)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            <option value="selection">Selection order</option>
            <option value="name">Sort by name</option>
          </select>
        </label>

        <label className="text-sm text-white/70">
          FPS
          <input
            type="number"
            min={1}
            max={60}
            value={fps}
            onChange={(event) => setFps(Number(event.target.value) || 12)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Seconds per image
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={secondsPerImage}
            onChange={(event) => setSecondsPerImage(Number(event.target.value) || 0.7)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
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
          onClick={() => void buildVideo()}
          disabled={!orderedFiles.length || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Building..." : "Build video"}
        </button>
      </div>

      {orderedFiles.length ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>{orderedFiles.length} image(s) selected</div>
          {estimatedDuration ? <div>Estimated duration: {estimatedDuration.toFixed(1)}s</div> : null}
        </div>
      ) : null}

      {result ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <div className="text-xs text-white/70">{result.name}</div>
            <div className="text-[11px] text-white/50">
              {formatBytes(result.size)} · {result.duration.toFixed(1)}s · {result.mimeType}
            </div>
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
