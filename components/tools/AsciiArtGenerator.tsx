"use client";

import React, { useMemo, useState } from "react";
import ToolShell from "./_ToolShell";

const FONT: Record<string, string[]> = {
  "A": ["  /\\  ", " /  \\ ", "/_/\\_\\", "|    |", "|    |"],
  "B": ["|---\\ ", "|---/ ", "|---\\ ", "|    |", "|---/ "],
  "C": [" /---", "|    ", "|    ", "|    ", " \\---"],
  "D": ["|---\\ ", "|    |", "|    |", "|    |", "|---/ "],
  "E": ["|----", "|    ", "|--- ", "|    ", "|----"],
  "F": ["|----", "|    ", "|--- ", "|    ", "|    "],
  "G": [" /---", "|    ", "|  --", "|   |", " \\--/"],
  "H": ["|   |", "|   |", "|---|", "|   |", "|   |"],
  "I": ["|---|", "  |  ", "  |  ", "  |  ", "|---|"],
  "J": ["  ---|", "    | ", "    | ", "|   | ", " \\--  "],
  "K": ["|  / ", "| /  ", "|<   ", "| \\  ", "|  \\ "],
  "L": ["|    ", "|    ", "|    ", "|    ", "|----"],
  "M": ["|\\  /|", "| \\/ |", "|    |", "|    |", "|    |"],
  "N": ["|\\   |", "| \\  |", "|  \\ |", "|   \\|", "|    |"],
  "O": [" /--\\ ", "|    |", "|    |", "|    |", " \\--/ "],
  "P": ["|---\\ ", "|    |", "|---/ ", "|     ", "|     "],
  "Q": [" /--\\ ", "|    |", "|    |", "|  \\ |", " \\-\\_/"],
  "R": ["|---\\ ", "|    |", "|---/ ", "|  \\  ", "|   \\ "],
  "S": [" \\---", "     |", "  --- ", "|     ", "---/  "],
  "T": ["|-----|", "   |   ", "   |   ", "   |   ", "   |   "],
  "U": ["|    |", "|    |", "|    |", "|    |", " \\--/ "],
  "V": ["|    |", "|    |", "|    |", " \\  / ", "  \\/  "],
  "W": ["|    |", "|    |", "|    |", "| /\\ |", "|/  \\|"],
  "X": ["\\   /", " \\ / ", "  X  ", " / \\ ", "/   \\"],
  "Y": ["\\   /", " \\ / ", "  |  ", "  |  ", "  |  "],
  "Z": ["-----/", "   /  ", "  /   ", " /    ", "/-----"],
  "0": [" /--\\ ", "|  / |", "| /  |", "|/   |", " \\--/ "],
  "1": ["  /| ", "   | ", "   | ", "   | ", "  _|_"],
  "2": [" /--\\", "    |", " /-- ", "|    ", "\\----"],
  "3": [" /--\\", "    |", "  --<", "    |", " \\--/"],
  "4": ["|   |", "|   |", "|---|", "    |", "    |"],
  "5": ["|----", "|    ", "|---\\", "    |", "\\---/"],
  "6": [" /---", "|    ", "|---\\", "|   |", " \\--/"],
  "7": ["-----|", "   /  ", "  /   ", " /    ", "/     "],
  "8": [" /--\\ ", "|    |", " \\--/ ", "|    |", " \\--/ "],
  "9": [" /--\\ ", "|   |", " \\--|", "    |", " ---/ "],
  " ": ["  ", "  ", "  ", "  ", "  "],
  "?": [" /--\\ ", "    | ", "  --  ", "      ", "  --  "],
};

function renderAscii(text: string) {
  const chars = text.toUpperCase().split("");
  const lines = ["", "", "", "", ""];
  for (const ch of chars) {
    const glyph = FONT[ch] ?? FONT["?"];
    for (let i = 0; i < lines.length; i++) {
      lines[i] += glyph[i] + "  ";
    }
  }
  return lines.join("\n");
}

export default function AsciiArtGenerator() {
  const [text, setText] = useState("TOMFROMIT");

  const out = useMemo(() => renderAscii(text.slice(0, 24)), [text]);

  const copy = async () => navigator.clipboard.writeText(out);

  return (
    <ToolShell title="ASCII Art Generator" description="Turn text into a big ASCII banner.">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none"
        placeholder="Type text…"
      />

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 overflow-auto">
        <pre className="font-mono text-sm text-white/80 whitespace-pre">{out}</pre>
      </div>

      <button onClick={copy} className="mt-4 rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
        Copy ASCII
      </button>
    </ToolShell>
  );
}
