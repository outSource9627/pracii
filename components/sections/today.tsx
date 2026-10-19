"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import prototypeReal from "@/assets/images/prototype-real.jpg";
import pracii from "@/assets/images/pracii-hero.png";
import { Intro, Statement, Tag } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { EASE } from "@/lib/motion";

/** Digits roll up into place, like an odometer. */
function Roll({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <span ref={ref} className="inline-flex overflow-hidden leading-none" aria-label={value}>
      {value.split("").map((d, i) => (
        <span key={i} className="relative inline-block h-[1em] overflow-hidden" aria-hidden>
          <motion.span
            className="flex flex-col"
            initial={{ y: "0%" }}
            animate={inView ? { y: `-${Number(d) * 10}%` } : {}}
            transition={{ duration: 1.6, ease: EASE, delay: delay + i * 0.12 }}
          >
            {Array.from({ length: 10 }).map((_, n) => (
              <span key={n} className="block h-[1em]">
                {n}
              </span>
            ))}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const STATS = [
  ["01", "Physical prototype", "Designed, printed and assembled by our team."],
  ["04", "Build stages done", "CAD design, 3D printing, redesign and assembly."],
  ["06", "Experiences in the works", "From natural voice to personal memory."],
];

const TOWARD = [
  "Natural, responsive voice conversations.",
  "Personal memory across conversations.",
  "Calendar, reminders, and phone-connected actions.",
  "Personalized responses that improve with context.",
  "Hindi, English, and regional-language experiences.",
  "Reliable everyday interaction between software and hardware.",
];

export function Today() {
  return (
    <section id="today" className="relative bg-[linear-gradient(180deg,#fffbf0_0%,#f0f9ff_35%,#d2edff_100%)] py-14 lg:py-20">
      <div className="shell">
        <Intro eyebrow="Where we are today" title="Built in the real world." muted="Still growing." size="lg">
          We’re not announcing a finished consumer product. We’re sharing something we’re actively building.
        </Intro>

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <figure className="relative overflow-hidden rounded-[28px]">
              <Image
                src={prototypeReal}
                alt="Our first assembled prototype on a wooden table"
                sizes="(min-width: 1024px) 38vw, 92vw"
                className="aspect-[4/5] h-auto w-full object-cover object-[50%_62%]"
              />
              <figcaption className="absolute bottom-4 left-4">
                <Tag>Real photo · today</Tag>
              </figcaption>
              <div className="absolute bottom-4 right-4 w-[34%] overflow-hidden rounded-[18px] bg-white/80 p-2 shadow-lg ring-1 ring-ink/5 backdrop-blur">
                <Image src={pracii} alt="Product visualization of the finished Pracii" sizes="14vw" className="h-auto w-full" />
                <p className="eyebrow pb-1 pt-2 text-center text-[0.5rem] text-body">Where it’s headed</p>
              </div>
            </figure>
          </Reveal>

          <div className="lg:col-span-7 lg:pl-6">
            <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
              {STATS.map(([v, t, d], i) => (
                <div key={t}>
                  <p className="text-[clamp(3.6rem,5.4vw,5.4rem)] font-light leading-none tracking-[-0.06em] text-ink">
                    <Roll value={v} delay={i * 0.15} />
                  </p>
                  <p className="mt-4 text-[1.08rem] font-semibold tracking-[-0.025em] text-ink">{t}</p>
                  <p className="mt-1 text-[0.92rem] leading-[1.55]">{d}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 rounded-[26px] bg-white p-7 ring-1 ring-ink/[0.06] sm:p-9">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="eyebrow text-ink">What we’ve completed</p>
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-soft px-3 py-1.5 text-[0.78rem] font-semibold text-royal">
                  <span className="h-1.5 w-1.5 rounded-full bg-royal" /> First prototype
                </span>
              </div>
              <p className="mt-4 text-[1.1rem] font-semibold leading-[1.5] text-ink">
                Our first physical prototype has taken shape through CAD design, 3D printing, redesigns, and assembly.
              </p>
              <p className="eyebrow mt-10 text-ink">What we’re working toward</p>
              <ul className="mt-4">
                {TOWARD.map((t, i) => (
                  <Reveal key={t} delay={i * 0.05}>
                    <li className="group flex items-center gap-4 border-b border-line py-3.5 text-[1rem] text-ink-2 last:border-0">
                      <span className="eyebrow w-8 text-royal">0{i + 1}</span>
                      <span className="flex-1 font-medium">{t}</span>
                      <span className="h-2 w-2 rounded-full bg-sky/40 transition-colors duration-300 group-hover:bg-sky" />
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-end justify-between gap-8 lg:mt-14">
          <p className="max-w-[26rem] text-[1.05rem] leading-[1.7]">There’s more to build, more to test, and plenty to improve.</p>
          <Statement className="lg:max-w-[20ch] lg:text-right" text="But we now have" muted="something real to build upon." />
        </div>
      </div>
    </section>
  );
}
