"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
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
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

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
