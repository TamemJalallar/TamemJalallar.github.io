"use client";

import type { ReactNode } from "react";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const motionVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.985, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.58, ease: easeCurve },
  },
};

export default function SectionWrapper({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [ref, inView] = useInView({
    threshold: 0.12,
    triggerOnce: true,
    rootMargin: "-6% 0px",
  });

  const sectionVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
      }
    : motionVariants;

  return (
    <section id={id} className={className}>
      <motion.div
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
    </section>
  );
}
