"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { EASE } from "@/lib/motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; blur?: boolean };

/** Fade-and-rise when the element scrolls into view. */
export function Reveal({ delay = 0, y = 28, blur = false, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
