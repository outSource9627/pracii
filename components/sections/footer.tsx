"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Logo, LogoMark } from "@/components/ui/logo";

const EXPLORE = [
  { href: "#story", label: "Our Story" },
  { href: "#day", label: "Everyday Possibilities" },
  { href: "#today", label: "Development Updates" },
  { href: "#join", label: "Contact" },
];

export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "12%"]);

  return (
    <footer className="relative mt-10">
      <div ref={ref} className="shell overflow-hidden">
        <motion.p
          aria-hidden
          style={{ y }}
          className="select-none text-center text-[clamp(6rem,26vw,28rem)] font-bold leading-[0.8] tracking-[-0.07em] text-[#efe6d3]"
        >
          pracii
        </motion.p>
      </div>
      <div className="relative rounded-t-[40px] bg-ink pb-10 pt-16 text-white/70">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="text-[15px]">
              <Logo tone="light" />
            </div>
            <p className="mt-6 text-[1.35rem] font-semibold tracking-[-0.03em] text-white">Your AI Home Companion.</p>
            <p className="mt-2 max-w-[22rem] text-[0.98rem] leading-[1.6]">From an idea to our first physical prototype.</p>
          </div>
          <div className="lg:col-span-3">
            <p className="text-[1.05rem] font-bold text-white">Explore</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="group inline-flex items-center gap-2 transition-colors duration-300 hover:text-white">
                    <span className="h-1 w-1 rounded-full bg-sky opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-[1.05rem] font-bold text-white">Made by Pracpoint</p>
            <p className="mt-5 inline-flex items-center gap-2.5 rounded-full bg-white/[0.08] px-4 py-2 text-[0.88rem] text-white">
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="absolute h-full w-full animate-[pulse-ring_2.2s_ease-out_infinite] rounded-full bg-sky" />
                <span className="h-2 w-2 rounded-full bg-sky" />
              </span>
              Currently in development
            </p>
            <div className="mt-8 flex justify-start lg:justify-end">
              <a
                href="#join"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-sky px-6 text-[0.92rem] font-semibold text-ink transition-colors duration-500 hover:bg-white"
              >
                Join early access →
              </a>
            </div>
          </div>
        </div>
        <div className="shell mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-[0.85rem]">
          <p>© 2026 Pracpoint. All rights reserved.</p>
          <a href="#top" className="group inline-flex items-center gap-3 text-white/70 transition-colors hover:text-white">
            Back to top
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-sky">
              <LogoMark className="w-5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
