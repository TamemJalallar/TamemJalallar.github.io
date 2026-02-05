"use client";

import { useState } from "react";
import { canvasToBlob, downloadBlob, loadImageFromFile } from "./tool-utils";

type Frame = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function SpriteSheetBuilder() {
  const [files, setFiles] = useState<File[]>([]);
  const [columns, setColumns] = useState(4);
  const [padding, setPadding] = useState(4);
  const [scaleToFit, setScaleToFit] = useState(true);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function build() {
    if (!files.length) return;
    setProcessing(true);
    setError("");
    setResultUrl(null);
    setFrames([]);

    try {
      const images = await Promise.all(files.map((file) => loadImageFromFile(file)));
      const cellWidth = Math.max(...images.map((img) => img.width));
      const cellHeight = Math.max(...images.map((img) => img.height));
      const cols = Math.max(1, columns);
      const rows = Math.ceil(images.length / cols);

      const canvas = document.createElement("canvas");
      canvas.width = cols * cellWidth + padding * (cols - 1);
      canvas.height = rows * cellHeight + padding * (rows - 1);

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported.");

      const nextFrames: Frame[] = [];

      images.forEach((img, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = col * (cellWidth + padding);
        const y = row * (cellHeight + padding);

        const scale = scaleToFit
          ? Math.min(cellWidth / img.width, cellHeight / img.height, 1)
          : 1;
        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        const offsetX = x + (cellWidth - drawWidth) / 2;
        const offsetY = y + (cellHeight - drawHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        nextFrames.push({
          name: files[index]?.name ?? `frame-${index + 1}`,
          x,
          y,
          width: cellWidth,
          height: cellHeight,
        });
      });

      const blob = await canvasToBlob(canvas, "image/png");
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setFrames(nextFrames);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to build sprite sheet.");
    } finally {
      setProcessing(false);
    }
  }

  function downloadPng() {
    if (!resultUrl) return;
    fetch(resultUrl)
      .then((res) => res.blob())
      .then((blob) => downloadBlob(blob, "sprite-sheet.png"))
      .catch(() => setError("Failed to download sprite sheet."));
  }

  function downloadJson() {
    if (!frames.length) return;
    const json = JSON.stringify({ frames }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    downloadBlob(blob, "sprite-sheet.json");
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Sprite Sheet Builder</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Combine images into a grid-based sprite sheet.
      </p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          setFiles(Array.from(event.target.files ?? []));
          setResultUrl(null);
          setFrames([]);
          setError("");
        }}
        className="mt-4 block w-full text-xs"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <label>
          Columns
          <input
            type="number"
            min={1}
            max={20}
            value={columns}
            onChange={(event) => setColumns(Math.max(1, Number(event.target.value) || 1))}
            className="ml-2 w-20 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label>
          Padding
          <input
            type="number"
            min={0}
            max={50}
            value={padding}
            onChange={(event) => setPadding(Math.max(0, Number(event.target.value) || 0))}
            className="ml-2 w-20 rounded-lg border border-gray-300/70 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-grey-900"
          />
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={scaleToFit}
            onChange={(event) => setScaleToFit(event.target.checked)}
          />
          Scale to fit cell
        </label>
        <button
          type="button"
          onClick={() => void build()}
          disabled={!files.length || processing}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {processing ? "Building..." : "Build Sheet"}
        </button>
      </div>

      {resultUrl ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-gray-200/80 bg-white/80 p-3 dark:border-white/10 dark:bg-grey-900/70">
            <img src={resultUrl} alt="sprite sheet" className="w-full rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadPng}
              className="rounded-lg border border-gray-300/80 px-3 py-1 text-xs hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
            >
              Download PNG
            </button>
            <button
              type="button"
              onClick={downloadJson}
              className="rounded-lg border border-gray-300/80 px-3 py-1 text-xs hover:bg-gray-100 dark:border-white/20 dark:hover:bg-white/10"
            >
              Download JSON
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
