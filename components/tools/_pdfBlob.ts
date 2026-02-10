"use client";

export function pdfBytesToBlob(bytes: Uint8Array | ArrayBuffer | ArrayBufferLike) {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const safeBytes = new Uint8Array(array.length);
  safeBytes.set(array);
  return new Blob([safeBytes.buffer], { type: "application/pdf" });
}
