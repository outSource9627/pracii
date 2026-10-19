"use client";

import { motion } from "motion/react";
import { useBlink } from "@/components/robot/use-gaze";
import { cn } from "@/lib/motion";

// Vector rebuild of the Pracii mark (two ribbons forming a "P" with a face).
// The eyes blink like the robot's.
export function LogoMark({ className, blink = true }: { className?: string; blink?: boolean }) {
  const b = useBlink(blink);
  return (
    <svg viewBox="218 280 656 623" className={cn("h-auto", className)} aria-hidden>
      <rect x="310" y="372" width="472" height="172" rx="86" fill="#fff" />
      <path
        fill="#004AAD"
        d="M664.5 280H696A178 178 0 0 1 696 636H599.5A76 76 0 0 0 523.5 712V810L431 902.5V735A191 191 0 0 1 622.5 544H696A86 86 0 0 0 696 372H572.5Z"
      />
      <path
        fill="#38B6FF"
        d="M664.5 280H396A178 178 0 0 0 396 636H493A76 76 0 0 1 569 712V810L662 903V735A191 191 0 0 0 470 544H396A86 86 0 0 1 396 372H572.5Z"
      />
      <motion.g style={{ scaleY: b, transformBox: "fill-box", transformOrigin: "50% 50%" }}>
        <rect x="356" y="411" width="92" height="87" rx="36" fill="#0b0b0c" />
        <rect x="640" y="411" width="92" height="87" rx="36" fill="#0b0b0c" />
      </motion.g>
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} role="img" aria-label="Pracii">
      <LogoMark className="w-[2em]" />
      <span
        aria-hidden
        className={cn("text-[1.4em] font-bold leading-none tracking-[-0.04em]", tone === "dark" ? "text-ink" : "text-white")}
      >
        pracii
      </span>
    </span>
  );
}
