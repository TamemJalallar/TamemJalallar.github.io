"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Vec = { x: number; y: number };

type Obstacle = { x: number; y: number; w: number; h: number };

type Level = {
  name: string;
  start: Vec;
  hole: Vec;
  obstacles: Obstacle[];
};

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 420;
const BALL_RADIUS = 10;

const LEVELS: Level[] = [
  {
    name: "Meadow",
    start: { x: 80, y: 320 },
    hole: { x: 620, y: 100 },
    obstacles: [
      { x: 280, y: 180, w: 80, h: 120 },
      { x: 430, y: 60, w: 60, h: 200 },
    ],
  },
  {
    name: "Switchback",
    start: { x: 80, y: 80 },
    hole: { x: 640, y: 320 },
    obstacles: [
      { x: 180, y: 140, w: 320, h: 40 },
      { x: 180, y: 240, w: 320, h: 40 },
      { x: 520, y: 100, w: 40, h: 200 },
    ],
  },
  {
    name: "Corner",
    start: { x: 100, y: 300 },
    hole: { x: 600, y: 80 },
    obstacles: [
      { x: 180, y: 90, w: 60, h: 260 },
      { x: 260, y: 250, w: 260, h: 60 },
      { x: 480, y: 90, w: 60, h: 160 },
    ],
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function length(vec: Vec) {
  return Math.hypot(vec.x, vec.y);
}

function normalize(vec: Vec) {
  const len = length(vec);
  if (len === 0) return { x: 0, y: 0 };
  return { x: vec.x / len, y: vec.y / len };
}

export default function PocketGolfGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [ball, setBall] = useState<Vec>(LEVELS[0]?.start ?? { x: 0, y: 0 });
  const [velocity, setVelocity] = useState<Vec>({ x: 0, y: 0 });
  const [aiming, setAiming] = useState(false);
  const [aimPoint, setAimPoint] = useState<Vec | null>(null);
  const [strokes, setStrokes] = useState(0);
  const [finished, setFinished] = useState(false);

  const level = LEVELS[levelIndex] ?? LEVELS[0];

  const maxPower = 22;

  useEffect(() => {
    setBall(level.start);
    setVelocity({ x: 0, y: 0 });
    setAimPoint(null);
    setAiming(false);
    setStrokes(0);
    setFinished(false);
  }, [level]);

  const isMoving = useMemo(() => length(velocity) > 0.05, [velocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#0b3b2e";
      ctx.fillRect(12, 12, CANVAS_WIDTH - 24, CANVAS_HEIGHT - 24);

      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 12, CANVAS_WIDTH - 24, CANVAS_HEIGHT - 24);

      level.obstacles.forEach((obs) => {
        ctx.fillStyle = "#0f2f4f";
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      });

      ctx.beginPath();
      ctx.arc(level.hole.x, level.hole.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#020617";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(level.hole.x, level.hole.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a";
      ctx.fill();

      if (aiming && aimPoint && !isMoving) {
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(aimPoint.x, aimPoint.y);
        ctx.stroke();

        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath();
        ctx.arc(aimPoint.x, aimPoint.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    };

    render();
  }, [aiming, aimPoint, ball, isMoving, level]);

  useEffect(() => {
    const step = () => {
      setBall((prevBall) => {
        let nextBall = { ...prevBall };
        let nextVelocity = { ...velocity };

        if (length(nextVelocity) > 0.02) {
          nextBall = {
            x: nextBall.x + nextVelocity.x,
            y: nextBall.y + nextVelocity.y,
          };

          nextVelocity = { x: nextVelocity.x * 0.98, y: nextVelocity.y * 0.98 };

          const minX = 12 + BALL_RADIUS;
          const maxX = CANVAS_WIDTH - 12 - BALL_RADIUS;
          const minY = 12 + BALL_RADIUS;
          const maxY = CANVAS_HEIGHT - 12 - BALL_RADIUS;

          if (nextBall.x < minX || nextBall.x > maxX) {
            nextVelocity.x *= -0.8;
            nextBall.x = clamp(nextBall.x, minX, maxX);
          }
          if (nextBall.y < minY || nextBall.y > maxY) {
            nextVelocity.y *= -0.8;
            nextBall.y = clamp(nextBall.y, minY, maxY);
          }

          level.obstacles.forEach((obs) => {
            const closestX = clamp(nextBall.x, obs.x, obs.x + obs.w);
            const closestY = clamp(nextBall.y, obs.y, obs.y + obs.h);
            const dx = nextBall.x - closestX;
            const dy = nextBall.y - closestY;
            const dist = Math.hypot(dx, dy);

            if (dist < BALL_RADIUS && dist > 0) {
              const normal = normalize({ x: dx, y: dy });
              nextBall.x = closestX + normal.x * BALL_RADIUS;
              nextBall.y = closestY + normal.y * BALL_RADIUS;
              const dot = nextVelocity.x * normal.x + nextVelocity.y * normal.y;
              nextVelocity.x = nextVelocity.x - 2 * dot * normal.x;
              nextVelocity.y = nextVelocity.y - 2 * dot * normal.y;
              nextVelocity.x *= 0.8;
              nextVelocity.y *= 0.8;
            }
          });

          const holeDist = Math.hypot(nextBall.x - level.hole.x, nextBall.y - level.hole.y);
          if (holeDist < 12 && length(nextVelocity) < 1.2) {
            nextBall = { ...level.hole };
            nextVelocity = { x: 0, y: 0 };
            setFinished(true);
          }

          setVelocity(nextVelocity);
        } else if (length(velocity) > 0) {
          setVelocity({ x: 0, y: 0 });
        }

        return nextBall;
      });

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [level, velocity]);

  const handlePointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isMoving || finished) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;

    setAimPoint({ x, y });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (isMoving || finished) return;
    setAiming(true);
    handlePointer(event);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!aiming || isMoving || finished) {
      setAiming(false);
      return;
    }
    handlePointer(event);
    if (!aimPoint) return;

    const dir = { x: ball.x - aimPoint.x, y: ball.y - aimPoint.y };
    const power = clamp(length(dir) / 12, 0, maxPower);
    const norm = normalize(dir);
    setVelocity({ x: norm.x * power, y: norm.y * power });
    setStrokes((prev) => prev + 1);
    setAiming(false);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 dark:border-white/10 dark:bg-grey-900/60">
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-lime-400 to-teal-500" />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="mr-auto">
            <h2 className="text-xl font-semibold">Pocket Golf</h2>
            <p className="text-xs text-black/60 dark:text-white/60">
              Hole {levelIndex + 1} · {level.name}
            </p>
          </div>
          <div className="text-sm text-black/70 dark:text-white/70">Strokes: {strokes}</div>
          <button
            type="button"
            onClick={() => setLevelIndex((prev) => (prev + 1) % LEVELS.length)}
            className="rounded-xl bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            Next hole
          </button>
        </div>

        <div className="mt-5">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointer}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => setAiming(false)}
            className="w-full rounded-2xl border border-white/10 bg-slate-900"
          />
        </div>

        <div className="mt-4 text-sm text-black/70 dark:text-white/70">
          {finished ? "Nice! You sank the putt." : "Click and drag to aim. Release to shoot."}
        </div>
      </div>
    </div>
  );
}
