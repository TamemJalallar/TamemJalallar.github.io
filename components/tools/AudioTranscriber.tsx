"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ToolShell from "./_ToolShell";
import { copyToClipboard, downloadBlob, formatBytes, sanitizeFilename } from "./tool-utils";

type ModelOption = {
  label: string;
  value: string;
};

type AsrChunk = {
  text?: string;
};

type AsrResult = {
  text?: string;
  chunks?: AsrChunk[];
};

type AsrPipeline = (
  audio: Blob,
  options?: {
    chunk_length_s?: number;
    stride_length_s?: number;
    return_timestamps?: boolean;
    task?: "transcribe" | "translate";
  }
) => Promise<string | AsrResult>;

const MODELS: ModelOption[] = [
  { label: "Tiny (fastest)", value: "onnx-community/whisper-tiny.en" },
  { label: "Base (better quality)", value: "onnx-community/whisper-base.en" },
];

const MAX_FILE_SIZE_BYTES = 80 * 1024 * 1024;
const MAX_DURATION_SECONDS = 20 * 60;
const pipelineCache = new Map<string, Promise<AsrPipeline>>();

function formatProgress(update: unknown): string {
  const progress = update as { status?: string; progress?: number; file?: string };

  const status = (progress.status ?? "loading").replace(/_/g, " ");
  const file = progress.file ? ` ${progress.file}` : "";
  const pct =
    typeof progress.progress === "number"
      ? ` (${Math.round(progress.progress * 100)}%)`
      : "";

  return `${status}${file}${pct}`.trim();
}

function resolveText(result: string | AsrResult): string {
  if (typeof result === "string") return result.trim();
  if (typeof result.text === "string") return result.text.trim();

  if (Array.isArray(result.chunks)) {
    return result.chunks
      .map((chunk) => chunk.text ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return "";
}

function resolveError(error: unknown): string {
  const message = error instanceof Error ? error.message : "Transcription failed.";

  if (/failed to fetch|network|load failed/i.test(message)) {
    return "Model download failed. Check your internet connection and retry.";
  }

  if (/memory|out of memory|alloc/i.test(message)) {
    return "Browser memory limit reached. Use a shorter audio clip or the Tiny model.";
  }

  return message;
}

function validateAudioFile(file: File | null): string {
  if (!file) return "";
  if (file.size <= 0) return "File is empty.";
  if (!file.type.startsWith("audio/")) return "Please upload an audio file.";
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File is too large (${formatBytes(file.size)}). Limit is ${formatBytes(MAX_FILE_SIZE_BYTES)}.`;
  }
  return "";
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "Unknown";
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const remaining = total % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

async function probeDuration(file: File): Promise<number | null> {
  if (typeof window === "undefined") return null;

  const objectUrl = URL.createObjectURL(file);
  try {
    return await new Promise<number | null>((resolve) => {
      const audio = document.createElement("audio");
      let settled = false;

      const finish = (value: number | null) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        audio.onloadedmetadata = null;
        audio.onerror = null;
        audio.removeAttribute("src");
        resolve(value);
      };

      const timeoutId = window.setTimeout(() => finish(null), 8000);

      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        const duration =
          Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : null;
        finish(duration);
      };
      audio.onerror = () => finish(null);
      audio.src = objectUrl;
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function getPipeline(
  model: string,
  onStatus: (status: string) => void
): Promise<AsrPipeline> {
  if (!pipelineCache.has(model)) {
    const promise = (async () => {
      const { pipeline, env } = await import("@huggingface/transformers");

      env.allowLocalModels = false;
      env.useBrowserCache = true;

      const transcriber = await pipeline("automatic-speech-recognition", model, {
        progress_callback: (update: unknown) => {
          onStatus(formatProgress(update));
        },
      });

      return transcriber as unknown as AsrPipeline;
    })();

    pipelineCache.set(model, promise);
  }

  try {
    const cached = pipelineCache.get(model);
    if (!cached) {
      throw new Error("Unable to initialize transcription pipeline.");
    }

    return await cached;
  } catch (error) {
    pipelineCache.delete(model);
    throw error;
  }
}

export default function AudioTranscriber() {
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<string>(MODELS[0].value);
  const [inputKey, setInputKey] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("Idle");
  const [error, setError] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const runIdRef = useRef(0);
  const mountedRef = useRef(true);

  const fileLabel = useMemo(() => {
    if (!file) return "No file selected";
    return `${file.name} (${formatBytes(file.size)})`;
  }, [file]);

  const validationError = useMemo(() => validateAudioFile(file), [file]);
  const isDurationTooLong =
    durationSeconds !== null && durationSeconds > MAX_DURATION_SECONDS;
  const durationHint =
    durationSeconds === null ? "Detecting..." : formatDuration(durationSeconds);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      runIdRef.current += 1;
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    let active = true;

    if (!file) {
      setDurationSeconds(null);
      return () => {
        active = false;
      };
    }

    setDurationSeconds(null);
    void probeDuration(file)
      .then((seconds) => {
        if (active) setDurationSeconds(seconds);
      })
      .catch(() => {
        if (active) setDurationSeconds(null);
      });

    return () => {
      active = false;
    };
  }, [file]);

  const isRunActive = (runId: number) =>
    mountedRef.current && runIdRef.current === runId;

  const startRun = () => {
    const nextRunId = runIdRef.current + 1;
    runIdRef.current = nextRunId;
    return nextRunId;
  };

  const runTranscription = async () => {
    if (!file || validationError || isDurationTooLong) return;

    const runId = startRun();
    setBusy(true);
    setTranscript("");
    setCopied(false);
    setError("");
    setStatus("Loading model...");

    try {
      const transcriber = await getPipeline(model, (nextStatus) => {
        if (isRunActive(runId)) setStatus(nextStatus);
      });

      if (!isRunActive(runId)) return;

      setStatus("Transcribing...");

      const result = await transcriber(file, {
        task: "transcribe",
        chunk_length_s: 24,
        stride_length_s: 5,
        return_timestamps: false,
      });

      if (!isRunActive(runId)) return;

      const text = resolveText(result);
      setTranscript(text || "No speech text was detected.");
      setStatus("Done");
    } catch (error) {
      if (!isRunActive(runId)) return;
      setError(resolveError(error));
      setStatus("Error");
    } finally {
      if (isRunActive(runId)) {
        setBusy(false);
      }
    }
  };

  const preloadModel = async () => {
    const runId = startRun();
    setBusy(true);
    setError("");
    setStatus("Loading model...");

    try {
      await getPipeline(model, (nextStatus) => {
        if (isRunActive(runId)) setStatus(nextStatus);
      });

      if (!isRunActive(runId)) return;
      setStatus("Model ready");
    } catch (error) {
      if (!isRunActive(runId)) return;
      setError(resolveError(error));
      setStatus("Error");
    } finally {
      if (isRunActive(runId)) {
        setBusy(false);
      }
    }
  };

  const cancelProcessing = () => {
    if (!busy) return;
    runIdRef.current += 1;
    setBusy(false);
    setStatus("Cancelled");
  };

  const clearAll = () => {
    runIdRef.current += 1;
    setBusy(false);
    setFile(null);
    setDurationSeconds(null);
    setStatus("Idle");
    setError("");
    setTranscript("");
    setCopied(false);
    setInputKey((value) => value + 1);
  };

  const copyTranscript = async () => {
    if (!transcript) return;

    const ok = await copyToClipboard(transcript);
    if (ok) {
      setCopied(true);
      setStatus("Transcript copied");
      return;
    }

    setStatus("Clipboard write failed");
  };

  const downloadTranscript = () => {
    if (!transcript) return;

    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const fileName = `${sanitizeFilename(file?.name || "transcript")}.txt`;
    downloadBlob(blob, fileName);
    setStatus("Transcript downloaded");
  };

  return (
    <ToolShell
      title="AI Audio Transcriber (Hugging Face)"
      description="Runs Whisper in-browser. Includes model warm-up, file checks, and safer run controls."
    >
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-slate-700 dark:text-white/80">
            Model
            <select
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/15 dark:bg-black/20 dark:text-white"
            >
              {MODELS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-slate-700 dark:text-white/80">
            Audio File
            <input
              key={inputKey}
              type="file"
              accept="audio/*"
              onChange={(event) => {
                const selected = event.target.files?.[0] ?? null;

                runIdRef.current += 1;
                setBusy(false);
                setFile(selected);
                setTranscript("");
                setCopied(false);
                setError("");

                if (!selected) {
                  setStatus("Idle");
                  return;
                }

                const fileError = validateAudioFile(selected);
                if (fileError) {
                  setStatus("Validation failed");
                  return;
                }

                setStatus("Ready");
              }}
              className="mt-1 block w-full cursor-pointer rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-sky-500 file:px-3 file:py-1.5 file:text-white dark:border-white/15 dark:bg-black/20 dark:text-white"
            />
          </label>
        </div>

        <div className="rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/70">
          <div>{fileLabel}</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-white/60">
            Duration: {durationHint}
            {isDurationTooLong ? ` (limit ${formatDuration(MAX_DURATION_SECONDS)})` : ""}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void preloadModel()}
            disabled={busy}
            className="rounded-lg border border-black/10 bg-black/5 px-4 py-2 text-sm text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/5 dark:text-white"
            data-analytics="audio_transcriber_preload"
          >
            Load Model
          </button>

          <button
            type="button"
            onClick={runTranscription}
            disabled={!file || busy || !!validationError || isDurationTooLong}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            data-analytics="audio_transcriber_run"
          >
            {busy ? "Processing..." : "Transcribe"}
          </button>

          {busy ? (
            <button
              type="button"
              onClick={cancelProcessing}
              className="rounded-lg border border-red-300/30 bg-red-400/10 px-4 py-2 text-sm text-red-100"
            >
              Cancel
            </button>
          ) : null}

          <button
            type="button"
            onClick={copyTranscript}
            disabled={!transcript || busy}
            className="rounded-lg border border-black/10 bg-black/5 px-4 py-2 text-sm text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/5 dark:text-white"
          >
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            type="button"
            onClick={downloadTranscript}
            disabled={!transcript || busy}
            className="rounded-lg border border-black/10 bg-black/5 px-4 py-2 text-sm text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/5 dark:text-white"
          >
            Download TXT
          </button>

          <button
            type="button"
            onClick={clearAll}
            disabled={busy && !file}
            className="rounded-lg border border-black/10 bg-black/5 px-4 py-2 text-sm text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:bg-white/5 dark:text-white"
          >
            Clear
          </button>
        </div>

        <div className="rounded-lg border border-black/10 bg-white/80 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-black/20 dark:text-white/65">
          Status: {status}
        </div>

        {validationError ? (
          <div className="rounded-lg border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
            {validationError}
          </div>
        ) : null}

        {isDurationTooLong ? (
          <div className="rounded-lg border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
            This clip is longer than {formatDuration(MAX_DURATION_SECONDS)}. Trim it for a more stable browser run.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          placeholder="Transcribed text will appear here..."
          className="min-h-[220px] w-full rounded-xl border border-black/10 bg-white p-3 text-sm text-slate-900 outline-none dark:border-white/15 dark:bg-black/20 dark:text-white"
        />
      </div>
    </ToolShell>
  );
}
