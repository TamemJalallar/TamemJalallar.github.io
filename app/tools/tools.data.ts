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
  { slug: "svg-optimizer", title: "SVG Optimizer", description: "Optimize SVG files.", tags: ["image"] },
  { slug: "image-metadata", title: "Image Metadata Viewer", description: "View EXIF image metadata.", tags: ["image"] },
  { slug: "image-format-converter", title: "Image Format Converter", description: "Convert images to WebP or AVIF.", tags: ["image"] },
  { slug: "sprite-sheet-builder", title: "Sprite Sheet Builder", description: "Combine images into a sprite sheet.", tags: ["image"] },
  { slug: "ocr-reader", title: "OCR Reader", description: "Extract text from images.", tags: ["image"] },

  // PDF
  { slug: "merge-pdfs", title: "Merge PDFs", description: "Merge multiple PDFs into one.", tags: ["pdf"] },
  { slug: "split-pdfs", title: "Split PDFs", description: "Split a PDF into separate pages.", tags: ["pdf"] },
  { slug: "compress-pdfs", title: "Compress PDFs", description: "Compress PDF files locally.", tags: ["pdf"] },
  { slug: "pdf-to-images", title: "PDF to Images", description: "Convert each PDF page to PNG.", tags: ["pdf"] },
  { slug: "images-to-pdf", title: "Images to PDF", description: "Convert images into a single PDF.", tags: ["pdf"] },
  { slug: "pdf-page-cropper", title: "PDF Crop & Margins", description: "Trim page margins or crop pages.", tags: ["pdf"] },
  { slug: "pdf-page-size", title: "PDF Page Size Converter", description: "Convert pages to A4/Letter/Legal.", tags: ["pdf"] },
  { slug: "pdf-grayscale", title: "PDF Grayscale", description: "Flatten pages to grayscale.", tags: ["pdf"] },
  { slug: "pdf-form-filler", title: "PDF Form Filler", description: "Fill PDF form fields locally.", tags: ["pdf"] },
  { slug: "split-pdf", title: "Split PDF", description: "Split a PDF into pages or ranges.", tags: ["pdf"] },
  { slug: "compress-pdf", title: "Compress PDF", description: "Re-save a PDF to reduce size.", tags: ["pdf"] },
  { slug: "rotate-pdf", title: "Rotate PDF", description: "Rotate PDF pages 90/180/270 degrees.", tags: ["pdf"] },
  { slug: "reorder-pdf-pages", title: "Reorder PDF Pages", description: "Reorder pages with a custom list.", tags: ["pdf"] },
  { slug: "remove-pdf-pages", title: "Remove PDF Pages", description: "Remove selected pages from a PDF.", tags: ["pdf"] },
  { slug: "extract-pdf-pages", title: "Extract PDF Pages", description: "Extract pages into a new PDF.", tags: ["pdf"] },
  { slug: "pdf-to-text", title: "PDF to Text", description: "Extract text from a PDF.", tags: ["pdf"] },
  { slug: "pdf-to-html", title: "PDF to HTML", description: "Extract PDF text into basic HTML.", tags: ["pdf"] },
  { slug: "pdf-watermark", title: "PDF Watermark", description: "Add a text watermark to pages.", tags: ["pdf"] },
  { slug: "pdf-page-numbers", title: "PDF Page Numbers", description: "Add page numbers to each page.", tags: ["pdf"] },
  { slug: "pdf-metadata-editor", title: "PDF Metadata Editor", description: "Edit PDF title/author/keywords.", tags: ["pdf"] },
  { slug: "pdf-annotator", title: "PDF Annotator", description: "Add a note overlay to a page.", tags: ["pdf"] },
  { slug: "protect-pdf", title: "Protect PDF", description: "Password protect a PDF.", tags: ["pdf"] },
  { slug: "unlock-pdf", title: "Unlock PDF", description: "Remove PDF password protection.", tags: ["pdf"] },
  { slug: "pdf-redactor", title: "PDF Redactor", description: "Cover content with redaction blocks.", tags: ["pdf"] },
  { slug: "sign-pdf", title: "Sign PDF", description: "Add a visual signature.", tags: ["pdf"] },

  // Encode / Data
  { slug: "base64", title: "Base64 Encoder/Decoder", description: "Encode/decode Base64.", tags: ["dev"] },
  { slug: "jwt-decoder", title: "JWT Decoder", description: "Decode JWT header and payload locally.", tags: ["dev"] },
  { slug: "regex-tester", title: "Regex Tester", description: "Test regex patterns and preview matches.", tags: ["dev"] },
  { slug: "hash-generator", title: "Hash Generator", description: "Generate hashes locally using WebCrypto.", tags: ["dev"] },
  { slug: "cron-generator", title: "Cron Generator", description: "Build cron expressions visually.", tags: ["dev"] },
  { slug: "url-encoder", title: "URL Encoder/Decoder", description: "Encode/decode URL components.", tags: ["dev"] },
  { slug: "json-formatter", title: "JSON Formatter", description: "Validate and format JSON.", tags: ["dev"] },
  { slug: "uuid-ulid-generator", title: "UUID / ULID Generator", description: "Generate UUID v4 and ULID values.", tags: ["dev"] },
  { slug: "hmac-signer", title: "HMAC Signer", description: "Sign and verify HMAC signatures.", tags: ["dev"] },

  // Text
  { slug: "case-converter", title: "Case Converter", description: "Convert between case styles.", tags: ["text"] },
  { slug: "text-case-converter", title: "Text Case Converter", description: "Convert between case styles.", tags: ["text"] },
  { slug: "word-counter", title: "Word & Character Counter", description: "Count words/chars/lines.", tags: ["text"] },
  { slug: "find-replace", title: "Find & Replace", description: "Find & replace text (regex optional).", tags: ["text"] },
  { slug: "lorem-ipsum", title: "Lorem Ipsum", description: "Generate placeholder text.", tags: ["text"] },
  { slug: "slug-generator", title: "Slug Generator", description: "Generate URL-friendly slugs.", tags: ["text"] },
  { slug: "text-statistics", title: "Text Statistics", description: "Reading time and text metrics.", tags: ["text"] },
  { slug: "remove-duplicate-lines", title: "Remove Duplicate Lines", description: "Deduplicate text lines.", tags: ["text"] },
  { slug: "sort-lines", title: "Sort Lines", description: "Sort lines alphabetically.", tags: ["text"] },
  { slug: "whitespace-cleaner", title: "Whitespace Cleaner", description: "Normalize whitespace and line breaks.", tags: ["text"] },

  // Color
  { slug: "color-picker", title: "Color Picker", description: "Pick a color and copy hex.", tags: ["color"] },
  { slug: "contrast-checker", title: "Contrast Checker", description: "WCAG contrast ratio checks.", tags: ["color"] },
  { slug: "color-palette-generator", title: "Color Palette Generator", description: "Generate color palettes.", tags: ["color"] },

  // Conversions
  { slug: "unit-converter", title: "Unit Converter", description: "Length/weight/temp conversions.", tags: ["utility"] },
  { slug: "url-query-builder", title: "URL Query Builder", description: "Parse and build URL queries.", tags: ["utility"] },

  // Batch 1
  { slug: "password-generator", title: "Password Generator", description: "Generate strong passwords locally.", tags: ["dev"] },
  { slug: "markdown-to-html", title: "Markdown → HTML", description: "Convert Markdown to HTML.", tags: ["text"] },
  { slug: "html-to-markdown", title: "HTML → Markdown", description: "Convert HTML to Markdown.", tags: ["text"] },
  { slug: "csv-to-json", title: "CSV → JSON", description: "Convert CSV into JSON.", tags: ["data"] },
  { slug: "json-to-csv", title: "JSON → CSV", description: "Convert JSON into CSV.", tags: ["data"] },
  { slug: "yaml-json", title: "YAML ⇄ JSON", description: "Convert YAML and JSON.", tags: ["data"] },
  { slug: "xml-json", title: "XML ⇄ JSON", description: "Convert XML and JSON.", tags: ["data"] },
  { slug: "base-number-converter", title: "Base Number Converter", description: "Binary / Hex / Decimal conversion.", tags: ["data"] },
  { slug: "json-table-viewer", title: "JSON ↔ Table", description: "Edit JSON arrays in a table view.", tags: ["data"] },
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
  { slug: "dice-roller", title: "Dice Roller", description: "Roll virtual dice.", tags: ["fun"] },
  { slug: "random-name-generator", title: "Random Name Generator", description: "Generate random names.", tags: ["fun"] },
  { slug: "magic-8-ball", title: "Magic 8 Ball", description: "Shake for a classic Magic 8 Ball response.", tags: ["fun"] },
  { slug: "coin-flip", title: "Coin Flip", description: "Flip a coin for heads or tails.", tags: ["fun"] },
  { slug: "yes-no-oracle", title: "Yes / No Oracle", description: "Get a quick yes/no answer.", tags: ["fun"] },
  { slug: "random-number-generator", title: "Random Number Generator", description: "Generate random numbers in a range.", tags: ["fun"] },
  { slug: "truth-or-dare", title: "Truth or Dare", description: "Get a truth or dare prompt.", tags: ["fun"] },
  { slug: "would-you-rather", title: "Would You Rather", description: "Pick between two scenarios.", tags: ["fun"] },
  { slug: "nickname-generator", title: "Nickname Generator", description: "Generate playful nicknames.", tags: ["fun"] },
  { slug: "username-generator", title: "Username Generator", description: "Generate username ideas.", tags: ["fun"] },
  { slug: "fun-fact-generator", title: "Fun Fact Generator", description: "Get a random fun fact.", tags: ["fun"] },
  { slug: "emoji-generator", title: "Emoji Generator", description: "Generate random emojis.", tags: ["fun"] },
  { slug: "emoji-combiner", title: "Emoji Combiner", description: "Combine two emojis.", tags: ["fun"] },
  { slug: "ascii-face-generator", title: "ASCII Face Generator", description: "Generate ASCII faces.", tags: ["fun"] },
  { slug: "excuse-generator", title: "Excuse Generator", description: "Generate a playful excuse.", tags: ["fun"] },
  { slug: "compliment-generator", title: "Compliment Generator", description: "Generate a quick compliment.", tags: ["fun"] },
  { slug: "startup-name-generator", title: "Startup Name Generator", description: "Generate startup name ideas.", tags: ["fun"] },
  { slug: "li-distinction-tester", title: "L/I Distinction Tester", description: "Spot confusing I vs l.", tags: ["dev"] },
  { slug: "file-corrupter", title: "File Corrupter", description: "Corrupt a file for QA testing.", tags: ["dev"] },
  { slug: "ascii-art-generator", title: "ASCII Art Generator", description: "Big ASCII banner from text.", tags: ["text"] },
];

export const TOOL_SLUGS: string[] = TOOL_META.map((t) => t.slug);
