"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn, EASE } from "@/lib/motion";

export type Line = { from: "you" | "pracii"; text: React.ReactNode };

function Dots() {
  return (
    <span className="flex h-5 items-center gap-1" aria-label="Pracii is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

/**
 * A short exchange that plays once it's visible (or when `play` turns true):
 * your line appears, Pracii "types", then answers.
 */
export function Conversation({
  lines,
  dark = false,
  className,
  size = "md",
  play,
}: {
  lines: Line[];
  dark?: boolean;
  className?: string;
  size?: "md" | "lg";
  play?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const active = play ?? inView;
  const [step, setStep] = useState(0);
  // while Pracii's line is next, show the typing dots in its place
  const typing = active && step < lines.length && lines[step].from === "pracii";

  useEffect(() => {
    if (!active || step >= lines.length) return;
    const delay = lines[step].from === "pracii" ? 1000 : step === 0 ? 200 : 450;
    const t = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [active, step, lines]);

  return (
    <div ref={ref} className={cn("flex flex-col gap-2.5", className)}>
      {lines.map((line, i) => {
        const you = line.from === "you";
        const visible = i < step || (typing && i === step);
        const isTyping = typing && i === step;
        return (
          <AnimatePresence key={i} initial={false}>
            {visible && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: EASE }}
                style={{ transformOrigin: you ? "100% 100%" : "0% 100%" }}
                className={cn(
                  "max-w-[90%] rounded-[20px] px-5 py-3.5 font-medium leading-[1.45] tracking-[-0.005em]",
                  size === "lg" ? "text-[1.08rem]" : "text-[0.96rem]",
                  you
                    ? cn("self-end rounded-br-[6px]", dark ? "bg-white/[0.12] text-white backdrop-blur-md" : "bg-ink text-white")
                    : cn(
                        "self-start rounded-bl-[6px]",
                        dark ? "bg-sky text-ink" : "bg-white text-ink ring-1 ring-sky/40 shadow-[0_12px_30px_-18px_rgb(0_74_173/0.45)]",
                      ),
                )}
              >
                <span className={cn("eyebrow mb-1.5 block text-[0.55rem]", you ? "opacity-55" : "text-royal")}>
                  {you ? "You" : "Pracii"}
                </span>
                {isTyping ? <Dots /> : line.text}
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
}

/** Speech bubble pinned over an illustration; pops in when `play` is true. */
export function Bubble({
  children,
  from,
  className,
  delay = 0,
  tail = "bottom-left",
  play,
}: {
  children: React.ReactNode;
  from: "you" | "pracii";
  className?: string;
  delay?: number;
  tail?: "bottom-left" | "bottom-right";
  play: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={play ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 10 }}
      transition={{ type: "spring", stiffness: 380, damping: 26, delay: play ? delay : 0 }}
      style={{ transformOrigin: tail === "bottom-left" ? "8% 100%" : "92% 100%" }}
      className={cn(
        "absolute z-10 max-w-[16rem] rounded-[18px] px-4 py-3 text-[0.86rem] font-semibold leading-snug tracking-[-0.005em] text-ink shadow-[0_16px_36px_-18px_rgb(11_11_12/0.5)]",
        from === "pracii" ? "bg-sky-soft ring-1 ring-sky/50" : "bg-white ring-1 ring-ink/[0.06]",
        tail === "bottom-left" ? "rounded-bl-[5px]" : "rounded-br-[5px]",
        className,
      )}
    >
      <span className={cn("eyebrow mb-1 block text-[0.5rem]", from === "pracii" ? "text-royal" : "text-body")}>
        {from === "pracii" ? "Pracii" : "You"}
      </span>
      {children}
    </motion.div>
  );
}
