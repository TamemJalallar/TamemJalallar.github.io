export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const level = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** level;
  return `${value.toFixed(value >= 10 || level === 0 ? 0 : 1)} ${units[level]}`;
}

export function sanitizeFilename(value: string) {
  return value
    .trim()
    .replace(/\.[^./\\]+$/, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "file";
}

export async function copyToClipboard(value: string) {
  if (!value) return false;
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  try {
    downloadUrl(url, filename);
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 250);
  }
}

export function downloadUrl(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function readFileAsArrayBuffer(file: File) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsArrayBuffer(file);
  });
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

export function loadImageFromFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(src);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("Could not load image."));
    };

    image.src = src;
  });
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not export canvas."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

const scriptCache = new Map<string, Promise<void>>();

export function loadScript(src: string) {
  if (typeof document === "undefined") {
    return Promise.reject(new Error("Scripts can only be loaded in a browser."));
  }

  const cached = scriptCache.get(src);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`) as
      | HTMLScriptElement
      | null;

    if (existing && existing.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script =
      existing ||
      Object.assign(document.createElement("script"), {
        src,
        async: true,
      });

    script.dataset.src = src;

    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    const onLoad = () => {
      script.dataset.loaded = "true";
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      scriptCache.delete(src);
      reject(new Error(`Failed to load script: ${src}`));
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    if (!existing) document.head.appendChild(script);
  });

  scriptCache.set(src, promise);
  return promise;
}
