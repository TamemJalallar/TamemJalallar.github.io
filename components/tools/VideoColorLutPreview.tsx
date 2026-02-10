"use client";

import { useEffect, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";
import { fileDataToBlob, getFfmpeg, toUint8Array } from "./_ffmpeg";

type Preset = { id: string; label: string; filter: string };

type Result = {
  name: string;
  blob: Blob;
  url: string;
  size: number;
};

const PRESETS: Preset[] = [
  { id: "cinematic", label: "Cinematic", filter: "eq=contrast=1.15:saturation=1.25:brightness=0.02" },
  { id: "warm", label: "Warm", filter: "colorbalance=rs=0.05:gs=0.02:bs=-0.02" },
  { id: "cool", label: "Cool", filter: "colorbalance=rs=-0.02:gs=0.02:bs=0.06" },
  { id: "punchy", label: "Punchy", filter: "eq=contrast=1.3:saturation=1.4" },
  { id: "soft", label: "Soft", filter: "eq=contrast=0.95:saturation=0.9:brightness=0.03" },
];

export default function VideoColorLutPreview() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState(PRESETS[0]?.id ?? "cinematic");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result?.url]);

  const apply = async () => {
    if (!file) return;

    setBusy(true);
    setError("");
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const ext = file.name.split(".").pop() || "mp4";
    const inputName = `input-${stamp}.${ext}`;
    const outputName = `output-${stamp}.mp4`;

    try {
      const ffmpeg = await getFfmpeg();
      await ffmpeg.writeFile(inputName, await toUint8Array(file));

      const presetConfig = PRESETS.find((p) => p.id === preset) ?? PRESETS[0];
      await ffmpeg.exec([
        "-i",
        inputName,
        "-vf",
        presetConfig.filter,
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "24",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = fileDataToBlob(data, "video/mp4");
      const url = URL.createObjectURL(blob);

      setResult({
        name: `${sanitizeFilename(file.name)}-${presetConfig.id}.mp4`,
        blob,
        url,
        size: blob.size,
      });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to apply LUT.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Video Color LUT Preview"
      description="Apply cinematic color presets using FFmpeg."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="video/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError("");
            if (result?.url) URL.revokeObjectURL(result.url);
            setResult(null);
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Preset
          <select
            value={preset}
            onChange={(event) => setPreset(event.target.value)}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            {PRESETS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => void apply()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Applying..." : "Apply"}
        </button>
      </div>

      {file ? (
        <div className="mt-3 text-xs text-white/60">
          {file.name} · {formatBytes(file.size)}
        </div>
      ) : null}

      {result ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <video src={result.url} controls className="w-full rounded-lg border border-white/10" />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[11px] text-white/50">{formatBytes(result.size)}</div>
            <button
              type="button"
              onClick={() => downloadBlob(result.blob, result.name)}
              className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
            >
              Download
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
