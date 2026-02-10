"use client";

import { useEffect, useState } from "react";
import ToolShell from "./_ToolShell";
import { formatBytes } from "./tool-utils";

type IconItem = {
  name: string;
  url: string;
  size: number;
};

export default function IconPackPreviewer() {
  const [icons, setIcons] = useState<IconItem[]>([]);
  const [iconSize, setIconSize] = useState(72);

  useEffect(() => {
    return () => {
      icons.forEach((icon) => URL.revokeObjectURL(icon.url));
    };
  }, [icons]);

  const handleFiles = (files: FileList | null) => {
    icons.forEach((icon) => URL.revokeObjectURL(icon.url));
    if (!files?.length) {
      setIcons([]);
      return;
    }
    const next: IconItem[] = Array.from(files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    }));
    setIcons(next);
  };

  return (
    <ToolShell
      title="Icon Pack Previewer"
      description="Preview a set of SVG/PNG icons with adjustable sizing."
    >
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/svg+xml,image/png"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
          className="block text-sm"
        />

        <label className="text-sm text-white/70">
          Icon size
          <input
            type="number"
            min={32}
            max={160}
            value={iconSize}
            onChange={(event) => setIconSize(Number(event.target.value) || 72)}
            className="ml-2 w-20 rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-sm outline-none"
          />
        </label>
      </div>

      {icons.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {icons.map((icon) => (
            <div
              key={icon.url}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div
                className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5"
                style={{ width: iconSize, height: iconSize }}
              >
                <img
                  src={icon.url}
                  alt={icon.name}
                  className="max-h-full max-w-full"
                />
              </div>
              <div className="text-xs text-white/70">
                <div>{icon.name}</div>
                <div className="text-[11px] text-white/50">{formatBytes(icon.size)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </ToolShell>
  );
}
