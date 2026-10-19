"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";

const CAPTIONS = [
  { lead: "Meet Pracii.", rest: "A little robot with a face, a memory, and a presence of its own." },
  { lead: "Not another app.", rest: "Not another voice in your phone." },
  { lead: "Something you can", rest: "actually have around." },
];

/** The product film: grows from a rounded card to full-bleed, captions change as you scroll. */
export function Film() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [cap, setCap] = useState(0);

  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const inset = useTransform(enter, [0, 1], [7, 0]);
  const radius = useTransform(enter, [0, 1], [36, 0]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;
  const zoom = useTransform(enter, [0, 1], [1.12, 1]);

  const { scrollYProgress: through } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(through, "change", (p) => setCap(Math.min(CAPTIONS.length - 1, Math.floor(p * CAPTIONS.length))));

  const visible = useInView(ref, { margin: "0px 0px -10% 0px" });
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (visible) v.play().catch(() => {});
    else v.pause();
  }, [visible]);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <section id="film" ref={ref} className="relative h-[200vh] lg:h-[230vh]" aria-label="Pracii product film">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ clipPath }} className="absolute inset-0 bg-night">
          <motion.video
            ref={video}
            style={{ scale: zoom }}
            className="absolute inset-0 h-full w-full object-cover"
            src="/media/pracii-film.mp4"
            poster="/media/pracii-film-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Pracii turns, looks around and smiles"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(0_0_0/0.7)_0%,rgb(0_0_0/0.15)_40%,rgb(0_0_0/0)_60%)] lg:bg-[linear-gradient(90deg,rgb(0_0_0/0.72)_0%,rgb(0_0_0/0.35)_34%,rgb(0_0_0/0)_58%)]" />

          <div className="absolute inset-x-0 bottom-[16%] px-6 text-center lg:inset-x-auto lg:bottom-auto lg:left-[var(--gutter)] lg:top-1/2 lg:-translate-y-1/2 lg:px-0 lg:text-left">
            <AnimatePresence mode="wait">
              <motion.p
                key={cap}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={{ duration: 0.8, ease: EASE }}
                className="mx-auto max-w-[18ch] text-[clamp(1.9rem,3.3vw,3.3rem)] font-normal leading-[1.12] tracking-[-0.04em] text-white/80 lg:mx-0 lg:max-w-[13ch]"
              >
                <span className="font-semibold text-white">{CAPTIONS[cap].lead}</span> {CAPTIONS[cap].rest}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-[var(--gutter)] pb-7">
            <span className="eyebrow text-white/55">AI-generated visualization</span>
            <div className="hidden items-center gap-2 sm:flex">
              {CAPTIONS.map((_, i) => (
                <span key={i} className="h-[3px] w-8 overflow-hidden rounded-full bg-white/20">
                  <motion.span
                    className="block h-full origin-left bg-white"
                    animate={{ scaleX: i <= cap ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2.5 text-[0.82rem] font-semibold text-white ring-1 ring-white/20 backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-ink"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                <path d="M3.5 8v4h3l4 3.5v-11L6.5 8z" strokeLinejoin="round" />
                {muted ? (
                  <path d="m13.5 8 4 4m0-4-4 4" strokeLinecap="round" />
                ) : (
                  <path d="M13.5 7.5a3.5 3.5 0 0 1 0 5M15.5 5.5a6.5 6.5 0 0 1 0 9" strokeLinecap="round" />
                )}
              </svg>
              {muted ? "Sound off" : "Sound on"}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
