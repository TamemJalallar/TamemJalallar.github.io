"use client";

import type { ReactNode } from "react";
import { TOOL_META, type ToolMeta } from "./tools.data";
import ComingSoon from "@/components/tools/ComingSoon";

// import your implemented tools
import ImageResizer from "@/components/tools/ImageResizer";
import ImageCompressor from "@/components/tools/ImageCompressor";
import JpgToPng from "@/components/tools/JpgToPng";
import PngToJpg from "@/components/tools/PngToJpg";
import FaviconGenerator from "@/components/tools/FaviconGenerator";

import MergePdfs from "@/components/tools/MergePdfs";
import PdfToImages from "@/components/tools/PdfToImages";

import Base64EncoderDecoder from "@/components/tools/Base64EncoderDecoder";
import UrlEncoderDecoder from "@/components/tools/UrlEncoderDecoder";
import JsonFormatter from "@/components/tools/JsonFormatter";

import TextCaseConverter from "@/components/tools/TextCaseConverter";
import WordCharacterCounter from "@/components/tools/WordCharacterCounter";
import FindAndReplace from "@/components/tools/FindAndReplace";
import LoremIpsumGenerator from "@/components/tools/LoremIpsumGenerator";

import ColorPicker from "@/components/tools/ColorPicker";
import ContrastChecker from "@/components/tools/ContrastChecker";

import UnitConverter from "@/components/tools/UnitConverter";

export type ToolDefinition = ToolMeta & { component: ReactNode };

const componentBySlug: Record<string, ReactNode> = {
  "image-resizer": <ImageResizer />,
  "image-compressor": <ImageCompressor />,
  "jpg-to-png": <JpgToPng />,
  "png-to-jpg": <PngToJpg />,
  "favicon-generator": <FaviconGenerator />,

  "merge-pdfs": <MergePdfs />,
  "pdf-to-images": <PdfToImages />,

  "base64": <Base64EncoderDecoder />,
  "url-encoder": <UrlEncoderDecoder />,
  "json-formatter": <JsonFormatter />,

  "text-case-converter": <TextCaseConverter />,
  "word-counter": <WordCharacterCounter />,
  "find-replace": <FindAndReplace />,
  "lorem-ipsum": <LoremIpsumGenerator />,

  "color-picker": <ColorPicker />,
  "contrast-checker": <ContrastChecker />,

  "unit-converter": <UnitConverter />,
};

export const TOOLS: ToolDefinition[] = TOOL_META.map((t) => ({
  ...t,
  component: componentBySlug[t.slug] ?? <ComingSoon name={t.title} />,
}));
