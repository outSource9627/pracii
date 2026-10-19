"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { cn, EASE } from "@/lib/motion";

const LINKS = [
  { id: "idea", label: "The idea" },
  { id: "day", label: "A day" },
  { id: "memory", label: "Memory" },
  { id: "language", label: "Language" },
  { id: "story", label: "Our story" },
];
const IDS = LINKS.map((l) => l.id);

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        setActive(ids.find((id) => seen.get(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(IDS);
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 30));

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-500",
            "bg-[linear-gradient(180deg,rgb(255_251_240/0.92),rgb(255_251_240/0.6))] backdrop-blur-xl",
            scrolled || open ? "opacity-100" : "opacity-0",
          )}
        />
        <nav className="shell flex h-[var(--nav-h)] items-center justify-between gap-6" aria-label="Main">
          <a href="#top" className="-m-2 p-2 text-[15px]" onClick={() => setOpen(false)}>
            <Logo />
          </a>

          <div className="hidden h-12 min-w-[34rem] items-center justify-between rounded-[14px] bg-white px-2 shadow-[0_1px_2px_rgb(11_11_12/0.04)] ring-1 ring-ink/[0.07] lg:flex">
            <a href="#top" className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-[0.85rem] font-semibold text-ink">
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="absolute h-full w-full animate-[pulse-ring_2.2s_ease-out_infinite] rounded-full bg-sky" />
                <span className="h-2 w-2 rounded-full bg-sky" />
              </span>
              Pre-launch
            </a>
            <ul className="flex items-center">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    className={cn(
                      "relative block rounded-[10px] px-3 py-2 text-[0.85rem] font-medium transition-colors duration-300",
                      active === l.id ? "text-ink" : "text-ink/70 hover:text-ink",
                    )}
                  >
                    {active === l.id && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-0 rounded-[10px] bg-sky-wash"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#join"
              className="group hidden h-11 items-center gap-2 rounded-full bg-sky px-5 text-[0.88rem] font-semibold text-ink transition-colors duration-500 hover:bg-ink hover:text-white sm:inline-flex"
            >
              Join early access
              <span className="relative grid h-4 w-4 place-items-center overflow-hidden">
                <span className="transition-transform duration-500 ease-out-quint group-hover:translate-x-[160%]">→</span>
                <span className="absolute -translate-x-[160%] transition-transform duration-500 ease-out-quint group-hover:translate-x-0">→</span>
              </span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid h-11 w-11 place-items-center rounded-full bg-white ring-1 ring-ink/10 lg:hidden"
            >
              <motion.span
                className="absolute h-[1.5px] w-4 rounded bg-ink"
                animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
              <motion.span
                className="absolute h-[1.5px] w-4 rounded bg-ink"
                animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </button>
          </div>
        </nav>
        <motion.div style={{ scaleX: scrollYProgress }} className="h-[2px] origin-left bg-sky" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-40 flex flex-col bg-cream pt-[calc(var(--nav-h)+1.5rem)] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ul className="shell flex flex-col">
              {[...LINKS, { id: "today", label: "Today" }].map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.05 }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-line py-4"
                  >
                    <span className="font-display text-[2.6rem] leading-none text-ink">{l.label}</span>
                    <span className="eyebrow text-body">0{i + 2}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="shell mt-auto pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href="#join"
                onClick={() => setOpen(false)}
                className="flex h-14 items-center justify-center rounded-full bg-sky font-semibold text-ink"
              >
                Join the early access list
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
