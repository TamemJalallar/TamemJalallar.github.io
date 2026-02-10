"use client";

import StudioLayout, { type StudioSection } from "./_StudioLayout";
import CsvToJson from "./CsvToJson";
import JsonToCsv from "./JsonToCsv";
import YamlJson from "./YamlJson";
import XmlJson from "./XmlJson";
import BaseNumberConverter from "./BaseNumberConverter";
import JsonTableViewer from "./JsonTableViewer";
import CsvProfiler from "./CsvProfiler";

const SECTIONS: StudioSection[] = [
  {
    title: "Convert",
    items: [
      {
        id: "csv-to-json",
        label: "CSV → JSON",
        description: "Convert CSV into JSON.",
        slug: "csv-to-json",
        render: () => <CsvToJson />,
      },
      {
        id: "json-to-csv",
        label: "JSON → CSV",
        description: "Convert JSON into CSV.",
        slug: "json-to-csv",
        render: () => <JsonToCsv />,
      },
      {
        id: "yaml-json",
        label: "YAML ⇄ JSON",
        description: "Convert YAML and JSON.",
        slug: "yaml-json",
        render: () => <YamlJson />,
      },
      {
        id: "xml-json",
        label: "XML ⇄ JSON",
        description: "Convert XML and JSON.",
        slug: "xml-json",
        render: () => <XmlJson />,
      },
      {
        id: "base-number-converter",
        label: "Base Number Converter",
        description: "Binary / Hex / Decimal conversion.",
        slug: "base-number-converter",
        render: () => <BaseNumberConverter />,
      },
    ],
  },
  {
    title: "Explore",
    items: [
      {
        id: "json-table-viewer",
        label: "JSON ↔ Table",
        description: "Edit JSON arrays in a table view.",
        slug: "json-table-viewer",
        render: () => <JsonTableViewer />,
      },
      {
        id: "csv-profiler",
        label: "CSV Profiler",
        description: "Profile columns for types and outliers.",
        slug: "csv-profiler",
        render: () => <CsvProfiler />,
      },
    ],
  },
];

export default function DataStudio() {
  return (
    <StudioLayout
      title="Data Studio"
      description="Convert and explore data files locally."
      sections={SECTIONS}
    />
  );
}
