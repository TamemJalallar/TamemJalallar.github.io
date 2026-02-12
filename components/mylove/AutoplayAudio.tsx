"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AutoplayAudioProps = {
  src: string;
  label?: string;
};

export default function AutoplayAudio({ src, label = "Play song" }: AutoplayAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [needsUserAction, setNeedsUserAction] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = async () => {
      try {
        await audio.play();
        setNeedsUserAction(false);
        setIsPlaying(true);
      } catch {
        setNeedsUserAction(true);
        setIsPlaying(false);
      }
    };

    tryPlay();
  }, [src]);

  useEffect(() => {
    if (!needsUserAction) return;
    const audio = audioRef.current;
    if (!audio) return;

    const resumeOnFirstGesture = async () => {
      try {
        await audio.play();
        setNeedsUserAction(false);
      } catch {
        // Still blocked, keep the button visible.
      }
    };

    document.addEventListener("pointerdown", resumeOnFirstGesture, { once: true });
    document.addEventListener("keydown", resumeOnFirstGesture, { once: true });

    return () => {
      document.removeEventListener("pointerdown", resumeOnFirstGesture);
      document.removeEventListener("keydown", resumeOnFirstGesture);
    };
  }, [needsUserAction]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setNeedsUserAction(false);
      } catch {
        setNeedsUserAction(true);
      }
      return;
    }

    audio.pause();
  }, []);

  return (
    <div>
      <audio
        ref={audioRef}
        src={src}
        autoPlay
        preload="auto"
        playsInline
        className="hidden"
      />
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={togglePlayback}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold text-white opacity-70 shadow-lg backdrop-blur transition hover:bg-black/80 hover:opacity-100"
          aria-label={isPlaying ? "Pause song" : "Play song"}
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] uppercase tracking-wide">
            {isPlaying ? "||" : ">"}
          </span>
          <span className="transition opacity-70 group-hover:opacity-100">
            {needsUserAction || !isPlaying ? label : "Pause"}
          </span>
        </button>
      </div>
    </div>
  );
}
