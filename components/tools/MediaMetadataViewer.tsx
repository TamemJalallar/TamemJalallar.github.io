"use client";

import { useEffect, useState } from "react";
import ToolShell from "./_ToolShell";
import { formatBytes } from "./tool-utils";

type MediaMeta = {
  duration: number;
  width: number;
  height: number;
  typeLabel: string;
  bitrateKbps: number | null;
};

export default function MediaMetadataViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<MediaMeta | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setMeta(null);
      setError("");
      return;
    }

    let canceled = false;
    const url = URL.createObjectURL(file);
    const media = document.createElement("video");
    media.preload = "metadata";
    media.src = url;

    const onLoaded = () => {
      if (canceled) return;
      const duration = Number.isFinite(media.duration) ? media.duration : 0;
      const width = media.videoWidth || 0;
      const height = media.videoHeight || 0;
      const typeLabel = width && height ? "Video" : "Audio";
      const bitrateKbps =
        duration > 0 ? Math.round((file.size * 8) / duration / 1000) : null;

      setMeta({
        duration,
        width,
        height,
        typeLabel,
        bitrateKbps,
      });
      URL.revokeObjectURL(url);
    };

    const onError = () => {
      if (canceled) return;
      setError("Unable to read metadata for this file.");
      setMeta(null);
      URL.revokeObjectURL(url);
    };

    media.addEventListener("loadedmetadata", onLoaded, { once: true });
    media.addEventListener("error", onError, { once: true });

    return () => {
      canceled = true;
      media.removeEventListener("loadedmetadata", onLoaded);
      media.removeEventListener("error", onError);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <ToolShell
      title="Media Metadata Viewer"
      description="Inspect audio or video metadata locally (duration, dimensions, bitrate)."
    >
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="block text-sm"
      />

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Type: {file.type || "unknown"}</div>
          <div>Size: {formatBytes(file.size)}</div>
        </div>
      ) : null}

      {meta ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Kind: {meta.typeLabel}</div>
          <div>Duration: {meta.duration.toFixed(2)}s</div>
          {meta.width && meta.height ? (
            <div>
              Dimensions: {meta.width} × {meta.height}
            </div>
          ) : null}
          {meta.bitrateKbps ? <div>Estimated bitrate: {meta.bitrateKbps} kbps</div> : null}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
