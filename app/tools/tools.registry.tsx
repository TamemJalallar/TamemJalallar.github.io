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
import SvgOptimizer from "@/components/tools/SvgOptimizer";
import ImageMetadata from "@/components/tools/ImageMetadata";
import ImageFormatConverter from "@/components/tools/ImageFormatConverter";
import SpriteSheetBuilder from "@/components/tools/SpriteSheetBuilder";
import OcrReader from "@/components/tools/OcrReader";

import MergePdfs from "@/components/tools/MergePdfs";
import SplitPdfs from "@/components/tools/SplitPdfs";
import CompressPdfs from "@/components/tools/CompressPdfs";
import PdfToImages from "@/components/tools/PdfToImages";
import ImagesToPdf from "@/components/tools/ImagesToPdf";
import PdfPageCropper from "@/components/tools/PdfPageCropper";
import PdfPageSizeConverter from "@/components/tools/PdfPageSizeConverter";
import PdfGrayscale from "@/components/tools/PdfGrayscale";
import PdfFormFiller from "@/components/tools/PdfFormFiller";
import SplitPdf from "@/components/tools/SplitPdf";
import CompressPdf from "@/components/tools/CompressPdf";
import RotatePdf from "@/components/tools/RotatePdf";
import ReorderPdfPages from "@/components/tools/ReorderPdfPages";
import RemovePdfPages from "@/components/tools/RemovePdfPages";
import ExtractPdfPages from "@/components/tools/ExtractPdfPages";
import PdfToText from "@/components/tools/PdfToText";
import PdfToHtml from "@/components/tools/PdfToHtml";
import PdfWatermark from "@/components/tools/PdfWatermark";
import PdfPageNumbers from "@/components/tools/PdfPageNumbers";
import PdfMetadataEditor from "@/components/tools/PdfMetadataEditor";
import PdfAnnotator from "@/components/tools/PdfAnnotator";
import ProtectPdf from "@/components/tools/ProtectPdf";
import UnlockPdf from "@/components/tools/UnlockPdf";
import PdfRedactor from "@/components/tools/PdfRedactor";
import SignPdf from "@/components/tools/SignPdf";

import Base64EncoderDecoder from "@/components/tools/Base64EncoderDecoder";
import JwtDecoder from "@/components/tools/JwtDecoder";
import RegexTester from "@/components/tools/RegexTester";
import HashGenerator from "@/components/tools/HashGenerator";
import CronGenerator from "@/components/tools/CronGenerator";
import UrlEncoderDecoder from "@/components/tools/UrlEncoderDecoder";
import JsonFormatter from "@/components/tools/JsonFormatter";
import UuidUlidGenerator from "@/components/tools/UuidUlidGenerator";
import HmacSigner from "@/components/tools/HmacSigner";

import CaseConverter from "@/components/tools/CaseConverter";
import TextCaseConverter from "@/components/tools/TextCaseConverter";
import WordCharacterCounter from "@/components/tools/WordCharacterCounter";
import FindAndReplace from "@/components/tools/FindAndReplace";
import LoremIpsumGenerator from "@/components/tools/LoremIpsumGenerator";
import SlugGenerator from "@/components/tools/SlugGenerator";
import RemoveDuplicateLines from "@/components/tools/RemoveDuplicateLines";
import SortLines from "@/components/tools/SortLines";
import TextStatistics from "@/components/tools/TextStatistics";
import WhitespaceCleaner from "@/components/tools/WhitespaceCleaner";

import ColorPicker from "@/components/tools/ColorPicker";
import ContrastChecker from "@/components/tools/ContrastChecker";
import ColorPaletteGenerator from "@/components/tools/ColorPaletteGenerator";

import UnitConverter from "@/components/tools/UnitConverter";
import UrlQueryBuilder from "@/components/tools/UrlQueryBuilder";
import BaseNumberConverter from "@/components/tools/BaseNumberConverter";
import JsonTableViewer from "@/components/tools/JsonTableViewer";
import DiceRoller from "@/components/tools/DiceRoller";
import RandomNameGenerator from "@/components/tools/RandomNameGenerator";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import MarkdownToHtml from "@/components/tools/MarkdownToHtml";
import HtmlToMarkdown from "@/components/tools/HtmlToMarkdown";
import CsvToJson from "@/components/tools/CsvToJson";
import JsonToCsv from "@/components/tools/JsonToCsv";
import YamlJson from "@/components/tools/YamlJson";
import XmlJson from "@/components/tools/XmlJson";
import QrCodeGenerator from "@/components/tools/QrCodeGenerator";
import QrCodeScanner from "@/components/tools/QrCodeScanner";
import BarcodeGenerator from "@/components/tools/BarcodeGenerator";
import TextDiffChecker from "@/components/tools/TextDiffChecker";
import TimeZoneConverter from "@/components/tools/TimeZoneConverter";
import CountdownTimer from "@/components/tools/CountdownTimer";
import Stopwatch from "@/components/tools/Stopwatch";
import PomodoroTimer from "@/components/tools/PomodoroTimer";
import RandomPicker from "@/components/tools/RandomPicker";
import WheelSpinner from "@/components/tools/WheelSpinner";
import LiDistinctionTester from "@/components/tools/LiDistinctionTester";
import FileCorrupter from "@/components/tools/FileCorrupter";
import AsciiArtGenerator from "@/components/tools/AsciiArtGenerator";
import Magic8Ball from "@/components/tools/Magic8Ball";
import CoinFlip from "@/components/tools/CoinFlip";
import YesNoOracle from "@/components/tools/YesNoOracle";
import RandomNumberGenerator from "@/components/tools/RandomNumberGenerator";
import TruthOrDare from "@/components/tools/TruthOrDare";
import WouldYouRather from "@/components/tools/WouldYouRather";
import NicknameGenerator from "@/components/tools/NicknameGenerator";
import UsernameGenerator from "@/components/tools/UsernameGenerator";
import FunFactGenerator from "@/components/tools/FunFactGenerator";
import EmojiGenerator from "@/components/tools/EmojiGenerator";
import EmojiCombiner from "@/components/tools/EmojiCombiner";
import AsciiFaceGenerator from "@/components/tools/AsciiFaceGenerator";
import ExcuseGenerator from "@/components/tools/ExcuseGenerator";
import ComplimentGenerator from "@/components/tools/ComplimentGenerator";
import StartupNameGenerator from "@/components/tools/StartupNameGenerator";

export type ToolDefinition = ToolMeta & { component: ReactNode };

const componentBySlug: Record<string, ReactNode> = {
  "image-resizer": <ImageResizer />,
  "image-compressor": <ImageCompressor />,
  "jpg-to-png": <JpgToPng />,
  "png-to-jpg": <PngToJpg />,
  "favicon-generator": <FaviconGenerator />,
  "svg-optimizer": <SvgOptimizer />,
  "image-metadata": <ImageMetadata />,
  "image-format-converter": <ImageFormatConverter />,
  "sprite-sheet-builder": <SpriteSheetBuilder />,
  "ocr-reader": <OcrReader />,

  "merge-pdfs": <MergePdfs />,
  "split-pdfs": <SplitPdfs />,
  "compress-pdfs": <CompressPdfs />,
  "pdf-to-images": <PdfToImages />,
  "images-to-pdf": <ImagesToPdf />,
  "pdf-page-cropper": <PdfPageCropper />,
  "pdf-page-size": <PdfPageSizeConverter />,
  "pdf-grayscale": <PdfGrayscale />,
  "pdf-form-filler": <PdfFormFiller />,
  "split-pdf": <SplitPdf />,
  "compress-pdf": <CompressPdf />,
  "rotate-pdf": <RotatePdf />,
  "reorder-pdf-pages": <ReorderPdfPages />,
  "remove-pdf-pages": <RemovePdfPages />,
  "extract-pdf-pages": <ExtractPdfPages />,
  "pdf-to-text": <PdfToText />,
  "pdf-to-html": <PdfToHtml />,
  "pdf-watermark": <PdfWatermark />,
  "pdf-page-numbers": <PdfPageNumbers />,
  "pdf-metadata-editor": <PdfMetadataEditor />,
  "pdf-annotator": <PdfAnnotator />,
  "protect-pdf": <ProtectPdf />,
  "unlock-pdf": <UnlockPdf />,
  "pdf-redactor": <PdfRedactor />,
  "sign-pdf": <SignPdf />,

  "base64": <Base64EncoderDecoder />,
  "jwt-decoder": <JwtDecoder />,
  "regex-tester": <RegexTester />,
  "hash-generator": <HashGenerator />,
  "cron-generator": <CronGenerator />,
  "url-encoder": <UrlEncoderDecoder />,
  "json-formatter": <JsonFormatter />,
  "uuid-ulid-generator": <UuidUlidGenerator />,
  "hmac-signer": <HmacSigner />,

  "case-converter": <CaseConverter />,
  "text-case-converter": <TextCaseConverter />,
  "word-counter": <WordCharacterCounter />,
  "find-replace": <FindAndReplace />,
  "lorem-ipsum": <LoremIpsumGenerator />,
  "slug-generator": <SlugGenerator />,
  "remove-duplicate-lines": <RemoveDuplicateLines />,
  "sort-lines": <SortLines />,
  "text-statistics": <TextStatistics />,
  "whitespace-cleaner": <WhitespaceCleaner />,

  "color-picker": <ColorPicker />,
  "contrast-checker": <ContrastChecker />,
  "color-palette-generator": <ColorPaletteGenerator />,

  "unit-converter": <UnitConverter />,
  "url-query-builder": <UrlQueryBuilder />,
  "base-number-converter": <BaseNumberConverter />,
  "json-table-viewer": <JsonTableViewer />,

  "password-generator": <PasswordGenerator />,
  "markdown-to-html": <MarkdownToHtml />,
  "html-to-markdown": <HtmlToMarkdown />,
  "csv-to-json": <CsvToJson />,
  "json-to-csv": <JsonToCsv />,
  "yaml-json": <YamlJson />,
  "xml-json": <XmlJson />,
  "qr-code-generator": <QrCodeGenerator />,
  "qr-code-scanner": <QrCodeScanner />,
  "barcode-generator": <BarcodeGenerator />,
  "text-diff-checker": <TextDiffChecker />,

  "time-zone-converter": <TimeZoneConverter />,
  "countdown-timer": <CountdownTimer />,
  "stopwatch": <Stopwatch />,
  "pomodoro-timer": <PomodoroTimer />,
  "random-picker": <RandomPicker />,
  "wheel-spinner": <WheelSpinner />,
  "dice-roller": <DiceRoller />,
  "random-name-generator": <RandomNameGenerator />,
  "magic-8-ball": <Magic8Ball />,
  "coin-flip": <CoinFlip />,
  "yes-no-oracle": <YesNoOracle />,
  "random-number-generator": <RandomNumberGenerator />,
  "truth-or-dare": <TruthOrDare />,
  "would-you-rather": <WouldYouRather />,
  "nickname-generator": <NicknameGenerator />,
  "username-generator": <UsernameGenerator />,
  "fun-fact-generator": <FunFactGenerator />,
  "emoji-generator": <EmojiGenerator />,
  "emoji-combiner": <EmojiCombiner />,
  "ascii-face-generator": <AsciiFaceGenerator />,
  "excuse-generator": <ExcuseGenerator />,
  "compliment-generator": <ComplimentGenerator />,
  "startup-name-generator": <StartupNameGenerator />,
  "li-distinction-tester": <LiDistinctionTester />,
  "file-corrupter": <FileCorrupter />,
  "ascii-art-generator": <AsciiArtGenerator />,
};

export const TOOLS: ToolDefinition[] = TOOL_META.map((t) => ({
  ...t,
  component: componentBySlug[t.slug] ?? <ComingSoon name={t.title} />,
}));
