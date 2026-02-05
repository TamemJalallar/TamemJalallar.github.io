"use client";

import { useState } from "react";
import { downloadBlob, loadScript, readFileAsArrayBuffer, sanitizeFilename } from "./tool-utils";

const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

declare global {
  interface Window {
    PDFLib?: any;
  }
}

type FieldType = "text" | "checkbox" | "dropdown" | "optionlist" | "radio" | "unsupported";

type FormField = {
  name: string;
  type: FieldType;
  value: string | boolean;
  options?: string[];
};

export default function PdfFormFiller() {
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [flatten, setFlatten] = useState(false);

  async function loadFields(next: File | null) {
    setFile(next);
    setFields([]);
    setError("");

    if (!next) return;

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(next);
      const doc = await window.PDFLib.PDFDocument.load(bytes);
      const form = doc.getForm();
      const nextFields: FormField[] = [];

      for (const field of form.getFields()) {
        const name = field.getName();
        const typeName = field.constructor?.name ?? "";

        if (typeName === "PDFTextField") {
          nextFields.push({
            name,
            type: "text",
            value: field.getText?.() ?? "",
          });
        } else if (typeName === "PDFCheckBox") {
          nextFields.push({
            name,
            type: "checkbox",
            value: field.isChecked?.() ?? false,
          });
        } else if (typeName === "PDFDropdown") {
          const options = field.getOptions?.() ?? [];
          nextFields.push({
            name,
            type: "dropdown",
            value: field.getSelected?.()[0] ?? "",
            options,
          });
        } else if (typeName === "PDFOptionList") {
          const options = field.getOptions?.() ?? [];
          nextFields.push({
            name,
            type: "optionlist",
            value: field.getSelected?.()[0] ?? "",
            options,
          });
        } else if (typeName === "PDFRadioGroup") {
          const options = field.getOptions?.() ?? [];
          nextFields.push({
            name,
            type: "radio",
            value: field.getSelected?.() ?? "",
            options,
          });
        } else {
          nextFields.push({
            name,
            type: "unsupported",
            value: "",
          });
        }
      }

      setFields(nextFields);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to read form fields.");
    }
  }

  function updateField(index: number, value: string | boolean) {
    setFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], value };
      return next;
    });
  }

  async function save() {
    if (!file) return;
    setProcessing(true);
    setError("");

    try {
      await loadScript(PDF_LIB_URL);
      if (!window.PDFLib) throw new Error("PDF engine did not load.");

      const bytes = await readFileAsArrayBuffer(file);
      const doc = await window.PDFLib.PDFDocument.load(bytes);
      const form = doc.getForm();

      fields.forEach((fieldDef) => {
        const field = form.getFieldMaybe?.(fieldDef.name) ?? form.getField(fieldDef.name);
        if (!field) return;

        if (fieldDef.type === "text") {
          field.setText?.(String(fieldDef.value ?? ""));
        } else if (fieldDef.type === "checkbox") {
          if (fieldDef.value) {
            field.check?.();
          } else {
            field.uncheck?.();
          }
        } else if (
          fieldDef.type === "dropdown" ||
          fieldDef.type === "optionlist" ||
          fieldDef.type === "radio"
        ) {
          const value = String(fieldDef.value ?? "");
          if (value) field.select?.(value);
        }
      });

      const font = await doc.embedFont(window.PDFLib.StandardFonts.Helvetica);
      form.updateFieldAppearances(font);
      if (flatten) form.flatten();

      const outBytes = await doc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      downloadBlob(blob, `${sanitizeFilename(file.name)}-filled.pdf`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Failed to fill PDF form.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">PDF Form Filler</h2>
      <p className="mt-1 text-xs text-black/60 dark:text-white/60">
        Fill text fields and common controls, then export a new PDF.
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={(event) => void loadFields(event.target.files?.[0] || null)}
        className="mt-4 block w-full text-xs"
      />

      {fields.length ? (
        <div className="mt-4 space-y-3">
          {fields.map((field, idx) => (
            <div key={`${field.name}-${idx}`} className="rounded-xl border border-gray-200/80 bg-white/80 p-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
              <div className="text-xs text-black/60 dark:text-white/60">{field.name}</div>
              {field.type === "text" ? (
                <input
                  value={String(field.value ?? "")}
                  onChange={(event) => updateField(idx, event.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
                />
              ) : null}
              {field.type === "checkbox" ? (
                <label className="mt-2 inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
                  <input
                    type="checkbox"
                    checked={Boolean(field.value)}
                    onChange={(event) => updateField(idx, event.target.checked)}
                  />
                  Checked
                </label>
              ) : null}
              {field.type === "dropdown" || field.type === "optionlist" || field.type === "radio" ? (
                <select
                  value={String(field.value ?? "")}
                  onChange={(event) => updateField(idx, event.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
                >
                  <option value="">Select...</option>
                  {(field.options ?? []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : null}
              {field.type === "unsupported" ? (
                <p className="mt-2 text-xs text-black/50 dark:text-white/50">
                  Unsupported field type.
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-black/60 dark:text-white/60">
          Upload a PDF with form fields to edit.
        </p>
      )}

      <label className="mt-4 inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
        <input
          type="checkbox"
          checked={flatten}
          onChange={(event) => setFlatten(event.target.checked)}
        />
        Flatten form (make fields non-editable)
      </label>

      <button
        type="button"
        onClick={() => void save()}
        disabled={!file || processing || fields.length === 0}
        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {processing ? "Saving..." : "Fill & Download"}
      </button>

      {error ? <p className="mt-3 text-xs text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
