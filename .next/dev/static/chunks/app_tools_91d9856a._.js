(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/tools/tools.data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TOOL_META",
    ()=>TOOL_META,
    "TOOL_SLUGS",
    ()=>TOOL_SLUGS
]);
const TOOL_META = [
    // Images
    {
        slug: "image-resizer",
        title: "Image Resizer",
        description: "Resize images and download PNG.",
        tags: [
            "image"
        ]
    },
    {
        slug: "image-compressor",
        title: "Image Compressor",
        description: "Compress images to JPG.",
        tags: [
            "image"
        ]
    },
    {
        slug: "jpg-to-png",
        title: "JPG to PNG",
        description: "Convert JPG → PNG.",
        tags: [
            "image"
        ]
    },
    {
        slug: "png-to-jpg",
        title: "PNG to JPG",
        description: "Convert PNG → JPG.",
        tags: [
            "image"
        ]
    },
    {
        slug: "favicon-generator",
        title: "Favicon Generator",
        description: "Generate favicon sizes.",
        tags: [
            "image"
        ]
    },
    {
        slug: "svg-optimizer",
        title: "SVG Optimizer",
        description: "Optimize SVG files.",
        tags: [
            "image"
        ]
    },
    {
        slug: "image-metadata",
        title: "Image Metadata Viewer",
        description: "View EXIF image metadata.",
        tags: [
            "image"
        ]
    },
    {
        slug: "image-format-converter",
        title: "Image Format Converter",
        description: "Convert images to WebP or AVIF.",
        tags: [
            "image"
        ]
    },
    {
        slug: "sprite-sheet-builder",
        title: "Sprite Sheet Builder",
        description: "Combine images into a sprite sheet.",
        tags: [
            "image"
        ]
    },
    {
        slug: "ocr-reader",
        title: "OCR Reader",
        description: "Extract text from images.",
        tags: [
            "image"
        ]
    },
    // PDF
    {
        slug: "merge-pdfs",
        title: "Merge PDFs",
        description: "Merge multiple PDFs into one.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "split-pdfs",
        title: "Split PDFs",
        description: "Split a PDF into separate pages.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "compress-pdfs",
        title: "Compress PDFs",
        description: "Compress PDF files locally.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-to-images",
        title: "PDF to Images",
        description: "Convert each PDF page to PNG.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "images-to-pdf",
        title: "Images to PDF",
        description: "Convert images into a single PDF.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-page-cropper",
        title: "PDF Crop & Margins",
        description: "Trim page margins or crop pages.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-page-size",
        title: "PDF Page Size Converter",
        description: "Convert pages to A4/Letter/Legal.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-grayscale",
        title: "PDF Grayscale",
        description: "Flatten pages to grayscale.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-form-filler",
        title: "PDF Form Filler",
        description: "Fill PDF form fields locally.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "split-pdf",
        title: "Split PDF",
        description: "Split a PDF into pages or ranges.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "compress-pdf",
        title: "Compress PDF",
        description: "Re-save a PDF to reduce size.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "rotate-pdf",
        title: "Rotate PDF",
        description: "Rotate PDF pages 90/180/270 degrees.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "reorder-pdf-pages",
        title: "Reorder PDF Pages",
        description: "Reorder pages with a custom list.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "remove-pdf-pages",
        title: "Remove PDF Pages",
        description: "Remove selected pages from a PDF.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "extract-pdf-pages",
        title: "Extract PDF Pages",
        description: "Extract pages into a new PDF.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-to-text",
        title: "PDF to Text",
        description: "Extract text from a PDF.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-to-html",
        title: "PDF to HTML",
        description: "Extract PDF text into basic HTML.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-watermark",
        title: "PDF Watermark",
        description: "Add a text watermark to pages.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-page-numbers",
        title: "PDF Page Numbers",
        description: "Add page numbers to each page.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-metadata-editor",
        title: "PDF Metadata Editor",
        description: "Edit PDF title/author/keywords.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-annotator",
        title: "PDF Annotator",
        description: "Add a note overlay to a page.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "protect-pdf",
        title: "Protect PDF",
        description: "Password protect a PDF.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "unlock-pdf",
        title: "Unlock PDF",
        description: "Remove PDF password protection.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "pdf-redactor",
        title: "PDF Redactor",
        description: "Cover content with redaction blocks.",
        tags: [
            "pdf"
        ]
    },
    {
        slug: "sign-pdf",
        title: "Sign PDF",
        description: "Add a visual signature.",
        tags: [
            "pdf"
        ]
    },
    // Encode / Data
    {
        slug: "base64",
        title: "Base64 Encoder/Decoder",
        description: "Encode/decode Base64.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "jwt-decoder",
        title: "JWT Decoder",
        description: "Decode JWT header and payload locally.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "regex-tester",
        title: "Regex Tester",
        description: "Test regex patterns and preview matches.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "hash-generator",
        title: "Hash Generator",
        description: "Generate hashes locally using WebCrypto.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "cron-generator",
        title: "Cron Generator",
        description: "Build cron expressions visually.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "url-encoder",
        title: "URL Encoder/Decoder",
        description: "Encode/decode URL components.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "json-formatter",
        title: "JSON Formatter",
        description: "Validate and format JSON.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "uuid-ulid-generator",
        title: "UUID / ULID Generator",
        description: "Generate UUID v4 and ULID values.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "hmac-signer",
        title: "HMAC Signer",
        description: "Sign and verify HMAC signatures.",
        tags: [
            "dev"
        ]
    },
    // Text
    {
        slug: "case-converter",
        title: "Case Converter",
        description: "Convert between case styles.",
        tags: [
            "text"
        ]
    },
    {
        slug: "text-case-converter",
        title: "Text Case Converter",
        description: "Convert between case styles.",
        tags: [
            "text"
        ]
    },
    {
        slug: "word-counter",
        title: "Word & Character Counter",
        description: "Count words/chars/lines.",
        tags: [
            "text"
        ]
    },
    {
        slug: "find-replace",
        title: "Find & Replace",
        description: "Find & replace text (regex optional).",
        tags: [
            "text"
        ]
    },
    {
        slug: "lorem-ipsum",
        title: "Lorem Ipsum",
        description: "Generate placeholder text.",
        tags: [
            "text"
        ]
    },
    {
        slug: "slug-generator",
        title: "Slug Generator",
        description: "Generate URL-friendly slugs.",
        tags: [
            "text"
        ]
    },
    {
        slug: "text-statistics",
        title: "Text Statistics",
        description: "Reading time and text metrics.",
        tags: [
            "text"
        ]
    },
    {
        slug: "remove-duplicate-lines",
        title: "Remove Duplicate Lines",
        description: "Deduplicate text lines.",
        tags: [
            "text"
        ]
    },
    {
        slug: "sort-lines",
        title: "Sort Lines",
        description: "Sort lines alphabetically.",
        tags: [
            "text"
        ]
    },
    {
        slug: "whitespace-cleaner",
        title: "Whitespace Cleaner",
        description: "Normalize whitespace and line breaks.",
        tags: [
            "text"
        ]
    },
    // Color
    {
        slug: "color-picker",
        title: "Color Picker",
        description: "Pick a color and copy hex.",
        tags: [
            "color"
        ]
    },
    {
        slug: "contrast-checker",
        title: "Contrast Checker",
        description: "WCAG contrast ratio checks.",
        tags: [
            "color"
        ]
    },
    {
        slug: "color-palette-generator",
        title: "Color Palette Generator",
        description: "Generate color palettes.",
        tags: [
            "color"
        ]
    },
    // Conversions
    {
        slug: "unit-converter",
        title: "Unit Converter",
        description: "Length/weight/temp conversions.",
        tags: [
            "utility"
        ]
    },
    {
        slug: "url-query-builder",
        title: "URL Query Builder",
        description: "Parse and build URL queries.",
        tags: [
            "utility"
        ]
    },
    // Batch 1
    {
        slug: "password-generator",
        title: "Password Generator",
        description: "Generate strong passwords locally.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "markdown-to-html",
        title: "Markdown → HTML",
        description: "Convert Markdown to HTML.",
        tags: [
            "text"
        ]
    },
    {
        slug: "html-to-markdown",
        title: "HTML → Markdown",
        description: "Convert HTML to Markdown.",
        tags: [
            "text"
        ]
    },
    {
        slug: "csv-to-json",
        title: "CSV → JSON",
        description: "Convert CSV into JSON.",
        tags: [
            "data"
        ]
    },
    {
        slug: "json-to-csv",
        title: "JSON → CSV",
        description: "Convert JSON into CSV.",
        tags: [
            "data"
        ]
    },
    {
        slug: "yaml-json",
        title: "YAML ⇄ JSON",
        description: "Convert YAML and JSON.",
        tags: [
            "data"
        ]
    },
    {
        slug: "xml-json",
        title: "XML ⇄ JSON",
        description: "Convert XML and JSON.",
        tags: [
            "data"
        ]
    },
    {
        slug: "base-number-converter",
        title: "Base Number Converter",
        description: "Binary / Hex / Decimal conversion.",
        tags: [
            "data"
        ]
    },
    {
        slug: "json-table-viewer",
        title: "JSON ↔ Table",
        description: "Edit JSON arrays in a table view.",
        tags: [
            "data"
        ]
    },
    {
        slug: "qr-code-generator",
        title: "QR Code Generator",
        description: "Generate a QR code PNG.",
        tags: [
            "utility"
        ]
    },
    {
        slug: "qr-code-scanner",
        title: "QR Code Scanner",
        description: "Scan QR codes using your camera.",
        tags: [
            "utility"
        ]
    },
    {
        slug: "barcode-generator",
        title: "Barcode Generator",
        description: "Generate CODE128/EAN13 barcodes.",
        tags: [
            "utility"
        ]
    },
    {
        slug: "text-diff-checker",
        title: "Text Diff Checker",
        description: "Compare two texts line-by-line.",
        tags: [
            "text"
        ]
    },
    // Batch 2
    {
        slug: "time-zone-converter",
        title: "Time Zone Converter",
        description: "Convert a date/time across time zones.",
        tags: [
            "utility"
        ]
    },
    {
        slug: "countdown-timer",
        title: "Countdown Timer",
        description: "Start/pause/reset a countdown.",
        tags: [
            "utility"
        ]
    },
    {
        slug: "stopwatch",
        title: "Stopwatch",
        description: "Stopwatch with laps.",
        tags: [
            "utility"
        ]
    },
    {
        slug: "pomodoro-timer",
        title: "Pomodoro Timer",
        description: "Work/break timer.",
        tags: [
            "utility"
        ]
    },
    {
        slug: "random-picker",
        title: "Random Picker",
        description: "Pick a random item from a list.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "wheel-spinner",
        title: "Wheel Spinner",
        description: "Spin a list and land on a winner.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "dice-roller",
        title: "Dice Roller",
        description: "Roll virtual dice.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "random-name-generator",
        title: "Random Name Generator",
        description: "Generate random names.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "magic-8-ball",
        title: "Magic 8 Ball",
        description: "Shake for a classic Magic 8 Ball response.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "coin-flip",
        title: "Coin Flip",
        description: "Flip a coin for heads or tails.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "yes-no-oracle",
        title: "Yes / No Oracle",
        description: "Get a quick yes/no answer.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "random-number-generator",
        title: "Random Number Generator",
        description: "Generate random numbers in a range.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "truth-or-dare",
        title: "Truth or Dare",
        description: "Get a truth or dare prompt.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "would-you-rather",
        title: "Would You Rather",
        description: "Pick between two scenarios.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "nickname-generator",
        title: "Nickname Generator",
        description: "Generate playful nicknames.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "username-generator",
        title: "Username Generator",
        description: "Generate username ideas.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "fun-fact-generator",
        title: "Fun Fact Generator",
        description: "Get a random fun fact.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "emoji-generator",
        title: "Emoji Generator",
        description: "Generate random emojis.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "emoji-combiner",
        title: "Emoji Combiner",
        description: "Combine two emojis.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "ascii-face-generator",
        title: "ASCII Face Generator",
        description: "Generate ASCII faces.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "excuse-generator",
        title: "Excuse Generator",
        description: "Generate a playful excuse.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "compliment-generator",
        title: "Compliment Generator",
        description: "Generate a quick compliment.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "startup-name-generator",
        title: "Startup Name Generator",
        description: "Generate startup name ideas.",
        tags: [
            "fun"
        ]
    },
    {
        slug: "li-distinction-tester",
        title: "L/I Distinction Tester",
        description: "Spot confusing I vs l.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "file-corrupter",
        title: "File Corrupter",
        description: "Corrupt a file for QA testing.",
        tags: [
            "dev"
        ]
    },
    {
        slug: "ascii-art-generator",
        title: "ASCII Art Generator",
        description: "Big ASCII banner from text.",
        tags: [
            "text"
        ]
    }
];
const TOOL_SLUGS = TOOL_META.map(_c = (t)=>t.slug);
_c1 = TOOL_SLUGS;
var _c, _c1;
__turbopack_context__.k.register(_c, "TOOL_SLUGS$TOOL_META.map");
__turbopack_context__.k.register(_c1, "TOOL_SLUGS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/tools/tools-page-client.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ToolsPageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$tools$2f$tools$2e$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/tools/tools.data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fi/index.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
// Change this order to whatever you want.
const GROUP_ORDER = [
    "pdf",
    "dev",
    "text",
    "data",
    "image",
    "color",
    "utility",
    "fun"
];
const GROUP_STYLES = {
    pdf: {
        badge: "border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-200",
        dot: "bg-amber-400",
        label: "text-amber-700 dark:text-amber-200",
        count: "text-amber-600/80 dark:text-amber-200/70",
        bar: "bg-amber-400/80"
    },
    dev: {
        badge: "border-sky-500/40 bg-sky-500/15 text-sky-700 dark:text-sky-200",
        dot: "bg-sky-400",
        label: "text-sky-700 dark:text-sky-200",
        count: "text-sky-600/80 dark:text-sky-200/70",
        bar: "bg-sky-400/80"
    },
    text: {
        badge: "border-indigo-500/40 bg-indigo-500/15 text-indigo-700 dark:text-indigo-200",
        dot: "bg-indigo-400",
        label: "text-indigo-700 dark:text-indigo-200",
        count: "text-indigo-600/80 dark:text-indigo-200/70",
        bar: "bg-indigo-400/80"
    },
    data: {
        badge: "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200",
        dot: "bg-emerald-400",
        label: "text-emerald-700 dark:text-emerald-200",
        count: "text-emerald-600/80 dark:text-emerald-200/70",
        bar: "bg-emerald-400/80"
    },
    image: {
        badge: "border-cyan-500/40 bg-cyan-500/15 text-cyan-700 dark:text-cyan-200",
        dot: "bg-cyan-400",
        label: "text-cyan-700 dark:text-cyan-200",
        count: "text-cyan-600/80 dark:text-cyan-200/70",
        bar: "bg-cyan-400/80"
    },
    color: {
        badge: "border-orange-500/40 bg-orange-500/15 text-orange-700 dark:text-orange-200",
        dot: "bg-orange-400",
        label: "text-orange-700 dark:text-orange-200",
        count: "text-orange-600/80 dark:text-orange-200/70",
        bar: "bg-orange-400/80"
    },
    utility: {
        badge: "border-slate-500/40 bg-slate-500/15 text-slate-700 dark:text-slate-200",
        dot: "bg-slate-400",
        label: "text-slate-700 dark:text-slate-200",
        count: "text-slate-600/80 dark:text-slate-200/70",
        bar: "bg-slate-400/80"
    },
    fun: {
        badge: "border-pink-500/40 bg-pink-500/15 text-pink-700 dark:text-pink-200",
        dot: "bg-pink-400",
        label: "text-pink-700 dark:text-pink-200",
        count: "text-pink-600/80 dark:text-pink-200/70",
        bar: "bg-pink-400/80"
    },
    other: {
        badge: "border-gray-400/40 bg-gray-400/10 text-gray-600 dark:text-gray-300",
        dot: "bg-gray-400",
        label: "text-gray-600 dark:text-gray-300",
        count: "text-gray-500/80 dark:text-gray-300/70",
        bar: "bg-gray-400/70"
    }
};
function pickGroup(tags) {
    if (!tags?.length) return "other";
    for (const g of GROUP_ORDER){
        if (tags.includes(g)) return g;
    }
    return "other";
}
function labelForGroup(g) {
    const map = {
        pdf: "PDF",
        dev: "Developer",
        text: "Text",
        data: "Data",
        image: "Image",
        color: "Color",
        utility: "Utility",
        fun: "Fun",
        other: "Other"
    };
    return map[g];
}
function styleForTag(tag) {
    if (GROUP_ORDER.includes(tag)) {
        return GROUP_STYLES[tag];
    }
    return GROUP_STYLES.other;
}
function stableShuffle(arr, seed) {
    const out = [
        ...arr
    ];
    let s = seed >>> 0;
    const rand = ()=>{
        s ^= s << 13;
        s ^= s >>> 17;
        s ^= s << 5;
        return (s >>> 0) / 4294967296;
    };
    for(let i = out.length - 1; i > 0; i--){
        const j = Math.floor(rand() * (i + 1));
        [out[i], out[j]] = [
            out[j],
            out[i]
        ];
    }
    return out;
}
function ToolsPageClient() {
    _s();
    const [q, setQ] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tag, setTag] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [sortMode, setSortMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("grouped");
    const [shuffleSeed, setShuffleSeed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ToolsPageClient.useState": ()=>Date.now()
    }["ToolsPageClient.useState"]);
    const [collapsedGroups, setCollapsedGroups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const groupKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ToolsPageClient.useMemo[groupKeys]": ()=>[
                ...GROUP_ORDER,
                "other"
            ]
    }["ToolsPageClient.useMemo[groupKeys]"], []);
    const allTags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ToolsPageClient.useMemo[allTags]": ()=>{
            const set = new Set();
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$tools$2f$tools$2e$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOOL_META"].forEach({
                "ToolsPageClient.useMemo[allTags]": (t)=>(t.tags ?? []).forEach({
                        "ToolsPageClient.useMemo[allTags]": (x)=>set.add(x)
                    }["ToolsPageClient.useMemo[allTags]"])
            }["ToolsPageClient.useMemo[allTags]"]);
            return [
                "all",
                ...Array.from(set).sort({
                    "ToolsPageClient.useMemo[allTags]": (a, b)=>a.localeCompare(b)
                }["ToolsPageClient.useMemo[allTags]"])
            ];
        }
    }["ToolsPageClient.useMemo[allTags]"], []);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ToolsPageClient.useMemo[filtered]": ()=>{
            const query = q.trim().toLowerCase();
            return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$tools$2f$tools$2e$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOOL_META"].filter({
                "ToolsPageClient.useMemo[filtered]": (t)=>{
                    const matchesQuery = !query || t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query) || (t.tags ?? []).some({
                        "ToolsPageClient.useMemo[filtered]": (x)=>x.toLowerCase().includes(query)
                    }["ToolsPageClient.useMemo[filtered]"]);
                    const matchesTag = tag === "all" || (t.tags ?? []).includes(tag);
                    return matchesQuery && matchesTag;
                }
            }["ToolsPageClient.useMemo[filtered]"]);
        }
    }["ToolsPageClient.useMemo[filtered]"], [
        q,
        tag
    ]);
    const flatSorted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ToolsPageClient.useMemo[flatSorted]": ()=>{
            const base = [
                ...filtered
            ];
            if (sortMode === "title") {
                return base.sort({
                    "ToolsPageClient.useMemo[flatSorted]": (a, b)=>a.title.localeCompare(b.title, undefined, {
                            sensitivity: "base"
                        })
                }["ToolsPageClient.useMemo[flatSorted]"]);
            }
            if (sortMode === "category") {
                return base.sort({
                    "ToolsPageClient.useMemo[flatSorted]": (a, b)=>{
                        const ga = pickGroup(a.tags);
                        const gb = pickGroup(b.tags);
                        const ra = ga === "other" ? 999 : GROUP_ORDER.indexOf(ga);
                        const rb = gb === "other" ? 999 : GROUP_ORDER.indexOf(gb);
                        if (ra !== rb) return ra - rb;
                        return a.title.localeCompare(b.title, undefined, {
                            sensitivity: "base"
                        });
                    }
                }["ToolsPageClient.useMemo[flatSorted]"]);
            }
            if (sortMode === "random") {
                return stableShuffle(base, shuffleSeed);
            }
            // grouped mode handled separately
            return base;
        }
    }["ToolsPageClient.useMemo[flatSorted]"], [
        filtered,
        sortMode,
        shuffleSeed
    ]);
    const grouped = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ToolsPageClient.useMemo[grouped]": ()=>{
            if (sortMode !== "grouped") return [];
            const buckets = new Map();
            for (const t of filtered){
                const g = pickGroup(t.tags);
                const arr = buckets.get(g) ?? [];
                arr.push(t);
                buckets.set(g, arr);
            }
            const groups = [];
            for (const g of GROUP_ORDER){
                const tools = buckets.get(g);
                if (!tools?.length) continue;
                groups.push({
                    key: g,
                    label: labelForGroup(g),
                    tools: tools.sort({
                        "ToolsPageClient.useMemo[grouped]": (a, b)=>a.title.localeCompare(b.title, undefined, {
                                sensitivity: "base"
                            })
                    }["ToolsPageClient.useMemo[grouped]"])
                });
            }
            const other = buckets.get("other");
            if (other?.length) {
                groups.push({
                    key: "other",
                    label: labelForGroup("other"),
                    tools: other.sort({
                        "ToolsPageClient.useMemo[grouped]": (a, b)=>a.title.localeCompare(b.title, undefined, {
                                sensitivity: "base"
                            })
                    }["ToolsPageClient.useMemo[grouped]"])
                });
            }
            return groups;
        }
    }["ToolsPageClient.useMemo[grouped]"], [
        filtered,
        sortMode
    ]);
    const shuffle = ()=>setShuffleSeed(Date.now());
    const toggleGroup = (key)=>{
        setCollapsedGroups((prev)=>({
                ...prev,
                [key]: !prev[key]
            }));
    };
    const setAllCollapsed = (value)=>{
        setCollapsedGroups(()=>{
            const next = {};
            groupKeys.forEach((key)=>{
                next[key] = value;
            });
            return next;
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:max-w-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiSearch"], {
                                className: "opacity-60"
                            }, void 0, false, {
                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: q,
                                onChange: (e)=>setQ(e.target.value),
                                placeholder: "Search tools…",
                                className: "w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                            }, void 0, false, {
                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                lineNumber: 249,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/tools/tools-page-client.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 sm:flex-row sm:items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: tag,
                                onChange: (e)=>setTag(e.target.value),
                                className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none",
                                children: allTags.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: t,
                                        children: t
                                    }, t, false, {
                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: sortMode,
                                        onChange: (e)=>setSortMode(e.target.value),
                                        className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "grouped",
                                                children: "Sort: Grouped"
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 276,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "title",
                                                children: "Sort: Title"
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 277,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "category",
                                                children: "Sort: Category"
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 278,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "random",
                                                children: "Sort: Random"
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 279,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                        lineNumber: 271,
                                        columnNumber: 13
                                    }, this),
                                    sortMode === "random" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: shuffle,
                                        className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10",
                                        children: "Shuffle"
                                    }, void 0, false, {
                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                        lineNumber: 283,
                                        columnNumber: 15
                                    }, this) : null,
                                    sortMode === "grouped" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setAllCollapsed(true),
                                                className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10",
                                                children: "Collapse all"
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 294,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setAllCollapsed(false),
                                                className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10",
                                                children: "Expand all"
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 301,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                        lineNumber: 293,
                                        columnNumber: 15
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                lineNumber: 270,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/tools/tools-page-client.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/tools/tools-page-client.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                children: [
                    sortMode === "grouped" ? grouped.map((group)=>{
                        const isCollapsed = collapsedGroups[group.key];
                        const groupStyle = GROUP_STYLES[group.key] ?? GROUP_STYLES.other;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "contents",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sm:col-span-2 lg:col-span-3",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>toggleGroup(group.key),
                                        className: "flex w-full items-center gap-3 text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiChevronDown"], {
                                                className: `text-white/60 transition-transform ${isCollapsed ? "-rotate-90" : "rotate-0"}`
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 327,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `h-2 w-2 rounded-full ${groupStyle.dot}`
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 332,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `text-xs font-semibold uppercase tracking-widest ${groupStyle.label}`,
                                                children: group.label
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 333,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `text-xs ${groupStyle.count}`,
                                                children: group.tools.length
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 338,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-px flex-1 bg-white/10"
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 341,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                        lineNumber: 322,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/tools/tools-page-client.tsx",
                                    lineNumber: 321,
                                    columnNumber: 19
                                }, this),
                                !isCollapsed ? group.tools.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/tools/${t.slug}`,
                                        className: `group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 pl-6 transition-colors hover:bg-white/10`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `absolute left-0 top-0 h-full w-1 ${GROUP_STYLES[pickGroup(t.tags)].bar}`
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 352,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-lg font-semibold",
                                                                children: t.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                                lineNumber: 357,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mt-2 text-sm text-white/70",
                                                                children: t.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                                lineNumber: 358,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                                        lineNumber: 356,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiArrowUpRight"], {
                                                        className: "mt-1 opacity-50 transition-opacity group-hover:opacity-100"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                                        lineNumber: 362,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 355,
                                                columnNumber: 27
                                            }, this),
                                            t.tags?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-4 flex flex-wrap gap-2",
                                                children: t.tags.map((x)=>{
                                                    const style = styleForTag(x);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `rounded-full border px-2 py-0.5 text-xs ${style.badge}`,
                                                        children: x
                                                    }, x, false, {
                                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                                        lineNumber: 370,
                                                        columnNumber: 35
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 366,
                                                columnNumber: 29
                                            }, this) : null
                                        ]
                                    }, t.slug, true, {
                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                        lineNumber: 347,
                                        columnNumber: 25
                                    }, this)) : null
                            ]
                        }, group.key, true, {
                            fileName: "[project]/app/tools/tools-page-client.tsx",
                            lineNumber: 320,
                            columnNumber: 17
                        }, this);
                    }) : flatSorted.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/tools/${t.slug}`,
                            className: "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 pl-6 transition-colors hover:bg-white/10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `absolute left-0 top-0 h-full w-1 ${GROUP_STYLES[pickGroup(t.tags)].bar}`
                                }, void 0, false, {
                                    fileName: "[project]/app/tools/tools-page-client.tsx",
                                    lineNumber: 392,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-lg font-semibold",
                                                    children: t.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/tools/tools-page-client.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2 text-sm text-white/70",
                                                    children: t.description
                                                }, void 0, false, {
                                                    fileName: "[project]/app/tools/tools-page-client.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/tools/tools-page-client.tsx",
                                            lineNumber: 396,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiArrowUpRight"], {
                                            className: "mt-1 opacity-50 transition-opacity group-hover:opacity-100"
                                        }, void 0, false, {
                                            fileName: "[project]/app/tools/tools-page-client.tsx",
                                            lineNumber: 400,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/tools/tools-page-client.tsx",
                                    lineNumber: 395,
                                    columnNumber: 17
                                }, this),
                                t.tags?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 flex flex-wrap gap-2",
                                    children: t.tags.map((x)=>{
                                        const style = styleForTag(x);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `rounded-full border px-2 py-0.5 text-xs ${style.badge}`,
                                            children: x
                                        }, x, false, {
                                            fileName: "[project]/app/tools/tools-page-client.tsx",
                                            lineNumber: 408,
                                            columnNumber: 25
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/tools/tools-page-client.tsx",
                                    lineNumber: 404,
                                    columnNumber: 19
                                }, this) : null
                            ]
                        }, t.slug, true, {
                            fileName: "[project]/app/tools/tools-page-client.tsx",
                            lineNumber: 387,
                            columnNumber: 15
                        }, this)),
                    (sortMode === "grouped" ? grouped.length === 0 : flatSorted.length === 0) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white/70",
                        children: "No tools match your search."
                    }, void 0, false, {
                        fileName: "[project]/app/tools/tools-page-client.tsx",
                        lineNumber: 422,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/app/tools/tools-page-client.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/tools/tools-page-client.tsx",
        lineNumber: 245,
        columnNumber: 5
    }, this);
}
_s(ToolsPageClient, "G/Gl/eGRuSDwIYC+dhAAbf5SU/U=");
_c = ToolsPageClient;
var _c;
__turbopack_context__.k.register(_c, "ToolsPageClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_tools_91d9856a._.js.map