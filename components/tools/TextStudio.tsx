"use client";

import StudioLayout, { type StudioSection } from "./_StudioLayout";
import CaseConverter from "./CaseConverter";
import TextCaseConverter from "./TextCaseConverter";
import WhitespaceCleaner from "./WhitespaceCleaner";
import FindAndReplace from "./FindAndReplace";
import WordCharacterCounter from "./WordCharacterCounter";
import TextStatistics from "./TextStatistics";
import TextDiffChecker from "./TextDiffChecker";
import RemoveDuplicateLines from "./RemoveDuplicateLines";
import SortLines from "./SortLines";
import SlugGenerator from "./SlugGenerator";
import LoremIpsumGenerator from "./LoremIpsumGenerator";
import MarkdownToHtml from "./MarkdownToHtml";
import HtmlToMarkdown from "./HtmlToMarkdown";
import AsciiArtGenerator from "./AsciiArtGenerator";
import TypeScaleBuilder from "./TypeScaleBuilder";

const SECTIONS: StudioSection[] = [
  {
    title: "Transform",
    items: [
      {
        id: "case-converter",
        label: "Case Converter",
        description: "Convert between case styles.",
        slug: "case-converter",
        render: () => <CaseConverter />,
      },
      {
        id: "text-case-converter",
        label: "Text Case Converter",
        description: "Convert between case styles.",
        slug: "text-case-converter",
        render: () => <TextCaseConverter />,
      },
      {
        id: "whitespace-cleaner",
        label: "Whitespace Cleaner",
        description: "Normalize whitespace and line breaks.",
        slug: "whitespace-cleaner",
        render: () => <WhitespaceCleaner />,
      },
      {
        id: "find-replace",
        label: "Find & Replace",
        description: "Find & replace text (regex optional).",
        slug: "find-replace",
        render: () => <FindAndReplace />,
      },
    ],
  },
  {
    title: "Analyze",
    items: [
      {
        id: "word-counter",
        label: "Word & Character Counter",
        description: "Count words/chars/lines.",
        slug: "word-counter",
        render: () => <WordCharacterCounter />,
      },
      {
        id: "text-statistics",
        label: "Text Statistics",
        description: "Reading time and text metrics.",
        slug: "text-statistics",
        render: () => <TextStatistics />,
      },
      {
        id: "text-diff-checker",
        label: "Text Diff Checker",
        description: "Compare two texts line-by-line.",
        slug: "text-diff-checker",
        render: () => <TextDiffChecker />,
      },
    ],
  },
  {
    title: "Clean & Sort",
    items: [
      {
        id: "remove-duplicate-lines",
        label: "Remove Duplicate Lines",
        description: "Deduplicate text lines.",
        slug: "remove-duplicate-lines",
        render: () => <RemoveDuplicateLines />,
      },
      {
        id: "sort-lines",
        label: "Sort Lines",
        description: "Sort lines alphabetically.",
        slug: "sort-lines",
        render: () => <SortLines />,
      },
    ],
  },
  {
    title: "Generate",
    items: [
      {
        id: "slug-generator",
        label: "Slug Generator",
        description: "Generate URL-friendly slugs.",
        slug: "slug-generator",
        render: () => <SlugGenerator />,
      },
      {
        id: "lorem-ipsum",
        label: "Lorem Ipsum",
        description: "Generate placeholder text.",
        slug: "lorem-ipsum",
        render: () => <LoremIpsumGenerator />,
      },
      {
        id: "markdown-to-html",
        label: "Markdown → HTML",
        description: "Convert Markdown to HTML.",
        slug: "markdown-to-html",
        render: () => <MarkdownToHtml />,
      },
      {
        id: "html-to-markdown",
        label: "HTML → Markdown",
        description: "Convert HTML to Markdown.",
        slug: "html-to-markdown",
        render: () => <HtmlToMarkdown />,
      },
    ],
  },
  {
    title: "Typography",
    items: [
      {
        id: "type-scale-builder",
        label: "Type Scale Builder",
        description: "Build modular typography scales.",
        slug: "type-scale-builder",
        render: () => <TypeScaleBuilder />,
      },
      {
        id: "ascii-art-generator",
        label: "ASCII Art Generator",
        description: "Big ASCII banner from text.",
        slug: "ascii-art-generator",
        render: () => <AsciiArtGenerator />,
      },
    ],
  },
];

export default function TextStudio() {
  return (
    <StudioLayout
      title="Text Studio"
      description="Transform, analyze, and generate text."
      sections={SECTIONS}
    />
  );
}
