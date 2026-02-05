"use client";

import { useEffect, useRef, useState } from "react";
import { loadImageFromFile, loadScript } from "./tool-utils";

const JSQR_URL = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";

declare global {
  interface Window {
    jsQR?: (
      data: Uint8ClampedArray,
      width: number,
      height: number,
    ) => { data: string } | null;
  }
}

export default function QrCodeScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafId = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef(false);

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [fileResult, setFileResult] = useState("");

  useEffect(() => {
    return () => stop();
  }, []);

  async function start() {
    setError("");
    setResult("");
    setFileResult("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is not available in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setScanning(true);
      scanningRef.current = true;
      scanLoop();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to access camera.");
    }
  }

  function stop() {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    scanningRef.current = false;
    setScanning(false);
  }

  async function scanLoop() {
    if (!videoRef.current || !canvasRef.current) return;
    if (!("BarcodeDetector" in window)) {
      setError("BarcodeDetector is not available. Use the file upload scanner below.");
      stop();
      return;
    }

    const detector = new (window as typeof window & { BarcodeDetector?: any }).BarcodeDetector({
      formats: ["qr_code"],
    });

    const scan = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      if (!scanningRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const results = await detector.detect(canvas);
        if (results && results.length > 0) {
          const text = results[0].rawValue || "";
          setResult(text);
          stop();
          return;
        }
      } catch {
        // ignore frame errors
      }

      rafId.current = requestAnimationFrame(scan);
    };

    rafId.current = requestAnimationFrame(scan);
  }

  async function scanFile(file: File | null) {
    if (!file) return;
    setError("");
    setFileResult("");

    try {
      await loadScript(JSQR_URL);
      if (!window.jsQR) throw new Error("QR decoder failed to load.");

      const image = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not available.");
      ctx.drawImage(image, 0, 0);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = window.jsQR(data.data, canvas.width, canvas.height);

      if (code?.data) {
        setFileResult(code.data);
      } else {
        setFileResult("No QR code found in the image.");
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to scan QR code.");
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">QR Code Scanner</h2>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void start()}
          disabled={scanning}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Start camera scan
        </button>
        <button
          type="button"
          onClick={stop}
          disabled={!scanning}
          className="rounded-lg border border-gray-300/80 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:hover:bg-white/10"
        >
          Stop
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200/80 bg-white/80 p-3 dark:border-white/10 dark:bg-grey-900/70">
          <video ref={videoRef} className="h-48 w-full rounded-lg bg-black" />
          <canvas ref={canvasRef} className="hidden" />
          <p className="mt-2 text-xs text-black/60 dark:text-white/60">
            Camera scanning uses the BarcodeDetector API (supported in most modern browsers).
          </p>
        </div>

        <div className="rounded-xl border border-gray-200/80 bg-white/80 p-3 dark:border-white/10 dark:bg-grey-900/70">
          <label className="text-xs text-black/60 dark:text-white/60">Scan from image file</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => void scanFile(event.target.files?.[0] || null)}
            className="mt-2 block w-full text-xs"
          />

          {fileResult ? <p className="mt-3 break-words text-sm">{fileResult}</p> : null}
        </div>
      </div>

      {result ? (
        <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-3 py-2 text-sm dark:border-white/10 dark:bg-grey-900/70">
          {result}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
