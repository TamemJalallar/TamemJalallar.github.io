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
        slug: "pdf-to-images",
        title: "PDF to Images",
        description: "Convert each PDF page to PNG.",
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
    // Text
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
    // Conversions
    {
        slug: "unit-converter",
        title: "Unit Converter",
        description: "Length/weight/temp conversions.",
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
    const groupedRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ToolsPageClient.useMemo[groupedRows]": ()=>{
            if (sortMode !== "grouped") return [];
            // bucket tools by group
            const buckets = new Map();
            for (const t of filtered){
                const g = pickGroup(t.tags);
                const arr = buckets.get(g) ?? [];
                arr.push(t);
                buckets.set(g, arr);
            }
            // Build rows in GROUP_ORDER
            const rows = [];
            for (const g of GROUP_ORDER){
                const tools = buckets.get(g);
                if (!tools?.length) continue;
                rows.push({
                    kind: "header",
                    key: g,
                    label: labelForGroup(g)
                });
                tools.sort({
                    "ToolsPageClient.useMemo[groupedRows]": (a, b)=>a.title.localeCompare(b.title, undefined, {
                            sensitivity: "base"
                        })
                }["ToolsPageClient.useMemo[groupedRows]"]).forEach({
                    "ToolsPageClient.useMemo[groupedRows]": (tool)=>rows.push({
                            kind: "tool",
                            tool
                        })
                }["ToolsPageClient.useMemo[groupedRows]"]);
            }
            // "other" at the end
            const other = buckets.get("other");
            if (other?.length) {
                rows.push({
                    kind: "header",
                    key: "other",
                    label: labelForGroup("other")
                });
                other.sort({
                    "ToolsPageClient.useMemo[groupedRows]": (a, b)=>a.title.localeCompare(b.title, undefined, {
                            sensitivity: "base"
                        })
                }["ToolsPageClient.useMemo[groupedRows]"]).forEach({
                    "ToolsPageClient.useMemo[groupedRows]": (tool)=>rows.push({
                            kind: "tool",
                            tool
                        })
                }["ToolsPageClient.useMemo[groupedRows]"]);
            }
            return rows;
        }
    }["ToolsPageClient.useMemo[groupedRows]"], [
        filtered,
        sortMode
    ]);
    const shuffle = ()=>setShuffleSeed(Date.now());
    // Render either grouped rows or the flat list
    const rowsToRender = sortMode === "grouped" ? groupedRows : flatSorted.map((t)=>({
            kind: "tool",
            tool: t
        }));
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
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: q,
                                onChange: (e)=>setQ(e.target.value),
                                placeholder: "Search tools…",
                                className: "w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                            }, void 0, false, {
                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/tools/tools-page-client.tsx",
                        lineNumber: 162,
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
                                        lineNumber: 179,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                lineNumber: 173,
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
                                                lineNumber: 191,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "title",
                                                children: "Sort: Title"
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 192,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "category",
                                                children: "Sort: Category"
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 193,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "random",
                                                children: "Sort: Random"
                                            }, void 0, false, {
                                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                                lineNumber: 194,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                        lineNumber: 186,
                                        columnNumber: 13
                                    }, this),
                                    sortMode === "random" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: shuffle,
                                        className: "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:bg-white/10",
                                        children: "Shuffle"
                                    }, void 0, false, {
                                        fileName: "[project]/app/tools/tools-page-client.tsx",
                                        lineNumber: 198,
                                        columnNumber: 15
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                lineNumber: 185,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/tools/tools-page-client.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/tools/tools-page-client.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                children: [
                    rowsToRender.map((row, idx)=>{
                        if (row.kind === "header") {
                            // span full width across grid
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sm:col-span-2 lg:col-span-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs tracking-widest text-white/50 font-semibold uppercase",
                                            children: row.label
                                        }, void 0, false, {
                                            fileName: "[project]/app/tools/tools-page-client.tsx",
                                            lineNumber: 220,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-px flex-1 bg-white/10"
                                        }, void 0, false, {
                                            fileName: "[project]/app/tools/tools-page-client.tsx",
                                            lineNumber: 223,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/tools/tools-page-client.tsx",
                                    lineNumber: 219,
                                    columnNumber: 17
                                }, this)
                            }, `hdr-${row.key}-${idx}`, false, {
                                fileName: "[project]/app/tools/tools-page-client.tsx",
                                lineNumber: 215,
                                columnNumber: 15
                            }, this);
                        }
                        const t = row.tool;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/tools/${t.slug}`,
                            className: "group rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10",
                            children: [
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
                                                    lineNumber: 238,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-2 text-sm text-white/70",
                                                    children: t.description
                                                }, void 0, false, {
                                                    fileName: "[project]/app/tools/tools-page-client.tsx",
                                                    lineNumber: 239,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/tools/tools-page-client.tsx",
                                            lineNumber: 237,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiArrowUpRight"], {
                                            className: "mt-1 opacity-50 transition-opacity group-hover:opacity-100"
                                        }, void 0, false, {
                                            fileName: "[project]/app/tools/tools-page-client.tsx",
                                            lineNumber: 241,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/tools/tools-page-client.tsx",
                                    lineNumber: 236,
                                    columnNumber: 15
                                }, this),
                                t.tags?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 flex flex-wrap gap-2",
                                    children: t.tags.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-xs text-white/70",
                                            children: x
                                        }, x, false, {
                                            fileName: "[project]/app/tools/tools-page-client.tsx",
                                            lineNumber: 247,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/tools/tools-page-client.tsx",
                                    lineNumber: 245,
                                    columnNumber: 17
                                }, this) : null
                            ]
                        }, t.slug, true, {
                            fileName: "[project]/app/tools/tools-page-client.tsx",
                            lineNumber: 231,
                            columnNumber: 13
                        }, this);
                    }),
                    rowsToRender.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white/70",
                        children: "No tools match your search."
                    }, void 0, false, {
                        fileName: "[project]/app/tools/tools-page-client.tsx",
                        lineNumber: 261,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/app/tools/tools-page-client.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/tools/tools-page-client.tsx",
        lineNumber: 160,
        columnNumber: 5
    }, this);
}
_s(ToolsPageClient, "3YPQ6qKJE47nZ5OpdqdlAG2+oHY=");
_c = ToolsPageClient;
var _c;
__turbopack_context__.k.register(_c, "ToolsPageClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_tools_91d9856a._.js.map