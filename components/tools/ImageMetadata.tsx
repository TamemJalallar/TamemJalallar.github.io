"use client";

import { useState } from "react";
import { formatBytes, loadImageFromFile, readFileAsArrayBuffer } from "./tool-utils";

const TAGS: Record<number, string> = {
  0x010f: "Make",
  0x0110: "Model",
  0x0112: "Orientation",
  0x010e: "Description",
  0x0132: "DateTime",
  0x8769: "ExifIFDPointer",
  0x9003: "DateTimeOriginal",
  0x829a: "ExposureTime",
  0x829d: "FNumber",
  0x8827: "ISO",
  0x920a: "FocalLength",
  0xa002: "PixelXDimension",
  0xa003: "PixelYDimension",
  0xa405: "FocalLength35mm",
  0xa434: "LensModel",
};

function getString(view: DataView, start: number, length: number) {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    const code = view.getUint8(start + i);
    if (code === 0) break;
    out += String.fromCharCode(code);
  }
  return out;
}

function parseExif(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  if (view.getUint16(0) !== 0xffd8) return null;

  let offset = 2;
  const length = view.byteLength;

  while (offset < length) {
    if (view.getUint8(offset) !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = view.getUint16(offset);
    offset += 2;

    const size = view.getUint16(offset);
    if (marker === 0xffe1) {
      const exifStart = offset + 2;
      const exifHeader = getString(view, exifStart, 4);
      if (exifHeader !== "Exif") return null;

      const tiffOffset = exifStart + 6;
      const endian = view.getUint16(tiffOffset) === 0x4949;

      const getUint16 = (ptr: number) => view.getUint16(ptr, endian);
      const getUint32 = (ptr: number) => view.getUint32(ptr, endian);

      if (getUint16(tiffOffset + 2) !== 0x002a) return null;

      const ifdOffset = getUint32(tiffOffset + 4);

      const readIfd = (offsetFromTiff: number) => {
        const entries = getUint16(tiffOffset + offsetFromTiff);
        const tags: Record<string, any> = {};

        for (let i = 0; i < entries; i += 1) {
          const entryOffset = tiffOffset + offsetFromTiff + 2 + i * 12;
          const tag = getUint16(entryOffset);
          const type = getUint16(entryOffset + 2);
          const count = getUint32(entryOffset + 4);
          const valueOffset = entryOffset + 8;

          const typeSizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8 };
          const valueSize = (typeSizes[type] || 0) * count;

          const dataOffset =
            valueSize <= 4 ? valueOffset : tiffOffset + getUint32(valueOffset);

          let value: any = null;

          if (type === 2) {
            value = getString(view, dataOffset, count);
          } else if (type === 3) {
            value = count === 1 ? getUint16(dataOffset) : null;
          } else if (type === 4) {
            value = count === 1 ? getUint32(dataOffset) : null;
          } else if (type === 5) {
            const numerator = getUint32(dataOffset);
            const denominator = getUint32(dataOffset + 4);
            value = denominator ? numerator / denominator : numerator;
          }

          const label = TAGS[tag] || `Tag 0x${tag.toString(16)}`;
          if (value !== null && value !== undefined && value !== "") {
            tags[label] = value;
          }

          if (tag === 0x8769) {
            tags.ExifIFDPointer = getUint32(valueOffset);
          }
        }

        return tags;
      };

      const ifd0 = readIfd(ifdOffset);
      const exifTags: Record<string, any> = { ...ifd0 };

      if (ifd0.ExifIFDPointer) {
        const exifIfd = readIfd(ifd0.ExifIFDPointer);
        Object.assign(exifTags, exifIfd);
        delete exifTags.ExifIFDPointer;
      }

      return exifTags;
    }

    offset += size;
  }

  return null;
}

export default function ImageMetadata() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState("");

  async function handleFile(nextFile: File | null) {
    setFile(nextFile);
    setMetadata(null);
    setDimensions(null);
    setError("");

    if (!nextFile) return;

    try {
      const image = await loadImageFromFile(nextFile);
      setDimensions({ width: image.width, height: image.height });

      const buffer = await readFileAsArrayBuffer(nextFile);
      const exif = parseExif(buffer);
      setMetadata(exif);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to read metadata.");
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Image Metadata Viewer</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Reads image info and basic EXIF metadata (JPEG only).
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={(event) => void handleFile(event.target.files?.[0] || null)}
        className="mt-4 block w-full text-xs"
      />

      {file ? (
        <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
          <div>Name: {file.name}</div>
          <div>Type: {file.type || "unknown"}</div>
          <div>Size: {formatBytes(file.size)}</div>
          {dimensions ? (
            <div>
              Dimensions: {dimensions.width} × {dimensions.height}
            </div>
          ) : null}
        </div>
      ) : null}

      {metadata ? (
        <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
          <div className="text-xs text-black/60 dark:text-white/60">EXIF</div>
          <div className="mt-2 grid gap-2">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <span className="text-black/60 dark:text-white/60">{key}</span>
                <span className="font-mono text-sm">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : file ? (
        <p className="mt-3 text-xs text-black/60 dark:text-white/60">No EXIF metadata found.</p>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
