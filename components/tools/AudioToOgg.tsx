"use client";

import { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";

const FORMAT_CANDIDATES = [
  { label: "OGG (Opus)", mimeType: "audio/ogg;codecs=opus", ext: "ogg" },
  { label: "WebM (Opus)", mimeType: "audio/webm;codecs=opus", ext: "webm" },
  { label: "WebM", mimeType: "audio/webm", ext: "webm" },
];

type Result = {
  blob: Blob;
  name: string;
  size: number;
  duration: number;
  mimeType: string;
};

export default function AudioToOgg() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const supportedFormats = useMemo(() => {
    if (typeof MediaRecorder === "undefined") return [];
    return FORMAT_CANDIDATES.filter((format) => MediaRecorder.isTypeSupported(format.mimeType));
  }, []);

  const selectedFormat = supportedFormats[0];

  const convert = async () => {
    if (!file) return;
    if (!selectedFormat) {
      setError("MediaRecorder is not supported in this browser.");
      return;
    }

    setBusy(true);
    setError("");
    setResult(null);
    setProgress(0);

    let audioContext: AudioContext | null = null;
    let mediaUrl = "";

    try {
      mediaUrl = URL.createObjectURL(file);
      const media = document.createElement("video");
      media.src = mediaUrl;
      media.preload = "auto";
      media.muted = true;
      media.playsInline = true;

      await new Promise<void>((resolve, reject) => {
        const onLoaded = () => resolve();
        const onError = () => reject(new Error("Failed to load the media file."));
        media.addEventListener("loadedmetadata", onLoaded, { once: true });
        media.addEventListener("error", onError, { once: true });
      });

      const mediaDuration = Number.isFinite(media.duration) ? media.duration : 0;
      setDuration(mediaDuration);

      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(media);
      const destination = audioContext.createMediaStreamDestination();
      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0;

      source.connect(destination);
      source.connect(silentGain);
      silentGain.connect(audioContext.destination);

      const recorder = new MediaRecorder(destination.stream, {
        mimeType: selectedFormat.mimeType,
      });

      const chunks: BlobPart[] = [];

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size) chunks.push(event.data);
      });

      const recorderStopped = new Promise<void>((resolve) => {
        recorder.addEventListener("stop", () => resolve(), { once: true });
      });

      const onTimeUpdate = () => {
        if (mediaDuration > 0) {
          setProgress(Math.min(1, media.currentTime / mediaDuration));
        }
      };

      media.addEventListener("timeupdate", onTimeUpdate);

      recorder.start();
      await media.play();

      await new Promise<void>((resolve, reject) => {
        const onEnded = () => resolve();
        const onError = () => reject(new Error("Playback stopped unexpectedly."));
        media.addEventListener("ended", onEnded, { once: true });
        media.addEventListener("error", onError, { once: true });
      });

      recorder.stop();
      await recorderStopped;

      media.removeEventListener("timeupdate", onTimeUpdate);

      const blob = new Blob(chunks, { type: selectedFormat.mimeType });
      const name = `${sanitizeFilename(file.name)}.${selectedFormat.ext}`;

      setResult({
        blob,
        name,
        size: blob.size,
        duration: mediaDuration,
        mimeType: selectedFormat.mimeType,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to convert audio.");
    } finally {
      if (audioContext) {
        try {
          await audioContext.close();
        } catch {
          // ignore close errors
        }
      }
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Audio to OGG"
      description="Re-encode audio (or video) to Opus using your browser. Runs in real time."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setResult(null);
            setError("");
            setProgress(0);
          }}
          className="block text-sm"
        />

        <button
          type="button"
          onClick={() => void convert()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Converting..." : "Convert"}
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
          <div>Type: {file.type || "unknown"}</div>
        </div>
      ) : null}

      {busy && duration > 0 ? (
        <div className="mt-4">
          <div className="text-xs text-white/60">
            Converting… {Math.round(progress * 100)}%
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-emerald-400/80"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      ) : null}

      {result ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <div className="text-xs text-white/70">{result.name}</div>
            <div className="text-[11px] text-white/50">
              {formatBytes(result.size)} · {result.duration.toFixed(2)}s · {result.mimeType}
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
