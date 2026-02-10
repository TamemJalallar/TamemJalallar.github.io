"use client";

import type { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpegPromise: Promise<FFmpeg> | null = null;

export async function getFfmpeg() {
  if (typeof window === "undefined") {
    throw new Error("FFmpeg can only run in the browser.");
  }

  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
        import("@ffmpeg/ffmpeg"),
        import("@ffmpeg/util"),
      ]);

      const ffmpeg = new FFmpeg();
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist";
      const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
      const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm");

      await ffmpeg.load({ coreURL, wasmURL });
      return ffmpeg;
    })();
  }

  return ffmpegPromise;
}

export async function toUint8Array(blob: Blob) {
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

export type FfmpegFileData = string | Uint8Array | ArrayBuffer | ArrayBufferLike;

export function fileDataToUint8Array(data: FfmpegFileData) {
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }
  if (data instanceof Uint8Array) {
    return new Uint8Array(data);
  }
  return new Uint8Array(data as ArrayBufferLike);
}

export function fileDataToBlob(data: FfmpegFileData, mime: string) {
  const bytes = fileDataToUint8Array(data);
  const safeBytes = new Uint8Array(bytes.length);
  safeBytes.set(bytes);
  return new Blob([safeBytes.buffer], { type: mime });
}
