"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate when scrolled into view (default) or straight away on mount. */
  trigger?: "view" | "mount";
};

/** Words rise out of a mask, one after another — used for headlines. */
export function SplitWords({ text, className, delay = 0, stagger = 0.05, trigger = "view" }: Props) {
  const words = text.split(" ");
  const play = trigger === "mount" ? { animate: "show" } : { whileInView: "show" };
  return (
    <motion.span
      className={className}
      initial="hidden"
      {...play}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={i}>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "108%", rotate: 4 },
                show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: EASE } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}
