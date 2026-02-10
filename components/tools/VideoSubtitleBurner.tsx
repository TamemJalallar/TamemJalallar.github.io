"use client";

import { useEffect, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";
import { fileDataToBlob, getFfmpeg, toUint8Array } from "./_ffmpeg";

type Result = {
  name: string;
  blob: Blob;
  url: string;
  size: number;
};

export default function VideoSubtitleBurner() {
  const [file, setFile] = useState<File | null>(null);
  const [srtText, setSrtText] = useState("");
  const [fontSize, setFontSize] = useState(28);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result?.url]);

  const handleSrtFile = async (file: File | null) => {
    if (!file) return;
    const text = await file.text();
    setSrtText(text);
  };

  const burn = async () => {
    if (!file || !srtText.trim()) return;

    setBusy(true);
    setError("");
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const ext = file.name.split(".").pop() || "mp4";
    const inputName = `input-${stamp}.${ext}`;
    const srtName = `subs-${stamp}.srt`;
    const outputName = `output-${stamp}.mp4`;

    try {
      const ffmpeg = await getFfmpeg();
      await ffmpeg.writeFile(inputName, await toUint8Array(file));
      await ffmpeg.writeFile(srtName, new TextEncoder().encode(srtText));

      const filter = `subtitles=${srtName}:force_style=Fontsize=${fontSize}`;

      await ffmpeg.exec([
        "-i",
        inputName,
        "-vf",
        filter,
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
        name: `${sanitizeFilename(file.name)}-subtitled.mp4`,
        blob,
        url,
        size: blob.size,
      });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(srtName);
      await ffmpeg.deleteFile(outputName);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to burn subtitles.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="Video Subtitle Burner"
      description="Burn SRT subtitles into a video using FFmpeg."
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

        <input
          type="file"
          accept=".srt,text/plain"
          onChange={(event) => void handleSrtFile(event.target.files?.[0] ?? null)}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Font size
          <input
            type="number"
            min={16}
            max={64}
            value={fontSize}
            onChange={(event) => setFontSize(Number(event.target.value) || 28)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <button
          type="button"
          onClick={() => void burn()}
          disabled={!file || !srtText.trim() || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Burning..." : "Burn subtitles"}
        </button>
      </div>

      <textarea
        value={srtText}
        onChange={(event) => setSrtText(event.target.value)}
        placeholder="Paste SRT subtitle text here..."
        className="mt-4 min-h-32 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 outline-none"
      />

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
