"use client";

import { useEffect, useState } from "react";
import ToolShell from "./_ToolShell";
import { downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";
import { getFfmpeg, toUint8Array } from "./_ffmpeg";

type Result = {
  name: string;
  blob: Blob;
  size: number;
  url: string;
};

const WIDTH_PRESETS = [0, 240, 360, 480, 640, 800];

export default function GifOptimizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState<"high" | "balanced" | "small">("balanced");
  const [fps, setFps] = useState(12);
  const [width, setWidth] = useState(480);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<"side" | "toggle">("side");
  const [showOptimized, setShowOptimized] = useState(true);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [originalUrl, result?.url]);

  const resetResult = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
  };

  const applyPreset = (value: "high" | "balanced" | "small") => {
    setPreset(value);
    if (value === "high") {
      setFps(15);
      setWidth(640);
    } else if (value === "small") {
      setFps(8);
      setWidth(360);
    } else {
      setFps(12);
      setWidth(480);
    }
  };

  const optimize = async () => {
    if (!file) return;

    setBusy(true);
    setError("");
    resetResult();

    const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const inputName = `input-${stamp}.gif`;
    const outputName = `output-${stamp}.gif`;

    try {
      const ffmpeg = await getFfmpeg();
      await ffmpeg.writeFile(inputName, await toUint8Array(file));

      const scale = width > 0 ? `scale=${width}:-1:flags=lanczos` : "scale=iw:-1:flags=lanczos";
      const filter = `fps=${Math.max(1, fps)},${scale},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse=dither=bayer`;

      await ffmpeg.exec([
        "-i",
        inputName,
        "-vf",
        filter,
        "-loop",
        "0",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data], { type: "image/gif" });

      const url = URL.createObjectURL(blob);
      setResult({
        name: `${sanitizeFilename(file.name)}-optimized.gif`,
        blob,
        size: blob.size,
        url,
      });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to optimize GIF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      title="GIF Optimizer"
      description="Reduce GIF size by lowering FPS and scaling down."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/gif"
          onChange={(event) => {
            const nextFile = event.target.files?.[0] ?? null;
            setFile(nextFile);
    resetResult();
    setError("");
            if (originalUrl) URL.revokeObjectURL(originalUrl);
            if (nextFile) {
              setOriginalUrl(URL.createObjectURL(nextFile));
              setOriginalSize(nextFile.size);
              setPreviewMode("side");
              setShowOptimized(true);
            } else {
              setOriginalUrl(null);
              setOriginalSize(null);
            }
          }}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Quality
          <select
            value={preset}
            onChange={(event) => applyPreset(event.target.value as "high" | "balanced" | "small")}
            className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          >
            <option value="high">High</option>
            <option value="balanced">Balanced</option>
            <option value="small">Smaller</option>
          </select>
        </label>

        <label className="text-sm text-white/70">
          FPS
          <input
            type="number"
            min={1}
            max={30}
            value={fps}
            onChange={(event) => setFps(Number(event.target.value) || 12)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>

        <label className="text-sm text-white/70">
          Width
          <select
            value={width}
          onChange={(event) => setWidth(Number(event.target.value) || 0)}
          className="ml-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
        >
            {WIDTH_PRESETS.map((value) => (
              <option key={value} value={value}>
                {value === 0 ? "Original" : `${value}px`}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => void optimize()}
          disabled={!file || busy}
          className="rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-40"
        >
          {busy ? "Optimizing..." : "Optimize"}
        </button>
      </div>

      {file ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
          <div>Name: {file.name}</div>
          <div>Size: {formatBytes(file.size)}</div>
        </div>
      ) : null}

      {originalUrl && result ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span>Preview:</span>
            <button
              type="button"
              onClick={() => setPreviewMode("side")}
              className={`rounded-full px-3 py-1 ${
                previewMode === "side"
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Side-by-side
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("toggle")}
              className={`rounded-full px-3 py-1 ${
                previewMode === "toggle"
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Before/After
            </button>
          </div>

          {previewMode === "side" ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 text-xs text-white/60">Original</div>
                <img
                  src={originalUrl}
                  alt="Original GIF"
                  className="w-full rounded-lg border border-white/10"
                />
                {originalSize ? (
                  <div className="mt-2 text-[11px] text-white/50">
                    {formatBytes(originalSize)}
                  </div>
                ) : null}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 text-xs text-white/60">Optimized</div>
                <img
                  src={result.url}
                  alt="Optimized GIF"
                  className="w-full rounded-lg border border-white/10"
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-white/50">
                    {formatBytes(result.size)}
                    {originalSize && originalSize > 0 ? (
                      <span className="ml-2 text-emerald-300">
                        {Math.max(
                          0,
                          Math.round(((originalSize - result.size) / originalSize) * 100),
                        )}
                        % saved
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadBlob(result.blob, result.name)}
                    className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-white/60">
                <span>{showOptimized ? "After (Optimized)" : "Before (Original)"}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOptimized(false)}
                    className={`rounded-full px-3 py-1 ${
                      !showOptimized
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    Before
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOptimized(true)}
                    className={`rounded-full px-3 py-1 ${
                      showOptimized
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    After
                  </button>
                </div>
              </div>
              <img
                src={showOptimized ? result.url : originalUrl}
                alt={showOptimized ? "Optimized GIF" : "Original GIF"}
                className="w-full rounded-lg border border-white/10"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-white/50">
                  {showOptimized && result ? formatBytes(result.size) : null}
                  {!showOptimized && originalSize ? formatBytes(originalSize) : null}
                  {showOptimized && originalSize && originalSize > 0 ? (
                    <span className="ml-2 text-emerald-300">
                      {Math.max(
                        0,
                        Math.round(((originalSize - result.size) / originalSize) * 100),
                      )}
                      % saved
                    </span>
                  ) : null}
                </div>
                {showOptimized ? (
                  <button
                    type="button"
                    onClick={() => downloadBlob(result.blob, result.name)}
                    className="rounded-lg bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
                  >
                    Download
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
    </ToolShell>
  );
}
