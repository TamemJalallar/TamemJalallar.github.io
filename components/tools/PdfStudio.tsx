"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "./_ToolShell";
import MergePdfs from "./MergePdfs";
import SplitPdfs from "./SplitPdfs";
import CompressPdfs from "./CompressPdfs";
import ReorderPdfPages from "./ReorderPdfPages";
import RotatePdf from "./RotatePdf";
import RemovePdfPages from "./RemovePdfPages";
import ExtractPdfPages from "./ExtractPdfPages";
import PdfSplitByBookmarks from "./PdfSplitByBookmarks";
import PdfSplitByBlankPages from "./PdfSplitByBlankPages";
import PdfToImages from "./PdfToImages";
import PdfToJpg from "./PdfToJpg";
import PdfToText from "./PdfToText";
import PdfToHtml from "./PdfToHtml";
import ImagesToPdf from "./ImagesToPdf";
import PdfWatermark from "./PdfWatermark";
import PdfWatermarkDesigner from "./PdfWatermarkDesigner";
import PdfPageNumbers from "./PdfPageNumbers";
import PdfAnnotator from "./PdfAnnotator";
import PdfFormFiller from "./PdfFormFiller";
import PdfGrayscale from "./PdfGrayscale";
import PdfPageCropper from "./PdfPageCropper";
import PdfPageSizeConverter from "./PdfPageSizeConverter";
import PdfMetadataEditor from "./PdfMetadataEditor";
import PdfFileSizeAnalyzer from "./PdfFileSizeAnalyzer";
import PdfPageExtractor from "./PdfPageExtractor";
import ProtectPdf from "./ProtectPdf";
import UnlockPdf from "./UnlockPdf";
import PdfRedactor from "./PdfRedactor";
import PdfRedactByColor from "./PdfRedactByColor";
import SignPdf from "./SignPdf";
import PdfThumbnailer from "./PdfThumbnailer";
import PdfThumbnailZip from "./PdfThumbnailZip";

type StudioItem = {
  id: string;
  label: string;
  description: string;
  slug: string;
  render: () => JSX.Element;
};

type StudioSection = {
  title: string;
  items: StudioItem[];
};

const SECTIONS: StudioSection[] = [
  {
    title: "Organize",
    items: [
      {
        id: "merge",
        label: "Merge PDFs",
        description: "Combine multiple PDFs into one.",
        slug: "merge-pdfs",
        render: () => <MergePdfs />,
      },
      {
        id: "split",
        label: "Split PDFs",
        description: "Split a PDF into separate pages.",
        slug: "split-pdfs",
        render: () => <SplitPdfs />,
      },
      {
        id: "reorder",
        label: "Reorder PDF Pages",
        description: "Reorder pages with a custom list.",
        slug: "reorder-pdf-pages",
        render: () => <ReorderPdfPages />,
      },
      {
        id: "rotate",
        label: "Rotate PDF",
        description: "Rotate pages 90/180/270 degrees.",
        slug: "rotate-pdf",
        render: () => <RotatePdf />,
      },
      {
        id: "remove-pages",
        label: "Remove PDF Pages",
        description: "Remove selected pages from a PDF.",
        slug: "remove-pdf-pages",
        render: () => <RemovePdfPages />,
      },
      {
        id: "extract-pages",
        label: "Extract PDF Pages",
        description: "Extract pages into a new PDF.",
        slug: "extract-pdf-pages",
        render: () => <ExtractPdfPages />,
      },
      {
        id: "split-bookmarks",
        label: "Split by Bookmarks",
        description: "Split using the PDF outline.",
        slug: "pdf-split-bookmarks",
        render: () => <PdfSplitByBookmarks />,
      },
      {
        id: "split-blank",
        label: "Smart Split (Blank Pages)",
        description: "Auto-split using blank pages.",
        slug: "pdf-split-blank",
        render: () => <PdfSplitByBlankPages />,
      },
    ],
  },
  {
    title: "Convert",
    items: [
      {
        id: "pdf-to-images",
        label: "PDF to Images",
        description: "Convert each page to PNG.",
        slug: "pdf-to-images",
        render: () => <PdfToImages />,
      },
      {
        id: "pdf-to-jpg",
        label: "PDF to JPG",
        description: "Convert each page to JPG.",
        slug: "pdf-to-jpg",
        render: () => <PdfToJpg />,
      },
      {
        id: "pdf-to-text",
        label: "PDF to Text",
        description: "Extract text from a PDF.",
        slug: "pdf-to-text",
        render: () => <PdfToText />,
      },
      {
        id: "pdf-to-html",
        label: "PDF to HTML",
        description: "Extract PDF text into basic HTML.",
        slug: "pdf-to-html",
        render: () => <PdfToHtml />,
      },
      {
        id: "images-to-pdf",
        label: "Images to PDF",
        description: "Convert images into a PDF.",
        slug: "images-to-pdf",
        render: () => <ImagesToPdf />,
      },
    ],
  },
  {
    title: "Edit",
    items: [
      {
        id: "watermark",
        label: "PDF Watermark",
        description: "Add a text watermark to pages.",
        slug: "pdf-watermark",
        render: () => <PdfWatermark />,
      },
      {
        id: "watermark-designer",
        label: "Watermark Designer",
        description: "Drag and design watermarks.",
        slug: "pdf-watermark-designer",
        render: () => <PdfWatermarkDesigner />,
      },
      {
        id: "page-numbers",
        label: "PDF Page Numbers",
        description: "Add page numbers to pages.",
        slug: "pdf-page-numbers",
        render: () => <PdfPageNumbers />,
      },
      {
        id: "annotator",
        label: "PDF Annotator",
        description: "Add a note overlay to a page.",
        slug: "pdf-annotator",
        render: () => <PdfAnnotator />,
      },
      {
        id: "form-filler",
        label: "PDF Form Filler",
        description: "Fill PDF form fields locally.",
        slug: "pdf-form-filler",
        render: () => <PdfFormFiller />,
      },
    ],
  },
  {
    title: "Optimize & Analyze",
    items: [
      {
        id: "compress",
        label: "Compress PDFs",
        description: "Reduce file size locally.",
        slug: "compress-pdfs",
        render: () => <CompressPdfs />,
      },
      {
        id: "grayscale",
        label: "PDF Grayscale",
        description: "Flatten pages to grayscale.",
        slug: "pdf-grayscale",
        render: () => <PdfGrayscale />,
      },
      {
        id: "page-cropper",
        label: "PDF Crop & Margins",
        description: "Trim page margins or crop.",
        slug: "pdf-page-cropper",
        render: () => <PdfPageCropper />,
      },
      {
        id: "page-size",
        label: "PDF Page Size Converter",
        description: "Convert pages to A4/Letter.",
        slug: "pdf-page-size",
        render: () => <PdfPageSizeConverter />,
      },
      {
        id: "metadata",
        label: "PDF Metadata Editor",
        description: "Edit title/author/keywords.",
        slug: "pdf-metadata-editor",
        render: () => <PdfMetadataEditor />,
      },
      {
        id: "file-analyzer",
        label: "PDF File Size Analyzer",
        description: "Inspect page sizes and images.",
        slug: "pdf-file-analyzer",
        render: () => <PdfFileSizeAnalyzer />,
      },
      {
        id: "page-extractor",
        label: "PDF Page Extractor",
        description: "Extract a page as PDF/PNG/JPG.",
        slug: "pdf-page-extractor",
        render: () => <PdfPageExtractor />,
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        id: "protect",
        label: "Protect PDF",
        description: "Password protect a PDF.",
        slug: "protect-pdf",
        render: () => <ProtectPdf />,
      },
      {
        id: "unlock",
        label: "Unlock PDF",
        description: "Remove password protection.",
        slug: "unlock-pdf",
        render: () => <UnlockPdf />,
      },
      {
        id: "redactor",
        label: "PDF Redactor",
        description: "Cover content with redactions.",
        slug: "pdf-redactor",
        render: () => <PdfRedactor />,
      },
      {
        id: "redact-color",
        label: "Redact by Color",
        description: "Redact areas by color match.",
        slug: "pdf-redact-by-color",
        render: () => <PdfRedactByColor />,
      },
      {
        id: "sign",
        label: "Sign PDF",
        description: "Add a visual signature.",
        slug: "sign-pdf",
        render: () => <SignPdf />,
      },
    ],
  },
  {
    title: "Extras",
    items: [
      {
        id: "thumbnailer",
        label: "PDF Thumbnailer",
        description: "Generate page thumbnails.",
        slug: "pdf-thumbnailer",
        render: () => <PdfThumbnailer />,
      },
      {
        id: "thumbnail-zip",
        label: "PDF Thumbnails ZIP",
        description: "Download thumbnails as a ZIP.",
        slug: "pdf-thumbnail-zip",
        render: () => <PdfThumbnailZip />,
      },
    ],
  },
];

export default function PdfStudio() {
  const allItems = useMemo(() => SECTIONS.flatMap((section) => section.items), []);
  const [activeId, setActiveId] = useState(allItems[0]?.id ?? "");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SECTIONS.map((section) => [section.title, false])),
  );
  const active =
    allItems.find((item) => item.id === activeId) ?? (allItems[0] ?? null);

  return (
    <ToolShell
      title="PDF Studio"
      description="All PDF tools in one workspace. Pick a task and run it locally."
    >
      <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  setCollapsed((prev) => ({
                    ...prev,
                    [section.title]: !prev[section.title],
                  }))
                }
                className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/20 hover:bg-white/10"
              >
                <span>{section.title}</span>
                <span className="text-sm">
                  {collapsed[section.title] ? "▸" : "▾"}
                </span>
              </button>
              {!collapsed[section.title] ? (
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const isActive = item.id === active?.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        aria-pressed={isActive}
                        className={[
                          "w-full rounded-xl border px-3 py-2 text-left transition",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60",
                          isActive
                            ? "border-white/30 bg-white/10 text-white"
                            : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10",
                        ].join(" ")}
                      >
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className="text-xs text-white/60">
                          {item.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="min-w-0 space-y-4">
          {active ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">{active.label}</div>
                  <div className="text-xs text-white/60">{active.description}</div>
                </div>
                <Link
                  href={`/tools/${active.slug}`}
                  className="text-xs font-semibold text-sky-300 hover:text-sky-200"
                >
                  Open full page
                </Link>
              </div>
              {active.render()}
            </>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              Select a PDF task to begin.
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
