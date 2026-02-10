"use client";

import type { ReactNode } from "react";
import { TOOL_META, type ToolMeta } from "./tools.data";
import ComingSoon from "@/components/tools/ComingSoon";

// import your implemented tools
import ImageResizer from "@/components/tools/ImageResizer";
import BackgroundRemover from "@/components/tools/BackgroundRemover";
import ImageColorPicker from "@/components/tools/ImageColorPicker";
import OcrPro from "@/components/tools/OcrPro";
import ImageCompressor from "@/components/tools/ImageCompressor";
import JpgToPng from "@/components/tools/JpgToPng";
import PngToJpg from "@/components/tools/PngToJpg";
import FaviconGenerator from "@/components/tools/FaviconGenerator";
import SvgOptimizer from "@/components/tools/SvgOptimizer";
import IconPackPreviewer from "@/components/tools/IconPackPreviewer";
import ImageMetadata from "@/components/tools/ImageMetadata";
import ImageFormatConverter from "@/components/tools/ImageFormatConverter";
import LogoBackgroundTester from "@/components/tools/LogoBackgroundTester";
import BrandMockupGenerator from "@/components/tools/BrandMockupGenerator";
import VideoStoryboard from "@/components/tools/VideoStoryboard";
import VideoToImages from "@/components/tools/VideoToImages";
import ImagesToVideo from "@/components/tools/ImagesToVideo";
import VideoTrimmer from "@/components/tools/VideoTrimmer";
import VideoSpeedChanger from "@/components/tools/VideoSpeedChanger";
import VideoSubtitleBurner from "@/components/tools/VideoSubtitleBurner";
import VideoColorLutPreview from "@/components/tools/VideoColorLutPreview";
import VideoThumbnailer from "@/components/tools/VideoThumbnailer";
import VideoAudioExtractor from "@/components/tools/VideoAudioExtractor";
import VideoToGif from "@/components/tools/VideoToGif";
import VideoToMp4 from "@/components/tools/VideoToMp4";
import ImagesToGif from "@/components/tools/ImagesToGif";
import GifOptimizer from "@/components/tools/GifOptimizer";
import SpriteSheetBuilder from "@/components/tools/SpriteSheetBuilder";
import OcrReader from "@/components/tools/OcrReader";
import ImageStudio from "@/components/tools/ImageStudio";
import VideoStudio from "@/components/tools/VideoStudio";

import PdfStudio from "@/components/tools/PdfStudio";
import MergePdfs from "@/components/tools/MergePdfs";
import SplitPdfs from "@/components/tools/SplitPdfs";
import CompressPdfs from "@/components/tools/CompressPdfs";
import PdfToImages from "@/components/tools/PdfToImages";
import PdfToJpg from "@/components/tools/PdfToJpg";
import PdfPageExtractor from "@/components/tools/PdfPageExtractor";
import PdfFileSizeAnalyzer from "@/components/tools/PdfFileSizeAnalyzer";
import PdfThumbnailer from "@/components/tools/PdfThumbnailer";
import PdfThumbnailZip from "@/components/tools/PdfThumbnailZip";
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
import PdfWatermarkDesigner from "@/components/tools/PdfWatermarkDesigner";
import PdfPageNumbers from "@/components/tools/PdfPageNumbers";
import PdfMetadataEditor from "@/components/tools/PdfMetadataEditor";
import PdfAnnotator from "@/components/tools/PdfAnnotator";
import ProtectPdf from "@/components/tools/ProtectPdf";
import UnlockPdf from "@/components/tools/UnlockPdf";
import PdfRedactor from "@/components/tools/PdfRedactor";
import PdfRedactByColor from "@/components/tools/PdfRedactByColor";
import SignPdf from "@/components/tools/SignPdf";
import PdfSplitByBookmarks from "@/components/tools/PdfSplitByBookmarks";
import PdfSplitByBlankPages from "@/components/tools/PdfSplitByBlankPages";

import Base64EncoderDecoder from "@/components/tools/Base64EncoderDecoder";
import JwtDecoder from "@/components/tools/JwtDecoder";
import RegexTester from "@/components/tools/RegexTester";
import HashGenerator from "@/components/tools/HashGenerator";
import CronGenerator from "@/components/tools/CronGenerator";
import UrlEncoderDecoder from "@/components/tools/UrlEncoderDecoder";
import JsonFormatter from "@/components/tools/JsonFormatter";
import JsonDiffPatchViewer from "@/components/tools/JsonDiffPatchViewer";
import UuidUlidGenerator from "@/components/tools/UuidUlidGenerator";
import HmacSigner from "@/components/tools/HmacSigner";
import EnvVarValidator from "@/components/tools/EnvVarValidator";
import ApiRequestBuilder from "@/components/tools/ApiRequestBuilder";
import DevStudio from "@/components/tools/DevStudio";

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
import TextStudio from "@/components/tools/TextStudio";

import ColorPicker from "@/components/tools/ColorPicker";
import ContrastChecker from "@/components/tools/ContrastChecker";
import ColorPaletteGenerator from "@/components/tools/ColorPaletteGenerator";
import GradientBuilder from "@/components/tools/GradientBuilder";
import ColorHarmonyGenerator from "@/components/tools/ColorHarmonyGenerator";
import GradientGalleryGenerator from "@/components/tools/GradientGalleryGenerator";
import BrandColorTokensGenerator from "@/components/tools/BrandColorTokensGenerator";
import TypeScaleBuilder from "@/components/tools/TypeScaleBuilder";
import ColorStudio from "@/components/tools/ColorStudio";

import UnitConverter from "@/components/tools/UnitConverter";
import AudioWaveformGenerator from "@/components/tools/AudioWaveformGenerator";
import WaveformPresetExporter from "@/components/tools/WaveformPresetExporter";
import AudioNormalizer from "@/components/tools/AudioNormalizer";
import VoiceCleaner from "@/components/tools/VoiceCleaner";
import AudioSegmenter from "@/components/tools/AudioSegmenter";
import AudioToWav from "@/components/tools/AudioToWav";
import AudioToOgg from "@/components/tools/AudioToOgg";
import AudioToMp3 from "@/components/tools/AudioToMp3";
import MediaMetadataViewer from "@/components/tools/MediaMetadataViewer";
import UrlQueryBuilder from "@/components/tools/UrlQueryBuilder";
import BaseNumberConverter from "@/components/tools/BaseNumberConverter";
import JsonTableViewer from "@/components/tools/JsonTableViewer";
import AudioStudio from "@/components/tools/AudioStudio";
import DiceRoller from "@/components/tools/DiceRoller";
import RandomNameGenerator from "@/components/tools/RandomNameGenerator";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import MarkdownToHtml from "@/components/tools/MarkdownToHtml";
import HtmlToMarkdown from "@/components/tools/HtmlToMarkdown";
import CsvToJson from "@/components/tools/CsvToJson";
import CsvProfiler from "@/components/tools/CsvProfiler";
import JsonToCsv from "@/components/tools/JsonToCsv";
import YamlJson from "@/components/tools/YamlJson";
import XmlJson from "@/components/tools/XmlJson";
import DataStudio from "@/components/tools/DataStudio";
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
  "background-remover": <BackgroundRemover />,
  "image-color-picker": <ImageColorPicker />,
  "ocr-pro": <OcrPro />,
  "image-compressor": <ImageCompressor />,
  "jpg-to-png": <JpgToPng />,
  "png-to-jpg": <PngToJpg />,
  "favicon-generator": <FaviconGenerator />,
  "svg-optimizer": <SvgOptimizer />,
  "icon-pack-previewer": <IconPackPreviewer />,
  "image-metadata": <ImageMetadata />,
  "image-format-converter": <ImageFormatConverter />,
  "image-studio": <ImageStudio />,
  "video-studio": <VideoStudio />,
  "logo-background-tester": <LogoBackgroundTester />,
  "brand-mockup-generator": <BrandMockupGenerator />,
  "video-storyboard": <VideoStoryboard />,
  "video-to-images": <VideoToImages />,
  "images-to-video": <ImagesToVideo />,
  "video-trimmer": <VideoTrimmer />,
  "video-speed-changer": <VideoSpeedChanger />,
  "video-subtitle-burner": <VideoSubtitleBurner />,
  "video-color-lut": <VideoColorLutPreview />,
  "video-thumbnailer": <VideoThumbnailer />,
  "video-audio-extractor": <VideoAudioExtractor />,
  "video-to-gif": <VideoToGif />,
  "video-to-mp4": <VideoToMp4 />,
  "images-to-gif": <ImagesToGif />,
  "gif-optimizer": <GifOptimizer />,
  "sprite-sheet-builder": <SpriteSheetBuilder />,
  "ocr-reader": <OcrReader />,

  "pdf-studio": <PdfStudio />,
  "merge-pdfs": <MergePdfs />,
  "split-pdfs": <SplitPdfs />,
  "compress-pdfs": <CompressPdfs />,
  "pdf-to-images": <PdfToImages />,
  "pdf-to-jpg": <PdfToJpg />,
  "pdf-page-extractor": <PdfPageExtractor />,
  "pdf-file-analyzer": <PdfFileSizeAnalyzer />,
  "pdf-thumbnailer": <PdfThumbnailer />,
  "pdf-thumbnail-zip": <PdfThumbnailZip />,
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
  "pdf-watermark-designer": <PdfWatermarkDesigner />,
  "pdf-page-numbers": <PdfPageNumbers />,
  "pdf-metadata-editor": <PdfMetadataEditor />,
  "pdf-annotator": <PdfAnnotator />,
  "protect-pdf": <ProtectPdf />,
  "unlock-pdf": <UnlockPdf />,
  "pdf-redactor": <PdfRedactor />,
  "pdf-redact-by-color": <PdfRedactByColor />,
  "sign-pdf": <SignPdf />,
  "pdf-split-bookmarks": <PdfSplitByBookmarks />,
  "pdf-split-blank": <PdfSplitByBlankPages />,

  "base64": <Base64EncoderDecoder />,
  "jwt-decoder": <JwtDecoder />,
  "regex-tester": <RegexTester />,
  "hash-generator": <HashGenerator />,
  "cron-generator": <CronGenerator />,
  "url-encoder": <UrlEncoderDecoder />,
  "json-formatter": <JsonFormatter />,
  "json-diff-patch": <JsonDiffPatchViewer />,
  "uuid-ulid-generator": <UuidUlidGenerator />,
  "hmac-signer": <HmacSigner />,
  "env-var-validator": <EnvVarValidator />,
  "api-request-builder": <ApiRequestBuilder />,
  "dev-studio": <DevStudio />,

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
  "text-studio": <TextStudio />,

  "color-picker": <ColorPicker />,
  "contrast-checker": <ContrastChecker />,
  "color-palette-generator": <ColorPaletteGenerator />,
  "gradient-builder": <GradientBuilder />,
  "color-harmony-generator": <ColorHarmonyGenerator />,
  "gradient-gallery": <GradientGalleryGenerator />,
  "brand-color-tokens": <BrandColorTokensGenerator />,
  "type-scale-builder": <TypeScaleBuilder />,
  "color-studio": <ColorStudio />,

  "unit-converter": <UnitConverter />,
  "audio-waveform-generator": <AudioWaveformGenerator />,
  "waveform-preset-exporter": <WaveformPresetExporter />,
  "audio-normalizer": <AudioNormalizer />,
  "voice-cleaner": <VoiceCleaner />,
  "audio-segmenter": <AudioSegmenter />,
  "audio-to-wav": <AudioToWav />,
  "audio-to-ogg": <AudioToOgg />,
  "audio-to-mp3": <AudioToMp3 />,
  "media-metadata": <MediaMetadataViewer />,
  "url-query-builder": <UrlQueryBuilder />,
  "base-number-converter": <BaseNumberConverter />,
  "json-table-viewer": <JsonTableViewer />,
  "audio-studio": <AudioStudio />,

  "password-generator": <PasswordGenerator />,
  "markdown-to-html": <MarkdownToHtml />,
  "html-to-markdown": <HtmlToMarkdown />,
  "csv-to-json": <CsvToJson />,
  "csv-profiler": <CsvProfiler />,
  "json-to-csv": <JsonToCsv />,
  "yaml-json": <YamlJson />,
  "xml-json": <XmlJson />,
  "data-studio": <DataStudio />,
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
