"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Intro, Statement } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { ScrubText } from "@/components/ui/scrub-text";

const LINES = [
  "One that remembers the people you care about.",
  "Helps you keep up with your work.",
  "Speaks in a way that feels familiar.",
  "And gets better at understanding your needs as time goes on.",
];

/** Closing frame from the film, slowly revealed. */
function Closing() {
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const visible = useInView(ref, { margin: "0px 0px -10% 0px" });
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (visible) v.play().catch(() => {});
    else v.pause();
  }, [visible]);
  return (
    <div ref={ref} className="shell mt-14 lg:mt-20">
      <div className="relative h-[70svh] min-h-[28rem] overflow-hidden rounded-[32px] bg-night">
        <motion.video
          ref={video}
          style={{ scale }}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src="/media/pracii-film.mp4"
          poster="/media/pracii-film-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_45%,transparent_0%,rgb(0_0_0/0.55)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-center sm:p-12">
          <p className="text-[clamp(2rem,4vw,3.8rem)] font-normal leading-[1.08] tracking-[-0.045em] text-white/80">
            <span className="font-semibold text-white">We’re just getting started.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Vision() {
  return (
    <section id="vision" className="relative py-14 lg:py-20">
      <div className="shell">
        <Intro eyebrow="The bigger picture" title="We don’t want to build" muted="a robot you use once." size="lg" />

        <div className="mt-16 grid gap-12 lg:mt-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <ScrubText
              className="text-[clamp(1.5rem,2.3vw,2.1rem)] font-medium leading-[1.3] tracking-[-0.035em] text-ink"
              text="We want to build one that becomes useful in your everyday life."
            />
          </div>
          <ul className="lg:col-span-5 lg:col-start-8">
            {LINES.map((l, i) => (
              <Reveal key={l} delay={i * 0.08}>
                <li className="flex items-start gap-4 border-b border-line py-4 text-[1.05rem] font-medium leading-[1.45] text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
                  {l}
                </li>
              </Reveal>
            ))}
            <Reveal delay={0.35}>
              <p className="mt-8 text-[1.05rem] leading-[1.7]">
                Today, Pracii is an early physical prototype with a larger experience still in development. Our goal is to turn
                that prototype into a personal companion people genuinely want to keep around.
              </p>
            </Reveal>
          </ul>
        </div>

        <Statement
          className="mx-auto mt-14 max-w-[22ch] text-center lg:mt-20"
          text="Not because it’s a robot."
          muted="Because it has a place in their lives."
        />
      </div>
      <Closing />
    </section>
  );
}
