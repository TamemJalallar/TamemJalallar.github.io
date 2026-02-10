"use client";

import StudioLayout, { type StudioSection } from "./_StudioLayout";
import ImageResizer from "./ImageResizer";
import ImageCompressor from "./ImageCompressor";
import ImageFormatConverter from "./ImageFormatConverter";
import JpgToPng from "./JpgToPng";
import PngToJpg from "./PngToJpg";
import FaviconGenerator from "./FaviconGenerator";
import SvgOptimizer from "./SvgOptimizer";
import IconPackPreviewer from "./IconPackPreviewer";
import LogoBackgroundTester from "./LogoBackgroundTester";
import BrandMockupGenerator from "./BrandMockupGenerator";
import BackgroundRemover from "./BackgroundRemover";
import ImageColorPicker from "./ImageColorPicker";
import ImageMetadata from "./ImageMetadata";
import OcrPro from "./OcrPro";
import OcrReader from "./OcrReader";
import ImagesToGif from "./ImagesToGif";
import GifOptimizer from "./GifOptimizer";
import SpriteSheetBuilder from "./SpriteSheetBuilder";

const SECTIONS: StudioSection[] = [
  {
    title: "Core",
    items: [
      {
        id: "image-resizer",
        label: "Image Resizer",
        description: "Resize images and download PNG.",
        slug: "image-resizer",
        render: () => <ImageResizer />,
      },
      {
        id: "image-compressor",
        label: "Image Compressor",
        description: "Compress images to JPG.",
        slug: "image-compressor",
        render: () => <ImageCompressor />,
      },
      {
        id: "image-format-converter",
        label: "Image Format Converter",
        description: "Convert images to JPG/PNG/WebP/AVIF.",
        slug: "image-format-converter",
        render: () => <ImageFormatConverter />,
      },
      {
        id: "jpg-to-png",
        label: "JPG to PNG",
        description: "Convert JPG → PNG.",
        slug: "jpg-to-png",
        render: () => <JpgToPng />,
      },
      {
        id: "png-to-jpg",
        label: "PNG to JPG",
        description: "Convert PNG → JPG.",
        slug: "png-to-jpg",
        render: () => <PngToJpg />,
      },
    ],
  },
  {
    title: "Brand & Icons",
    items: [
      {
        id: "favicon-generator",
        label: "Favicon Generator",
        description: "Generate favicon sizes.",
        slug: "favicon-generator",
        render: () => <FaviconGenerator />,
      },
      {
        id: "svg-optimizer",
        label: "SVG Optimizer",
        description: "Optimize SVG files.",
        slug: "svg-optimizer",
        render: () => <SvgOptimizer />,
      },
      {
        id: "icon-pack-previewer",
        label: "Icon Pack Previewer",
        description: "Preview SVG/PNG icon packs.",
        slug: "icon-pack-previewer",
        render: () => <IconPackPreviewer />,
      },
      {
        id: "logo-background-tester",
        label: "Logo Background Tester",
        description: "Preview logos on multiple backgrounds.",
        slug: "logo-background-tester",
        render: () => <LogoBackgroundTester />,
      },
      {
        id: "brand-mockup-generator",
        label: "Brand Mockup Generator",
        description: "Generate social banners from brand assets.",
        slug: "brand-mockup-generator",
        render: () => <BrandMockupGenerator />,
      },
    ],
  },
  {
    title: "Cleanup & Color",
    items: [
      {
        id: "background-remover",
        label: "Background Remover",
        description: "Remove backgrounds with color-keying.",
        slug: "background-remover",
        render: () => <BackgroundRemover />,
      },
      {
        id: "image-color-picker",
        label: "Image Color Picker",
        description: "Pick multiple colors and export a palette.",
        slug: "image-color-picker",
        render: () => <ImageColorPicker />,
      },
      {
        id: "image-metadata",
        label: "Image Metadata Viewer",
        description: "View EXIF image metadata.",
        slug: "image-metadata",
        render: () => <ImageMetadata />,
      },
    ],
  },
  {
    title: "OCR",
    items: [
      {
        id: "ocr-pro",
        label: "OCR Pro",
        description: "Extract text from images locally.",
        slug: "ocr-pro",
        render: () => <OcrPro />,
      },
      {
        id: "ocr-reader",
        label: "OCR Reader",
        description: "Extract text from images.",
        slug: "ocr-reader",
        render: () => <OcrReader />,
      },
    ],
  },
  {
    title: "Animation",
    items: [
      {
        id: "images-to-gif",
        label: "Images to GIF",
        description: "Create an animated GIF from images.",
        slug: "images-to-gif",
        render: () => <ImagesToGif />,
      },
      {
        id: "gif-optimizer",
        label: "GIF Optimizer",
        description: "Reduce GIF size by lowering FPS/scale.",
        slug: "gif-optimizer",
        render: () => <GifOptimizer />,
      },
      {
        id: "sprite-sheet-builder",
        label: "Sprite Sheet Builder",
        description: "Combine images into a sprite sheet.",
        slug: "sprite-sheet-builder",
        render: () => <SpriteSheetBuilder />,
      },
    ],
  },
];

export default function ImageStudio() {
  return (
    <StudioLayout
      title="Image Studio"
      description="All image tools in one workspace."
      sections={SECTIONS}
    />
  );
}
