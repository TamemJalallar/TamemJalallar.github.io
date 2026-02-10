"use client";

import { useEffect, useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import {
  canvasToBlob,
  downloadBlob,
  formatBytes,
  sanitizeFilename,
} from "./tool-utils";

const FORMATS = [
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "JPG", value: "image/jpeg", ext: "jpg", lossy: true },
  { label: "WebP", value: "image/webp", ext: "webp" },
];

type FrameResult = {
  name: string;
  blob: Blob;
  size: number;
  time: number;
};

type VideoMeta = {
  duration: number;
  width: number;
  height: number;
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

    try {
      video.currentTime = Math.min(Math.max(time, 0), Number(video.duration) || 0);
    } catch (error) {
      cleanup();
      reject(error instanceof Error ? error : new Error("Failed to seek video."));
    }
  });
}

export default function VideoToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [intervalSec, setIntervalSec] = useState(1);
  const [maxFrames, setMaxFrames] = useState(60);
  const [format, setFormat] = useState(FORMATS[0]?.value ?? "image/png");
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<FrameResult[]>([]);
  const [error, setError] = useState("");

  const frameCountEstimate = useMemo(() => {
    if (!meta?.duration || !Number.isFinite(meta.duration)) return 0;
    const interval = Math.max(0.1, intervalSec || 1);
    const count = Math.ceil(meta.duration / interval);
    return Math.min(count, maxFrames);
  }, [intervalSec, maxFrames, meta?.duration]);

  useEffect(() => {
    if (!file) {
      setMeta(null);
      return;
    }

    let canceled = false;
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;

    const onLoaded = () => {
      if (canceled) return;
      setMeta({
        duration: Number.isFinite(video.duration) ? video.duration : 0,
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
      });
      URL.revokeObjectURL(url);
    };

    const onError = () => {
      if (canceled) return;
      setMeta(null);
      URL.revokeObjectURL(url);
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);

    return () => {
      canceled = true;
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const extractFrames = async () => {
    if (!file) return;
    setBusy(true);
    setResults([]);
    setError("");

    const formatMeta = FORMATS.find((item) => item.value === format) ?? FORMATS[0];
    const interval = Math.max(0.1, Number(intervalSec) || 1);
    const limit = Math.max(1, Math.min(200, Math.floor(maxFrames) || 60));

    let url = "";

    try {
      url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = url;
      video.muted = true;
      video.preload = "auto";
      video.playsInline = true;

      await new Promise<void>((resolve, reject) => {
        const onLoaded = () => resolve();
        const onError = () => reject(new Error("Failed to load video."));
        video.addEventListener("loadedmetadata", onLoaded, { once: true });
        video.addEventListener("error", onError, { once: true });
      });

      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (!duration) throw new Error("Could not read the video duration.");

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1;
      canvas.height = video.videoHeight || 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported.");

      const times: number[] = [];
      for (let t = 0; t < duration && times.length < limit; t += interval) {
        times.push(t);
      }
      if (!times.length) times.push(0);

      const extracted: FrameResult[] = [];

      for (let i = 0; i < times.length; i += 1) {
        const time = times[i] ?? 0;
        await seekTo(video, time);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await canvasToBlob(
          canvas,
          formatMeta.value,
          formatMeta.lossy ? quality : undefined,
        );
        extracted.push({
          name: `${sanitizeFilename(file.name)}-frame-${String(i + 1).padStart(3, "0")}.${formatMeta.ext}`,
          blob,
          size: blob.size,
          time,
        });
      }

      setResults(extracted);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to extract frames.");
    } finally {
      if (url) URL.revokeObjectURL(url);
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Video to Images"
      description="Extract still frames from a video file and download them locally."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="video/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setResults([]);
            setError("");
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Interval (sec)
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={intervalSec}
            onChange={(event) => setIntervalSec(Number(event.target.value) || 1)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Max frames
          <input
            type="number"
            min={1}
            max={200}
            value={maxFrames}
            onChange={(event) => setMaxFrames(Number(event.target.value) || 60)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Format
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {FORMATS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        {FORMATS.find((item) => item.value === format)?.lossy ? (
          <label className="text-sm text-white/70">
            Quality
            <input
              type="number"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(event) =>
                setQuality(Math.max(0.1, Math.min(1, Number(event.target.value) || 0.9)))
              }
              className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
            />
          </label>
        ) : null}

        <button
          type="button"
          onClick={() => void extractFrames()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Extracting..." : "Extract"}
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
          {meta ? (
            <div>
              Video: {meta.width} × {meta.height} · {meta.duration.toFixed(2)}s
            </div>
          ) : null}
          {frameCountEstimate ? <div>Estimated frames: {frameCountEstimate}</div> : null}
        </div>
      ) : null}

      {results.length ? (
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-white/70">{results.length} frame(s)</div>
            <button
              type="button"
              onClick={() => results.forEach((item) => downloadBlob(item.blob, item.name))}
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
            >
              Download all
            </button>
          </div>
          {results.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <div>
                <div className="text-xs text-white/70">{item.name}</div>
                <div className="text-[11px] text-white/50">
                  {formatBytes(item.size)} · {item.time.toFixed(2)}s
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadBlob(item.blob, item.name)}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
