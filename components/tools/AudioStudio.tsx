"use client";

import StudioLayout, { type StudioSection } from "./_StudioLayout";
import VoiceCleaner from "./VoiceCleaner";
import AudioNormalizer from "./AudioNormalizer";
import MediaMetadataViewer from "./MediaMetadataViewer";
import AudioSegmenter from "./AudioSegmenter";
import AudioWaveformGenerator from "./AudioWaveformGenerator";
import WaveformPresetExporter from "./WaveformPresetExporter";
import AudioToWav from "./AudioToWav";
import AudioToOgg from "./AudioToOgg";
import AudioToMp3 from "./AudioToMp3";

const SECTIONS: StudioSection[] = [
  {
    title: "Clean & Analyze",
    items: [
      {
        id: "voice-cleaner",
        label: "AI-Free Voice Cleaner",
        description: "Noise gate + EQ presets for speech.",
        slug: "voice-cleaner",
        render: () => <VoiceCleaner />,
      },
      {
        id: "audio-normalizer",
        label: "Audio Normalizer",
        description: "Normalize loudness with LUFS target.",
        slug: "audio-normalizer",
        render: () => <AudioNormalizer />,
      },
      {
        id: "media-metadata",
        label: "Media Metadata Viewer",
        description: "Inspect audio/video metadata locally.",
        slug: "media-metadata",
        render: () => <MediaMetadataViewer />,
      },
    ],
  },
  {
    title: "Edit",
    items: [
      {
        id: "audio-segmenter",
        label: "Audio Segmenter",
        description: "Split audio on silence into clips.",
        slug: "audio-segmenter",
        render: () => <AudioSegmenter />,
      },
    ],
  },
  {
    title: "Visualize",
    items: [
      {
        id: "audio-waveform-generator",
        label: "Audio Waveform Generator",
        description: "Generate a waveform image from audio.",
        slug: "audio-waveform-generator",
        render: () => <AudioWaveformGenerator />,
      },
      {
        id: "waveform-preset-exporter",
        label: "Waveform Preset Exporter",
        description: "Export waveform presets.",
        slug: "waveform-preset-exporter",
        render: () => <WaveformPresetExporter />,
      },
    ],
  },
  {
    title: "Convert",
    items: [
      {
        id: "audio-to-wav",
        label: "Audio to WAV",
        description: "Convert audio or video files into WAV.",
        slug: "audio-to-wav",
        render: () => <AudioToWav />,
      },
      {
        id: "audio-to-ogg",
        label: "Audio to OGG",
        description: "Re-encode media to Opus (OGG/WebM).",
        slug: "audio-to-ogg",
        render: () => <AudioToOgg />,
      },
      {
        id: "audio-to-mp3",
        label: "Audio to MP3",
        description: "Convert media files into MP3 audio.",
        slug: "audio-to-mp3",
        render: () => <AudioToMp3 />,
      },
    ],
  },
];

export default function AudioStudio() {
  return (
    <StudioLayout
      title="Audio Studio"
      description="Clean, analyze, and convert audio files locally."
      sections={SECTIONS}
    />
  );
}
