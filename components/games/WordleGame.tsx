"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const RAW_WORDS = [
  "ABOUT",
  "ABOVE",
  "ACTOR",
  "ACUTE",
  "ADAPT",
  "ADULT",
  "AFTER",
  "AGENT",
  "AGREE",
  "AHEAD",
  "ALBUM",
  "ALERT",
  "ALIVE",
  "ALLOW",
  "ALONE",
  "ALONG",
  "ALTER",
  "AMONG",
  "ANGER",
  "ANGLE",
  "APPLE",
  "APPLY",
  "ARENA",
  "ARGUE",
  "ARISE",
  "ARRAY",
  "ASIDE",
  "ASSET",
  "AUDIO",
  "AVOID",
  "AWARD",
  "AWARE",
  "BADGE",
  "BASIC",
  "BATCH",
  "BEACH",
  "BEGIN",
  "BERRY",
  "BIRTH",
  "BLACK",
  "BLAME",
  "BLEND",
  "BLOOM",
  "BOARD",
  "BOOST",
  "BOUND",
  "BRAIN",
  "BRAND",
  "BRAVE",
  "BREAD",
  "BREAK",
  "BRICK",
  "BRIEF",
  "BRING",
  "BROAD",
  "BROWN",
  "BUILD",
  "BUILT",
  "CABLE",
  "CALM",
  "CARRY",
  "CATCH",
  "CAUSE",
  "CHAIN",
  "CHAIR",
  "CHART",
  "CHECK",
  "CHEST",
  "CHIEF",
  "CHILD",
  "CIVIL",
  "CLAIM",
  "CLASS",
  "CLEAN",
  "CLEAR",
  "CLERK",
  "CLOCK",
  "CLOSE",
  "COACH",
  "COAST",
  "COLOR",
  "COUNT",
  "COURT",
  "COVER",
  "CREAM",
  "CRIME",
  "CROSS",
  "CROWD",
  "CROWN",
  "DAILY",
  "DANCE",
  "DEALT",
  "DEATH",
  "DEBUG",
  "DELAY",
  "DEPTH",
  "DOING",
  "DOUBT",
  "DOZEN",
  "DRAFT",
  "DRAMA",
  "DRAWN",
  "DREAM",
  "DRESS",
  "DRINK",
  "DRIVE",
  "EARLY",
  "EARTH",
  "EIGHT",
  "ELITE",
  "EMPTY",
  "ENJOY",
  "ENTER",
  "EQUAL",
  "ERROR",
  "EVENT",
  "EVERY",
  "EXACT",
  "EXTRA",
  "FAITH",
  "FALSE",
  "FAULT",
  "FAVOR",
  "FIBER",
  "FIELD",
  "FIFTH",
  "FIGHT",
  "FINAL",
  "FIRST",
  "FIXED",
  "FLOOR",
  "FOCUS",
  "FORCE",
  "FRAME",
  "FRESH",
  "FRONT",
  "FRUIT",
  "FULLY",
  "FUNNY",
  "GIANT",
  "GLASS",
  "GLOBE",
  "GOING",
  "GRACE",
  "GRADE",
  "GRAND",
  "GRANT",
  "GRASS",
  "GREAT",
  "GREEN",
  "GROUP",
  "GUARD",
  "GUIDE",
  "HAPPY",
  "HARRY",
  "HEART",
  "HEAVY",
  "HONOR",
  "HORSE",
  "HOUSE",
  "HUMAN",
  "HUMOR",
  "IDEAL",
  "IMAGE",
  "INDEX",
  "INNER",
  "INPUT",
  "ISSUE",
  "JUDGE",
  "KNOWN",
  "LABEL",
  "LARGE",
  "LASER",
  "LATER",
  "LAUGH",
  "LAYER",
  "LEARN",
  "LEAST",
  "LEAVE",
  "LEGAL",
  "LEVEL",
  "LIGHT",
  "LIMIT",
  "LOCAL",
  "LOGIC",
  "LUNCH",
  "MAGIC",
  "MAJOR",
  "MAKER",
  "MARCH",
  "MATCH",
  "MAYBE",
  "METAL",
  "MODEL",
  "MONEY",
  "MONTH",
  "MORAL",
  "MOTOR",
  "MOUNT",
  "MOUSE",
  "MOUTH",
  "MOVIE",
  "MUSIC",
  "NERVE",
  "NEVER",
  "NIGHT",
  "NINTH",
  "NOISE",
  "NORTH",
  "NOVEL",
  "NURSE",
  "OCCUR",
  "OFFER",
  "OFTEN",
  "OPERA",
  "ORDER",
  "OTHER",
  "OUGHT",
  "OWNER",
  "PANEL",
  "PAPER",
  "PARTY",
  "PEACE",
  "PHASE",
  "PHONE",
  "PHOTO",
  "PIECE",
  "PILOT",
  "PITCH",
  "PLACE",
  "PLAIN",
  "PLANE",
  "PLANT",
  "PLATE",
  "POINT",
  "POWER",
  "PRESS",
  "PRICE",
  "PRIDE",
  "PRINT",
  "PRIZE",
  "PROOF",
  "PROUD",
  "PROVE",
  "QUEUE",
  "QUICK",
  "QUIET",
  "RADIO",
  "RAISE",
  "RANGE",
  "RAPID",
  "RATIO",
  "REACH",
  "READY",
  "REFER",
  "RIGHT",
  "RIVER",
  "ROUND",
  "ROUTE",
  "SCALE",
  "SCENE",
  "SCOPE",
  "SCORE",
  "SCOUT",
  "SEASON",
  "SECOND",
  "SENSE",
  "SERVE",
  "SEVEN",
  "SHARE",
  "SHARP",
  "SHELF",
  "SHIFT",
  "SHINE",
  "SHORT",
  "SIGHT",
  "SINCE",
  "SKILL",
  "SMART",
  "SMILE",
  "SOLID",
  "SOLVE",
  "SORRY",
  "SOUND",
  "SOUTH",
  "SPACE",
  "SPEAK",
  "SPEED",
  "SPEND",
  "SPICE",
  "SPITE",
  "SPORT",
  "STACK",
  "STAGE",
  "START",
  "STATE",
  "STEEL",
  "STICK",
  "STILL",
  "STOCK",
  "STONE",
  "STORE",
  "STORM",
  "STRIP",
  "STUDY",
  "STYLE",
  "SUGAR",
  "SUITE",
  "SUPER",
  "SWEET",
  "TABLE",
  "TAKEN",
  "TASTE",
  "TEACH",
  "THEME",
  "THING",
  "THINK",
  "THIRD",
  "THOSE",
  "THREE",
  "TIGHT",
  "TIMER",
  "TITLE",
  "TODAY",
  "TOPIC",
  "TOTAL",
  "TOUCH",
  "TOUGH",
  "TOWER",
  "TRACK",
  "TRADE",
  "TRIAL",
  "TRUST",
  "TRUTH",
  "TWICE",
  "UNDER",
  "UNION",
  "UNITY",
  "UNTIL",
  "UPPER",
  "URBAN",
  "USAGE",
  "USUAL",
  "VALID",
  "VALUE",
  "VIDEO",
  "VISIT",
  "VITAL",
  "VOICE",
  "WASTE",
  "WATCH",
  "WATER",
  "WEIGH",
  "WHITE",
  "WHOLE",
  "WOMAN",
  "WORLD",
  "WORTH",
  "WRITE",
  "YIELD",
  "YOUNG",
  "YOUTH",
];

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const EXTRA_WORDS = [
  "ACORN",
  "ADORE",
  "ADMIN",
  "ADMIT",
  "ADOPT",
  "ADORN",
  "AGILE",
  "ALARM",
  "ALBUM",
  "ALIEN",
  "ALLEY",
  "ALPHA",
  "AMBER",
  "AMUSE",
  "ANGEL",
  "ANKLE",
  "APPLE",
  "APRIL",
  "ARISE",
  "AROMA",
  "ARROW",
  "ASHES",
  "ATLAS",
  "AUDIO",
  "AUNTY",
  "AVAIL",
  "AWAKE",
  "AXIOM",
  "BADGE",
  "BAGEL",
  "BAKER",
  "BASIC",
  "BAYOU",
  "BEGAN",
  "BEGUN",
  "BEIGE",
  "BELLY",
  "BENDY",
  "BERRY",
  "BISON",
  "BLANK",
  "BLAST",
  "BLESS",
  "BLINK",
  "BLISS",
  "BLUNT",
  "BOOTH",
  "BORNE",
  "BOUND",
  "BOWED",
  "BOXER",
  "BRAIN",
  "BRAVE",
  "BRICK",
  "BRIDE",
  "BRISK",
  "BROAD",
  "BROKE",
  "BROOM",
  "BROWN",
  "BRUSH",
  "BUDDY",
  "BUNCH",
  "BURST",
  "BUYER",
  "CABIN",
  "CABLE",
  "CACAO",
  "CANDY",
  "CANOE",
  "CARRY",
  "CATCH",
  "CATER",
  "CAUSE",
  "CHAIN",
  "CHAIR",
  "CHALK",
  "CHARM",
  "CHART",
  "CHASE",
  "CHEAP",
  "CHEER",
  "CHEST",
  "CHICK",
  "CHIEF",
  "CHIME",
  "CHORD",
  "CHORE",
  "CIDER",
  "CIVIC",
  "CLEAN",
  "CLEAR",
  "CLICK",
  "CLIMB",
  "CLOCK",
  "CLOSE",
  "COAST",
  "COLOR",
  "COMET",
  "COUNT",
  "COURT",
  "CRANE",
  "CRASH",
  "CRAVE",
  "CRISP",
  "CROWD",
  "CRUMB",
  "CUBIC",
  "CURVE",
  "DAILY",
  "DAIRY",
  "DANCE",
  "DEALT",
  "DELAY",
  "DELTA",
  "DENSE",
  "DEPTH",
  "DIARY",
  "DIRTY",
  "DODGE",
  "DOING",
  "DONUT",
  "DOUBT",
  "DRAFT",
  "DRAIN",
  "DRAMA",
  "DRIFT",
  "DRINK",
  "DRIVE",
  "DROVE",
  "EARLY",
  "EARTH",
  "EIGHT",
  "ELBOW",
  "ELDER",
  "ELITE",
  "EMPTY",
  "ENJOY",
  "ENTER",
  "EQUAL",
  "EQUIP",
  "ERROR",
  "EVENT",
  "EVERY",
  "EXACT",
  "EXCEL",
  "EXTRA",
  "FAITH",
  "FALSE",
  "FAULT",
  "FENCE",
  "FIBER",
  "FIELD",
  "FINAL",
  "FIRST",
  "FLAME",
  "FLANK",
  "FLASH",
  "FLEET",
  "FLOUR",
  "FOCUS",
  "FORCE",
  "FORGE",
  "FRAME",
  "FRESH",
  "FRONT",
  "FROST",
  "FRUIT",
  "FUTON",
  "GHOST",
  "GIANT",
  "GLASS",
  "GLOBE",
  "GRACE",
  "GRADE",
  "GRAND",
  "GRASS",
  "GREET",
  "GROWN",
  "GUARD",
  "GUIDE",
  "HABIT",
  "HAPPY",
  "HARDY",
  "HASTE",
  "HEART",
  "HEAVY",
  "HONEY",
  "HONOR",
  "HORSE",
  "HOUSE",
  "HUMAN",
  "HUMOR",
  "IDEAL",
  "IMAGE",
  "INDEX",
  "INNER",
  "INPUT",
  "ISSUE",
  "JELLY",
  "JOKER",
  "JUICE",
  "JUMBO",
  "KARMA",
  "KNIFE",
  "KNOWN",
  "LABEL",
  "LASER",
  "LATER",
  "LAUGH",
  "LAYER",
  "LEARN",
  "LEAST",
  "LEMON",
  "LEVEL",
  "LIGHT",
  "LIMIT",
  "LOCAL",
  "LOGIC",
  "LOVER",
  "MAGIC",
  "MAJOR",
  "MAKER",
  "MAPLE",
  "MARCH",
  "MATCH",
  "MAYBE",
  "MEDAL",
  "METAL",
  "MIGHT",
  "MIXED",
  "MODEL",
  "MONEY",
  "MONTH",
  "MORAL",
  "MOTOR",
  "MOUNT",
  "MOUSE",
  "MOVIE",
  "MUSIC",
  "NACHO",
  "NERVE",
  "NEVER",
  "NIGHT",
  "NINJA",
  "NOISE",
  "NORTH",
  "NOVEL",
  "NURSE",
  "OASIS",
  "OCEAN",
  "OFFER",
  "OLIVE",
  "OPERA",
  "ORDER",
  "OTHER",
  "OUNCE",
  "OWNER",
  "PANEL",
  "PAPER",
  "PARTY",
  "PASTA",
  "PEACE",
  "PEARL",
  "PHASE",
  "PHONE",
  "PHOTO",
  "PIANO",
  "PIECE",
  "PILOT",
  "PITCH",
  "PLACE",
  "PLAIN",
  "PLANE",
  "PLANT",
  "PLATE",
  "POINT",
  "POWER",
  "PRESS",
  "PRICE",
  "PRIDE",
  "PRIME",
  "PRINT",
  "PRIZE",
  "PROOF",
  "PROUD",
  "PROVE",
  "PULSE",
  "QUEEN",
  "QUERY",
  "QUIET",
  "QUILT",
  "QUITE",
  "RADAR",
  "RADIO",
  "RAISE",
  "RANGE",
  "RAPID",
  "RATIO",
  "REACH",
  "READY",
  "RELIC",
  "REPLY",
  "RIGHT",
  "RIVER",
  "ROAST",
  "ROBOT",
  "ROUND",
  "ROUTE",
  "ROYAL",
  "RURAL",
  "SCALE",
  "SCENE",
  "SCOPE",
  "SCORE",
  "SCOUT",
  "SEEDY",
  "SENSE",
  "SERVE",
  "SEVEN",
  "SHADE",
  "SHAKE",
  "SHARE",
  "SHARP",
  "SHEEP",
  "SHELF",
  "SHIFT",
  "SHINE",
  "SHIRT",
  "SHOCK",
  "SHORE",
  "SHORT",
  "SIGHT",
  "SINCE",
  "SIXTH",
  "SKILL",
  "SLEEP",
  "SLICE",
  "SMALL",
  "SMART",
  "SMILE",
  "SMOKE",
  "SOLID",
  "SOLVE",
  "SOUND",
  "SPACE",
  "SPARK",
  "SPEAK",
  "SPEED",
  "SPEND",
  "SPICE",
  "SPIKE",
  "SPINE",
  "SPORT",
  "STACK",
  "STAGE",
  "STAIN",
  "STAMP",
  "START",
  "STATE",
  "STEAM",
  "STEEL",
  "STICK",
  "STILL",
  "STOCK",
  "STONE",
  "STORE",
  "STORM",
  "STRIP",
  "STYLE",
  "SUGAR",
  "SUPER",
  "SWEET",
  "TABLE",
  "TAKEN",
  "TASTE",
  "TEACH",
  "TEETH",
  "THEIR",
  "THERE",
  "THEME",
  "THICK",
  "THING",
  "THINK",
  "THIRD",
  "THOSE",
  "THREE",
  "TIGER",
  "TIMER",
  "TITLE",
  "TODAY",
  "TOPIC",
  "TOTAL",
  "TOUCH",
  "TOUGH",
  "TOWER",
  "TRACK",
  "TRADE",
  "TRAIL",
  "TRAIN",
  "TRICK",
  "TRIAL",
  "TRUST",
  "TRUTH",
  "TUTOR",
  "TWICE",
  "UNDER",
  "UNION",
  "UNITY",
  "UNTIL",
  "URBAN",
  "USAGE",
  "USUAL",
  "VALID",
  "VALUE",
  "VIDEO",
  "VIRAL",
  "VISIT",
  "VITAL",
  "VOICE",
  "VOTER",
  "WASTE",
  "WATCH",
  "WATER",
  "WEIGH",
  "WHALE",
  "WHEAT",
  "WHERE",
  "WHILE",
  "WHITE",
  "WHOLE",
  "WIDER",
  "WOMAN",
  "WORLD",
  "WORTH",
  "WRITE",
  "YIELD",
  "YOUNG",
  "YOUTH",
  "ZEBRA",
];

const ANSWER_WORDS = RAW_WORDS.filter((word) => word.length === WORD_LENGTH);
const ALLOWED_WORDS = Array.from(new Set([...ANSWER_WORDS, ...EXTRA_WORDS])).filter(
  (word) => word.length === WORD_LENGTH,
);

type LetterState = "correct" | "present" | "absent";

type Mode = "daily" | "practice";

const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function getDailyIndex() {
  const base = Date.UTC(2024, 0, 1);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.max(0, today - base);
  return Math.floor(diff / 86400000);
}

function getDailyWord() {
  const index = getDailyIndex() % ANSWER_WORDS.length;
  return ANSWER_WORDS[index] || ANSWER_WORDS[0];
}

function getRandomWord() {
  return ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)] || ANSWER_WORDS[0];
}

function evaluateGuess(guess: string, target: string) {
  const result: LetterState[] = Array(WORD_LENGTH).fill("absent");
  const targetChars = target.split("");
  const used: boolean[] = Array(WORD_LENGTH).fill(false);

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (result[i] !== "absent") continue;
    const letter = guess[i];
    let found = -1;
    for (let j = 0; j < WORD_LENGTH; j += 1) {
      if (!used[j] && targetChars[j] === letter) {
        found = j;
        break;
      }
    }
    if (found >= 0) {
      result[i] = "present";
      used[found] = true;
    }
  }

  return result;
}

export default function WordleGame() {
  const allowed = useMemo(() => new Set(ALLOWED_WORDS), []);
  const [mode, setMode] = useState<Mode>("daily");
  const [target, setTarget] = useState(() => getDailyWord());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<LetterState[][]>([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [message, setMessage] = useState("");
  const [strictDictionary, setStrictDictionary] = useState(false);

  const dayLabel = useMemo(() => new Date().toLocaleDateString(), []);

  const resetGame = useCallback((nextTarget: string) => {
    setTarget(nextTarget);
    setGuesses([]);
    setEvaluations([]);
    setCurrent("");
    setStatus("playing");
    setMessage("");
  }, []);

  useEffect(() => {
    if (mode === "daily") {
      resetGame(getDailyWord());
    } else {
      resetGame(getRandomWord());
    }
  }, [mode, resetGame]);

  const addLetter = useCallback((letter: string) => {
    if (status !== "playing") return;
    setCurrent((prev) => (prev.length < WORD_LENGTH ? prev + letter : prev));
  }, [status]);

  const removeLetter = useCallback(() => {
    if (status !== "playing") return;
    setCurrent((prev) => prev.slice(0, -1));
  }, [status]);

  const submitGuess = useCallback(() => {
    if (status !== "playing") return;
    if (current.length < WORD_LENGTH) {
      setMessage("Not enough letters.");
      return;
    }
    const isValidFormat = /^[A-Z]{5}$/.test(current);
    if (!isValidFormat) {
      setMessage("Use 5 letters A–Z.");
      return;
    }

    const isKnown = allowed.has(current);
    if (!isKnown && strictDictionary) {
      setMessage("Not in word list.");
      return;
    }

    const nextGuesses = [...guesses, current];
    const nextEval = [...evaluations, evaluateGuess(current, target)];
    setGuesses(nextGuesses);
    setEvaluations(nextEval);
    setCurrent("");
    setMessage(isKnown ? "" : "Not in list, but accepted.");

    if (current === target) {
      setStatus("won");
      return;
    }

    if (nextGuesses.length >= MAX_GUESSES) {
      setStatus("lost");
    }
  }, [allowed, current, evaluations, guesses, status, target]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (status !== "playing") return;
      const key = event.key.toUpperCase();
      if (key === "ENTER") {
        event.preventDefault();
        submitGuess();
        return;
      }
      if (key === "BACKSPACE") {
        event.preventDefault();
        removeLetter();
        return;
      }
      if (/^[A-Z]$/.test(key)) {
        event.preventDefault();
        addLetter(key);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [addLetter, removeLetter, status, submitGuess]);

  const keyStatuses = useMemo(() => {
    const map: Record<string, LetterState> = {};
    evaluations.forEach((row, rowIndex) => {
      const guess = guesses[rowIndex] || "";
      row.forEach((state, index) => {
        const letter = guess[index];
        if (!letter) return;
        const prev = map[letter];
        if (prev === "correct") return;
        if (prev === "present" && state === "absent") return;
        map[letter] = state;
      });
    });
    return map;
  }, [evaluations, guesses]);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 shadow-sm dark:border-white/10 dark:bg-grey-900/60">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-500" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h2 className="text-xl font-semibold">Word Grid</h2>
          <p className="text-xs text-black/60 dark:text-white/60">
            {mode === "daily" ? `Daily puzzle · ${dayLabel}` : "Practice mode"}
          </p>
        </div>
        <select
          value={mode}
          onChange={(event) => setMode(event.target.value as Mode)}
          className="rounded-xl border border-gray-300/70 bg-white px-3 py-2 text-sm dark:border-white/20 dark:bg-grey-900"
        >
          <option value="daily">Daily</option>
          <option value="practice">Practice</option>
        </select>
        <label className="inline-flex items-center gap-2 text-xs text-black/60 dark:text-white/60">
          <input
            type="checkbox"
            checked={strictDictionary}
            onChange={(event) => setStrictDictionary(event.target.checked)}
          />
          Strict dictionary
        </label>
        {mode === "practice" ? (
          <button
            type="button"
            onClick={() => resetGame(getRandomWord())}
            className="rounded-xl bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            New word
          </button>
        ) : null}
      </div>

        <div className="mt-5 grid gap-2">
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
          const guess = guesses[rowIndex] || "";
          const evalRow = evaluations[rowIndex];
          const isCurrent = rowIndex === guesses.length;

          return (
            <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-2">
              {Array.from({ length: WORD_LENGTH }).map((__, colIndex) => {
                const letter = isCurrent
                  ? (current[colIndex] || "")
                  : (guess[colIndex] || "");
                const state = evalRow?.[colIndex];

                const base =
                  "flex h-12 items-center justify-center rounded-xl border text-lg font-semibold uppercase";

                const stateClass = state
                  ? state === "correct"
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : state === "present"
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-gray-400 bg-gray-400 text-white"
                  : "border-gray-300 bg-white dark:border-white/20 dark:bg-grey-900";

                return (
                  <div key={`cell-${rowIndex}-${colIndex}`} className={`${base} ${stateClass}`}>
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

        <div className="mt-4 min-h-[20px] text-sm text-black/70 dark:text-white/70">
          {message}
          {status === "won" ? "Nice! You solved it." : null}
          {status === "lost" ? `The word was ${target}.` : null}
        </div>

        <div className="mt-4 space-y-2">
          {KEY_ROWS.map((row, rowIndex) => (
            <div key={row} className="flex justify-center gap-1">
              {rowIndex === 2 ? (
                <button
                  type="button"
                  onClick={submitGuess}
                  className="rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-xs font-semibold uppercase dark:border-white/20 dark:bg-grey-900"
                >
                  Enter
                </button>
              ) : null}

              {row.split("").map((letter) => {
                const state = keyStatuses[letter];
                const keyClass = state
                  ? state === "correct"
                    ? "bg-emerald-500 text-white"
                    : state === "present"
                    ? "bg-amber-500 text-white"
                    : "bg-gray-400 text-white"
                  : "bg-gray-200 text-black dark:bg-grey-800 dark:text-white";

                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => addLetter(letter)}
                    className={`h-10 w-9 rounded-lg text-sm font-semibold ${keyClass}`}
                  >
                    {letter}
                  </button>
                );
              })}

              {rowIndex === 2 ? (
                <button
                  type="button"
                  onClick={removeLetter}
                  className="rounded-lg border border-gray-300/70 bg-white px-2 py-2 text-xs font-semibold uppercase dark:border-white/20 dark:bg-grey-900"
                >
                  Delete
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
