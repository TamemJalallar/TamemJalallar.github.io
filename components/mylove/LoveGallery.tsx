"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type GalleryImage = {
  src: string;
  alt: string;
};

type LoveGalleryProps = {
  images: GalleryImage[];
};

export default function LoveGallery({ images }: LoveGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const activeImage = useMemo(
    () => (activeIndex === null ? null : images[activeIndex]),
    [activeIndex, images]
  );

  const openImage = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const closeImage = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  const scrollScroller = useCallback((direction: "prev" | "next") => {
    if (!scrollerRef.current) return;
    const distance = Math.min(scrollerRef.current.clientWidth * 0.8, 480);
    scrollerRef.current.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeImage();
      }
      if (event.key === "ArrowLeft") {
        showPrev();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, closeImage, showNext, showPrev]);

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Photo Scroller</p>
          <p className="text-xs text-white/60">
            Swipe or use the arrows to scroll through memories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollScroller("prev")}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => scrollScroller("next")}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10"
          >
            Next
          </button>
        </div>
      </div>
      <div ref={scrollerRef} className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={`${image.src}-scroller`}
            type="button"
            onClick={() => openImage(index)}
            className="relative h-36 w-52 flex-none overflow-hidden rounded-lg border border-white/10 bg-black/30 text-left"
            aria-label={`Open ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="208px"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeImage}
            className="absolute inset-0 cursor-zoom-out"
            aria-label="Close image"
          />
          <div className="relative z-10 w-full max-w-5xl">
            <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                sizes="(min-width: 1024px) 70vw, 95vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-white/80">
              <span>{activeImage.alt}</span>
              <span>
                {activeIndex !== null ? activeIndex + 1 : 0} / {images.length}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={showPrev}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={closeImage}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80"
              >
                Close
              </button>
              <button
                type="button"
                onClick={showNext}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
