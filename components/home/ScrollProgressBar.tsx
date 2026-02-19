"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  const animatedScale = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.25,
  });

  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] h-1 w-full">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-sky-500 via-teal-400 to-cyan-300 shadow-[0_0_14px_rgba(14,165,233,0.55)]"
        style={{ scaleX: reduceMotion ? scrollYProgress : animatedScale }}
      />
    </div>
  );
}
