"use client";

import dynamic from "next/dynamic";
import StudioLayout, { type StudioSection } from "./_StudioLayout";
import ToolLoading from "./ToolLoading";
import VideoThumbnailer from "./VideoThumbnailer";
import VideoStoryboard from "./VideoStoryboard";
import VideoToImages from "./VideoToImages";
import ImagesToVideo from "./ImagesToVideo";

const VideoTrimmer = dynamic(() => import("./VideoTrimmer"), {
  ssr: false,
  loading: () => <ToolLoading title="Video Trimmer" />,
});
const VideoSpeedChanger = dynamic(() => import("./VideoSpeedChanger"), {
  ssr: false,
  loading: () => <ToolLoading title="Video Speed Changer" />,
});
const VideoSubtitleBurner = dynamic(() => import("./VideoSubtitleBurner"), {
  ssr: false,
  loading: () => <ToolLoading title="Video Subtitle Burner" />,
});
const VideoColorLutPreview = dynamic(() => import("./VideoColorLutPreview"), {
  ssr: false,
  loading: () => <ToolLoading title="Video Color LUT Preview" />,
});
const VideoAudioExtractor = dynamic(() => import("./VideoAudioExtractor"), {
  ssr: false,
  loading: () => <ToolLoading title="Video Audio Extractor" />,
});
const VideoToMp4 = dynamic(() => import("./VideoToMp4"), {
  ssr: false,
  loading: () => <ToolLoading title="Video to MP4" />,
});
const VideoToGif = dynamic(() => import("./VideoToGif"), {
  ssr: false,
  loading: () => <ToolLoading title="Video to GIF" />,
});

const SECTIONS: StudioSection[] = [
  {
    title: "Edit",
    items: [
      {
        id: "video-trimmer",
        label: "Video Trimmer",
        description: "Trim video clips in your browser.",
        slug: "video-trimmer",
        render: () => <VideoTrimmer />,
      },
      {
        id: "video-speed-changer",
        label: "Video Speed Changer",
        description: "Change playback speed with FFmpeg.",
        slug: "video-speed-changer",
        render: () => <VideoSpeedChanger />,
      },
      {
        id: "video-subtitle-burner",
        label: "Video Subtitle Burner",
        description: "Burn SRT subtitles into a video.",
        slug: "video-subtitle-burner",
        render: () => <VideoSubtitleBurner />,
      },
      {
        id: "video-color-lut",
        label: "Video Color LUT Preview",
        description: "Apply cinematic color presets.",
        slug: "video-color-lut",
        render: () => <VideoColorLutPreview />,
      },
    ],
  },
  {
    title: "Extract",
    items: [
      {
        id: "video-thumbnailer",
        label: "Video Thumbnailer",
        description: "Create a video contact sheet.",
        slug: "video-thumbnailer",
        render: () => <VideoThumbnailer />,
      },
      {
        id: "video-storyboard",
        label: "Video Storyboard",
        description: "Create a timestamped storyboard grid.",
        slug: "video-storyboard",
        render: () => <VideoStoryboard />,
      },
      {
        id: "video-to-images",
        label: "Video to Images",
        description: "Extract video frames into images.",
        slug: "video-to-images",
        render: () => <VideoToImages />,
      },
      {
        id: "video-audio-extractor",
        label: "Video Audio Extractor",
        description: "Extract audio from a video.",
        slug: "video-audio-extractor",
        render: () => <VideoAudioExtractor />,
      },
    ],
  },
  {
    title: "Convert",
    items: [
      {
        id: "video-to-mp4",
        label: "Video to MP4",
        description: "Re-encode a video to MP4.",
        slug: "video-to-mp4",
        render: () => <VideoToMp4 />,
      },
      {
        id: "video-to-gif",
        label: "Video to GIF",
        description: "Convert a video clip into a GIF.",
        slug: "video-to-gif",
        render: () => <VideoToGif />,
      },
      {
        id: "images-to-video",
        label: "Images to Video",
        description: "Combine images into a WebM video.",
        slug: "images-to-video",
        render: () => <ImagesToVideo />,
      },
    ],
  },
];

export default function VideoStudio() {
  return (
    <StudioLayout
      title="Video Studio"
      description="Edit, extract, and convert videos locally."
      sections={SECTIONS}
    />
  );
}
