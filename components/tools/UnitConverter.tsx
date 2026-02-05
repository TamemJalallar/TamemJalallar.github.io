"use client";

import { useMemo, useState } from "react";

type Category = "length" | "weight" | "temperature" | "volume" | "area" | "speed";

type UnitMap = Record<string, number>;

const UNITS: Record<Exclude<Category, "temperature">, UnitMap> = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.344,
  },
  weight: {
    kilogram: 1,
    gram: 0.001,
    pound: 0.45359237,
    ounce: 0.028349523125,
    ton: 1000,
  },
  volume: {
    liter: 1,
    milliliter: 0.001,
    gallon: 3.785411784,
    quart: 0.946352946,
    pint: 0.473176473,
    cup: 0.2365882365,
  },
  area: {
    "square-meter": 1,
    "square-kilometer": 1_000_000,
    "square-foot": 0.09290304,
    "square-yard": 0.83612736,
    acre: 4046.8564224,
    hectare: 10_000,
  },
  speed: {
    "meter-per-second": 1,
    "kilometer-per-hour": 0.2777777778,
    mph: 0.44704,
    knot: 0.514444,
  },
};

const TEMPERATURE_UNITS = ["celsius", "fahrenheit", "kelvin"] as const;

function fromCelsius(value: number, unit: string) {
  if (unit === "celsius") return value;
  if (unit === "fahrenheit") return value * (9 / 5) + 32;
  return value + 273.15;
}

function toCelsius(value: number, unit: string) {
  if (unit === "celsius") return value;
  if (unit === "fahrenheit") return (value - 32) * (5 / 9);
  return value - 273.15;
}

function prettifyUnit(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("kilometer");
  const [amount, setAmount] = useState("1");

  const availableUnits = useMemo(() => {
    if (category === "temperature") return [...TEMPERATURE_UNITS];
    return Object.keys(UNITS[category]);
  }, [category]);

  const result = useMemo(() => {
    const numeric = Number(amount);
    if (!Number.isFinite(numeric)) return "";

    if (category === "temperature") {
      const celsius = toCelsius(numeric, fromUnit);
      const converted = fromCelsius(celsius, toUnit);
      return converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }

    const units = UNITS[category];
    const fromFactor = units[fromUnit];
    const toFactor = units[toUnit];

    if (!fromFactor || !toFactor) return "";

    const baseValue = numeric * fromFactor;
    const converted = baseValue / toFactor;
    return converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [amount, category, fromUnit, toUnit]);

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white/70 p-6 dark:border-white/10 dark:bg-grey-900/60">
      <h2 className="text-lg font-semibold">Unit Converter</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <label className="text-xs text-black/60 dark:text-white/60">
          Category
          <select
            value={category}
            onChange={(event) => {
              const nextCategory = event.target.value as Category;
              const nextUnits =
                nextCategory === "temperature"
                  ? [...TEMPERATURE_UNITS]
                  : Object.keys(UNITS[nextCategory as Exclude<Category, "temperature">]);

              setCategory(nextCategory);
              setFromUnit(nextUnits[0] || "");
              setToUnit(nextUnits[1] || nextUnits[0] || "");
            }}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            <option value="length">Length</option>
            <option value="weight">Weight</option>
            <option value="temperature">Temperature</option>
            <option value="volume">Volume</option>
            <option value="area">Area</option>
            <option value="speed">Speed</option>
          </select>
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          Value
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          />
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          From
          <select
            value={fromUnit}
            onChange={(event) => setFromUnit(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            {availableUnits.map((unit) => (
              <option key={unit} value={unit}>
                {prettifyUnit(unit)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-black/60 dark:text-white/60">
          To
          <select
            value={toUnit}
            onChange={(event) => setToUnit(event.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
          >
            {availableUnits.map((unit) => (
              <option key={unit} value={unit}>
                {prettifyUnit(unit)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200/80 bg-white/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-grey-900/70">
        <span className="text-black/60 dark:text-white/60">Result: </span>
        <span className="font-semibold">
          {result || "-"} {toUnit ? prettifyUnit(toUnit) : ""}
        </span>
      </div>
    </div>
  );
}
