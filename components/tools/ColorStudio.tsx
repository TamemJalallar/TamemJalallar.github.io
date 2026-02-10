"use client";

import StudioLayout, { type StudioSection } from "./_StudioLayout";
import ColorPicker from "./ColorPicker";
import ContrastChecker from "./ContrastChecker";
import ColorPaletteGenerator from "./ColorPaletteGenerator";
import ColorHarmonyGenerator from "./ColorHarmonyGenerator";
import GradientBuilder from "./GradientBuilder";
import GradientGalleryGenerator from "./GradientGalleryGenerator";
import BrandColorTokensGenerator from "./BrandColorTokensGenerator";

const SECTIONS: StudioSection[] = [
  {
    title: "Pick & Check",
    items: [
      {
        id: "color-picker",
        label: "Color Picker",
        description: "Pick a color and copy hex.",
        slug: "color-picker",
        render: () => <ColorPicker />,
      },
      {
        id: "contrast-checker",
        label: "Contrast Checker",
        description: "WCAG contrast ratio checks.",
        slug: "contrast-checker",
        render: () => <ContrastChecker />,
      },
    ],
  },
  {
    title: "Palettes",
    items: [
      {
        id: "color-palette-generator",
        label: "Color Palette Generator",
        description: "Generate color palettes.",
        slug: "color-palette-generator",
        render: () => <ColorPaletteGenerator />,
      },
      {
        id: "color-harmony-generator",
        label: "Color Harmony Generator",
        description: "Complementary and triadic palettes.",
        slug: "color-harmony-generator",
        render: () => <ColorHarmonyGenerator />,
      },
    ],
  },
  {
    title: "Gradients",
    items: [
      {
        id: "gradient-builder",
        label: "Gradient Builder",
        description: "Build CSS gradients visually.",
        slug: "gradient-builder",
        render: () => <GradientBuilder />,
      },
      {
        id: "gradient-gallery",
        label: "Gradient Gallery",
        description: "Generate a gradient preset gallery.",
        slug: "gradient-gallery",
        render: () => <GradientGalleryGenerator />,
      },
    ],
  },
  {
    title: "Brand",
    items: [
      {
        id: "brand-color-tokens",
        label: "Brand Color Tokens",
        description: "Generate CSS/JSON color tokens.",
        slug: "brand-color-tokens",
        render: () => <BrandColorTokensGenerator />,
      },
    ],
  },
];

export default function ColorStudio() {
  return (
    <StudioLayout
      title="Color Studio"
      description="Build palettes, gradients, and brand tokens."
      sections={SECTIONS}
    />
  );
}
