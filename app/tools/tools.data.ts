export type ToolMeta = {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
};

export const TOOL_META: ToolMeta[] = [
  // Images
  { slug: "image-resizer", title: "Image Resizer", description: "Resize images and download PNG.", tags: ["image"] },
  { slug: "image-compressor", title: "Image Compressor", description: "Compress images to JPG.", tags: ["image"] },
  { slug: "jpg-to-png", title: "JPG to PNG", description: "Convert JPG → PNG.", tags: ["image"] },
  { slug: "png-to-jpg", title: "PNG to JPG", description: "Convert PNG → JPG.", tags: ["image"] },
  { slug: "favicon-generator", title: "Favicon Generator", description: "Generate favicon sizes.", tags: ["image"] },

  // PDF
  { slug: "merge-pdfs", title: "Merge PDFs", description: "Merge multiple PDFs into one.", tags: ["pdf"] },
  { slug: "pdf-to-images", title: "PDF to Images", description: "Convert each PDF page to PNG.", tags: ["pdf"] },

  // Encode / Data
  { slug: "base64", title: "Base64 Encoder/Decoder", description: "Encode/decode Base64.", tags: ["dev"] },
  { slug: "url-encoder", title: "URL Encoder/Decoder", description: "Encode/decode URL components.", tags: ["dev"] },
  { slug: "json-formatter", title: "JSON Formatter", description: "Validate and format JSON.", tags: ["dev"] },

  // Text
  { slug: "text-case-converter", title: "Text Case Converter", description: "Convert between case styles.", tags: ["text"] },
  { slug: "word-counter", title: "Word & Character Counter", description: "Count words/chars/lines.", tags: ["text"] },
  { slug: "find-replace", title: "Find & Replace", description: "Find & replace text (regex optional).", tags: ["text"] },
  { slug: "lorem-ipsum", title: "Lorem Ipsum", description: "Generate placeholder text.", tags: ["text"] },

  // Color
  { slug: "color-picker", title: "Color Picker", description: "Pick a color and copy hex.", tags: ["color"] },
  { slug: "contrast-checker", title: "Contrast Checker", description: "WCAG contrast ratio checks.", tags: ["color"] },

  // Conversions
  { slug: "unit-converter", title: "Unit Converter", description: "Length/weight/temp conversions.", tags: ["utility"] },

  // Batch 1
  { slug: "password-generator", title: "Password Generator", description: "Generate strong passwords locally.", tags: ["dev"] },
  { slug: "markdown-to-html", title: "Markdown → HTML", description: "Convert Markdown to HTML.", tags: ["text"] },
  { slug: "html-to-markdown", title: "HTML → Markdown", description: "Convert HTML to Markdown.", tags: ["text"] },
  { slug: "csv-to-json", title: "CSV → JSON", description: "Convert CSV into JSON.", tags: ["data"] },
  { slug: "json-to-csv", title: "JSON → CSV", description: "Convert JSON into CSV.", tags: ["data"] },
  { slug: "qr-code-generator", title: "QR Code Generator", description: "Generate a QR code PNG.", tags: ["utility"] },
  { slug: "qr-code-scanner", title: "QR Code Scanner", description: "Scan QR codes using your camera.", tags: ["utility"] },
  { slug: "barcode-generator", title: "Barcode Generator", description: "Generate CODE128/EAN13 barcodes.", tags: ["utility"] },
  { slug: "text-diff-checker", title: "Text Diff Checker", description: "Compare two texts line-by-line.", tags: ["text"] },

  // Batch 2
  { slug: "time-zone-converter", title: "Time Zone Converter", description: "Convert a date/time across time zones.", tags: ["utility"] },
  { slug: "countdown-timer", title: "Countdown Timer", description: "Start/pause/reset a countdown.", tags: ["utility"] },
  { slug: "stopwatch", title: "Stopwatch", description: "Stopwatch with laps.", tags: ["utility"] },
  { slug: "pomodoro-timer", title: "Pomodoro Timer", description: "Work/break timer.", tags: ["utility"] },
  { slug: "random-picker", title: "Random Picker", description: "Pick a random item from a list.", tags: ["fun"] },
  { slug: "wheel-spinner", title: "Wheel Spinner", description: "Spin a list and land on a winner.", tags: ["fun"] },
  { slug: "li-distinction-tester", title: "L/I Distinction Tester", description: "Spot confusing I vs l.", tags: ["dev"] },
  { slug: "file-corrupter", title: "File Corrupter", description: "Corrupt a file for QA testing.", tags: ["dev"] },
  { slug: "ascii-art-generator", title: "ASCII Art Generator", description: "Big ASCII banner from text.", tags: ["text"] },
];

export const TOOL_SLUGS: string[] = TOOL_META.map((t) => t.slug);
