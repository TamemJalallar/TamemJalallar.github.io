"use client";

import { useEffect, useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";
import { getFfmpeg, toUint8Array } from "./_ffmpeg";

type Result = {
  name: string;
  blob: Blob;
  size: number;
  duration: number;
  format: "mp4" | "webm";
};

export default function VideoTrimmer() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{
    mp4: Result | null;
    webm: Result | null;
    mp4Url: string | null;
    webmUrl: string | null;
  }>({
    mp4: null,
    webm: null,
    mp4Url: null,
    webmUrl: null,
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (results.mp4Url) URL.revokeObjectURL(results.mp4Url);
      if (results.webmUrl) URL.revokeObjectURL(results.webmUrl);
    };
  }, [results.mp4Url, results.webmUrl]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(Boolean(media.matches));
    update();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  const loadFile = (nextFile: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFile(nextFile);
    if (results.mp4Url) URL.revokeObjectURL(results.mp4Url);
    if (results.webmUrl) URL.revokeObjectURL(results.webmUrl);
    setResults({ mp4: null, webm: null, mp4Url: null, webmUrl: null });
    setError("");
    setDuration(0);
    setStart(0);
    setEnd(0);

    if (nextFile) {
      const url = URL.createObjectURL(nextFile);
      setPreviewUrl(url);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextDuration = Number.isFinite(video.duration) ? video.duration : 0;
    setDuration(nextDuration);
    setStart(0);
    setEnd(nextDuration);
  };

  const trim = async () => {
    if (!file) return;

    setBusy(true);
    setError("");
    if (results.mp4Url) URL.revokeObjectURL(results.mp4Url);
    if (results.webmUrl) URL.revokeObjectURL(results.webmUrl);
    setResults({ mp4: null, webm: null, mp4Url: null, webmUrl: null });

    try {
      const ffmpeg = await getFfmpeg();
      const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const ext = file.name.split(".").pop() || "mp4";
      const inputName = `input-${stamp}.${ext}`;
      const outputNameMp4 = `output-${stamp}.mp4`;
      const outputNameWebm = `output-${stamp}.webm`;

      await ffmpeg.writeFile(inputName, await toUint8Array(file));

      const safeStart = Math.max(0, Math.min(start, duration));
      const safeEnd = Math.max(safeStart, Math.min(end, duration || safeStart));

      await ffmpeg.exec([
        "-ss",
        safeStart.toFixed(2),
        "-to",
        safeEnd.toFixed(2),
        "-i",
        inputName,
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "24",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        outputNameMp4,
      ]);

      const mp4Data = await ffmpeg.readFile(outputNameMp4);
      const mp4Blob = new Blob([mp4Data], { type: "video/mp4" });
      const mp4Name = `${sanitizeFilename(file.name)}-trimmed.mp4`;
      const trimmedDuration = Math.max(0, safeEnd - safeStart);

      let webmResult: Result | null = null;
      try {
        await ffmpeg.exec([
          "-ss",
          safeStart.toFixed(2),
          "-to",
          safeEnd.toFixed(2),
          "-i",
          inputName,
          "-c:v",
          "libvpx-vp9",
          "-b:v",
          "0",
          "-crf",
          "32",
          "-c:a",
          "libopus",
          "-b:a",
          "96k",
          outputNameWebm,
        ]);
        const webmData = await ffmpeg.readFile(outputNameWebm);
        const webmBlob = new Blob([webmData], { type: "video/webm" });
        webmResult = {
          name: `${sanitizeFilename(file.name)}-trimmed.webm`,
          blob: webmBlob,
          size: webmBlob.size,
          duration: trimmedDuration,
          format: "webm",
        };
      } catch {
        try {
          await ffmpeg.exec([
            "-ss",
            safeStart.toFixed(2),
            "-to",
            safeEnd.toFixed(2),
            "-i",
            inputName,
            "-c:v",
            "libvpx",
            "-crf",
            "10",
            "-b:v",
            "1M",
            "-c:a",
            "libvorbis",
            outputNameWebm,
          ]);
          const webmData = await ffmpeg.readFile(outputNameWebm);
          const webmBlob = new Blob([webmData], { type: "video/webm" });
          webmResult = {
            name: `${sanitizeFilename(file.name)}-trimmed.webm`,
            blob: webmBlob,
            size: webmBlob.size,
            duration: trimmedDuration,
            format: "webm",
          };
        } catch (webmError) {
          console.warn("WebM export failed", webmError);
        }
      }

      if (!webmResult) {
        setError("MP4 ready. WebM export failed in this browser.");
      }

      const mp4Url = URL.createObjectURL(mp4Blob);
      const webmUrl = webmResult ? URL.createObjectURL(webmResult.blob) : null;
      setResults({
        mp4: {
          name: mp4Name,
          blob: mp4Blob,
          size: mp4Blob.size,
          duration: trimmedDuration,
          format: "mp4",
        },
        webm: webmResult,
        mp4Url,
        webmUrl,
      });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputNameMp4);
      if (webmResult) {
        await ffmpeg.deleteFile(outputNameWebm);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to trim video.");
    } finally {
      setBusy(false);
    }
  };

  const mp4Result = results.mp4;
  const webmResult = results.webm;
  const mp4Url = results.mp4Url;
  const webmUrl = results.webmUrl;

  return (
    <ToolShell
      title="Video Trimmer"
      description="Trim a video clip and export MP4 + WebM locally (first run downloads codecs)."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="video/*"
          onChange={(event) => loadFile(event.target.files?.[0] ?? null)}
          className="block text-sm"
        />

        <button
          type="button"
          onClick={() => void trim()}
          disabled={!file || busy || duration <= 0 || end <= start}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Trimming..." : "Trim"}
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
          {duration > 0 ? <div>Duration: {duration.toFixed(2)}s</div> : null}
        </div>
      ) : null}

      {previewUrl ? (
        <div className="mt-4">
          <video
            ref={videoRef}
            src={previewUrl}
            controls
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full rounded-xl border border-white/10"
          />

          {duration > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="text-sm text-white/70">
                Start
                <input
                  type="number"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={start}
                  onChange={(event) => setStart(Number(event.target.value) || 0)}
                  className="ml-2 w-24 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
                />
              </label>
              <label className="text-sm text-white/70">
                End
                <input
                  type="number"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={end}
                  onChange={(event) => setEnd(Number(event.target.value) || 0)}
                  className="ml-2 w-24 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
                />
              </label>
            </div>
          ) : null}
        </div>
      ) : null}

      {mp4Result || webmResult ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {mp4Result && mp4Url ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 text-xs text-white/60">MP4 Preview</div>
              <video
                src={mp4Url}
                controls
                autoPlay={!prefersReducedMotion}
                muted
                loop
                playsInline
                className="w-full rounded-lg border border-white/10"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-white/50">
                  {formatBytes(mp4Result.size)} · {mp4Result.duration.toFixed(2)}s
                </div>
                <button
                  type="button"
                  onClick={() => downloadBlob(mp4Result.blob, mp4Result.name)}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                >
                  Download MP4
                </button>
              </div>
            </div>
          ) : null}

          {webmResult && webmUrl ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 text-xs text-white/60">WebM Preview</div>
              <video
                src={webmUrl}
                controls
                autoPlay={!prefersReducedMotion}
                muted
                loop
                playsInline
                className="w-full rounded-lg border border-white/10"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-white/50">
                  {formatBytes(webmResult.size)} · {webmResult.duration.toFixed(2)}s
                </div>
                <button
                  type="button"
                  onClick={() => downloadBlob(webmResult.blob, webmResult.name)}
                  className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                >
                  Download WebM
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
