"use client";

import { useEffect, useState } from "react";
import ToolShell from "./_ToolShell";
import { canvasToBlob, downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";

type SheetResult = {
  blob: Blob;
  url: string;
  name: string;
};

function seekTo(video: HTMLVideoElement, time: number) {
  return new Promise<void>((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Failed to seek video."));
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.currentTime = Math.min(Math.max(time, 0), Number(video.duration) || 0);
  });
}

export default function VideoThumbnailer() {
  const [file, setFile] = useState<File | null>(null);
  const [interval, setInterval] = useState(5);
  const [columns, setColumns] = useState(4);
  const [maxFrames, setMaxFrames] = useState(24);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SheetResult | null>(null);
  const [metadata, setMetadata] = useState<{ duration: number; width: number; height: number } | null>(null);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result?.url]);

  const generate = async () => {
    if (!file) return;

    setBusy(true);
    setError("");
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.preload = "auto";
    video.playsInline = true;

    try {
      await new Promise<void>((resolve, reject) => {
        const onLoaded = () => resolve();
        const onError = () => reject(new Error("Failed to load video."));
        video.addEventListener("loadedmetadata", onLoaded, { once: true });
        video.addEventListener("error", onError, { once: true });
      });

      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      setMetadata({ duration, width, height });

      const step = Math.max(1, interval);
      const frames: number[] = [];
      for (let t = 0; t <= duration && frames.length < maxFrames; t += step) {
        frames.push(t);
      }
      if (!frames.length) frames.push(0);

      const cols = Math.max(1, columns);
      const rows = Math.ceil(frames.length / cols);
      const thumbWidth = 240;
      const thumbHeight = Math.round((height / width) * thumbWidth);

      const canvas = document.createElement("canvas");
      canvas.width = cols * thumbWidth;
      canvas.height = rows * thumbHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported.");

      ctx.fillStyle = "#0b0b12";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < frames.length; i += 1) {
        const time = frames[i] ?? 0;
        await seekTo(video, time);
        const x = (i % cols) * thumbWidth;
        const y = Math.floor(i / cols) * thumbHeight;
        ctx.drawImage(video, x, y, thumbWidth, thumbHeight);
      }

      const blob = await canvasToBlob(canvas, "image/jpeg", 0.9);
      const sheetUrl = URL.createObjectURL(blob);
      setResult({
        blob,
        url: sheetUrl,
        name: `${sanitizeFilename(file.name)}-thumbnails.jpg`,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to create thumbnails.");
    } finally {
      URL.revokeObjectURL(url);
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Video Thumbnailer"
      description="Generate a contact sheet of thumbnails from a video file."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="video/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            if (result?.url) URL.revokeObjectURL(result.url);
            setResult(null);
            setError("");
            setMetadata(null);
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Interval (sec)
          <input
            type="number"
            min={1}
            value={interval}
            onChange={(event) => setInterval(Number(event.target.value) || 5)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Columns
          <input
            type="number"
            min={1}
            max={8}
            value={columns}
            onChange={(event) => setColumns(Number(event.target.value) || 4)}
            className="ml-2 w-16 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Max frames
          <input
            type="number"
            min={4}
            max={60}
            value={maxFrames}
            onChange={(event) => setMaxFrames(Number(event.target.value) || 24)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <button
          type="button"
          onClick={() => void generate()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Generating..." : "Generate"}
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
          {metadata ? (
            <div>
              Video: {metadata.width} × {metadata.height} · {metadata.duration.toFixed(2)}s
            </div>
          ) : null}
        </div>
      ) : null}

      {result ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-white/60">Contact sheet</div>
            <button
              type="button"
              onClick={() => downloadBlob(result.blob, result.name)}
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
            >
              Download
            </button>
          </div>
          <img src={result.url} alt="Contact sheet" className="w-full rounded-lg border border-white/10" />
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
