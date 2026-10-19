"use client";

import { motion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/motion";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "sky" | "ink" | "white";
  direction?: "down" | "right";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
};

function Arrow({ direction }: { direction: "down" | "right" }) {
  return (
    <svg viewBox="0 0 16 16" className="h-[0.95em] w-[0.95em]" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      {direction === "down" ? (
        <path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/** Pill button (7billboards-style) that leans toward the cursor; the arrow slides through on hover. */
export function PillButton({ href, children, variant = "sky", direction = "right", size = "md", className, onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.5 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.5 });
  const out = direction === "down" ? "group-hover:translate-y-[170%]" : "group-hover:translate-x-[170%]";
  const enter =
    direction === "down"
      ? "-translate-y-[170%] group-hover:translate-y-0"
      : "-translate-x-[170%] group-hover:translate-x-0";

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.18);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full font-semibold tracking-[-0.005em] transition-colors duration-500",
        size === "lg" ? "h-14 px-7 text-[1rem]" : "h-12 px-6 text-[0.92rem]",
        variant === "sky" && "bg-sky text-ink hover:bg-ink hover:text-white",
        variant === "ink" && "bg-ink text-white hover:bg-royal",
        variant === "white" && "bg-white text-ink ring-1 ring-ink/10 hover:bg-ink hover:text-white",
        className,
      )}
    >
      <span className="relative">{children}</span>
      <span className="relative grid place-items-center overflow-hidden">
        <span className={cn("transition-transform duration-500 ease-out-quint", out)}>
          <Arrow direction={direction} />
        </span>
        <span className={cn("absolute transition-transform duration-500 ease-out-quint", enter)}>
          <Arrow direction={direction} />
        </span>
      </span>
    </motion.a>
  );
}

/** Quiet text link with a line that draws in on hover. */
export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={cn("group relative inline-flex items-center gap-2 py-1 font-semibold text-ink", className)}>
      <span>{children}</span>
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-500 ease-out-quint group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-right scale-x-0 bg-sky transition-transform duration-500 ease-out-quint group-hover:origin-left group-hover:scale-x-100" />
    </a>
  );
}
