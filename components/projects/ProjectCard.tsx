"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaGithub, FaVideo } from "react-icons/fa";
import { BiLinkExternal } from "react-icons/bi";
import { project } from "@/types/main";

interface ProjectCardProps {
  project: project;
}

const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1], // ✅ valid easing
    },
  },
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="flex flex-col gap-3 bg-white dark:bg-grey-800 rounded-lg p-4 shadow-soft"
    >
      {/* Image */}
      <div className="relative w-full h-48 rounded-md overflow-hidden">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {project.techstack}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-3 pt-2">
        {project.links?.code && (
          <a
            href={project.links.code}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400"
          >
            <FaGithub /> Code
          </a>
        )}

        {project.links?.video && (
          <a
            href={project.links.video}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400"
          >
            <FaVideo /> Video
          </a>
        )}

        {project.links?.visit && (
          <a
            href={project.links.visit}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400"
          >
            <BiLinkExternal /> Visit
          </a>
        )}
      </div>
    </motion.div>
  );
}
