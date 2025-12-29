"use client";

import { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

type Props = {
  children: ReactNode;
  id: string;
  className?: string; // <-- make optional
};

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1], // <-- FIX: no string ease
    },
  },
};

export default function SectionWrapper({ children, id, className = "" }: Props) {
  const [ref, inView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      id={id}
      className={className}
    >
      {children}
    </motion.section>
  );
}