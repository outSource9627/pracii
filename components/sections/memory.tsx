"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Intro, Statement, Tag } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { EASE } from "@/lib/motion";

const ENTRIES = [
  { when: "Mon · 9:40 PM", before: "The ", mark: "Sharma project deadline", after: " just moved to Thursday." },
  { when: "Wed · 7:15 PM", before: "", mark: "Riya’s birthday", after: " is on Saturday — remind me to order a cake." },
  { when: "Fri · 10:05 PM", before: "Honestly, I’m ", mark: "nervous about tomorrow’s client meeting", after: "." },
];

const REMEMBERED = ["Sharma project · due Thursday", "Riya’s birthday · Saturday", "Client meeting · you were nervous"];

function Notebook() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  return (
    <div ref={ref} className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_30px_70px_-45px_rgb(0_74_173/0.45)] ring-1 ring-ink/[0.05] sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-body">Three days, three conversations</span>
        <Tag>Interface concept</Tag>
      </div>
      <div className="mt-7 space-y-5">
        {ENTRIES.map((e, i) => (
          <motion.div
            key={e.when}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.25 }}
            className="border-b border-line pb-5 last:border-0 last:pb-0"
          >
            <p className="eyebrow text-[0.6rem] text-faint">{e.when}</p>
            <p className="mt-2 text-[1.05rem] leading-[1.55] text-ink">
              “{e.before}
              <span className="relative">
                <motion.span
                  aria-hidden
                  className="absolute inset-x-[-2px] bottom-[0.06em] top-[0.2em] origin-left rounded-[4px] bg-sky/30"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.9 + i * 0.55 }}
                />
                <span className="relative">{e.mark}</span>
              </span>
              {e.after}”
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 rounded-[20px] bg-ink p-5 text-white">
        <p className="eyebrow text-[0.6rem] text-sky">Pracii remembers</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {REMEMBERED.map((r, i) => (
            <motion.span
              key={r}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 22, delay: 1.5 + i * 0.55 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-[0.85rem]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky" />
              {r}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

const LINES = [
  "You tell Pracii about your work.",
  "The people in your life.",
  "Your interests, preferences, important dates, and the stories you want it to remember.",
];

const PILLARS = [
  ["01", "It knows your world.", "Your work, relationships, interests, and the details you choose to share."],
  ["02", "It remembers the conversation.", "Ask about something you discussed days ago, without explaining everything again."],
  ["03", "It adapts to your routine.", "Your preferences and daily habits can help make future interactions more personal."],
];

export function Memory() {
  return (
    <section id="memory" className="relative bg-[linear-gradient(180deg,#fffbf0_0%,#f3f9ff_55%,#e6f4ff_100%)] py-14 lg:py-20">
      <div className="shell">
        <Intro eyebrow="Personal memory — our big idea" title="It shouldn’t forget you" muted="by tomorrow." size="lg" />

        <div className="mt-16 grid items-center gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <Notebook />
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            {LINES.map((l, i) => (
              <Reveal key={l} delay={i * 0.08}>
                <p className="border-b border-line py-5 text-[clamp(1.2rem,1.6vw,1.45rem)] font-medium leading-[1.4] tracking-[-0.025em] text-ink">
                  {l}
                </p>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <p className="mt-7 text-[1.05rem] leading-[1.7]">
                Over time, these details could help Pracii understand what matters to you.{" "}
                <span className="text-ink">Not just the question you’re asking, but the reason you’re asking it.</span>
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 lg:mt-20">
          <Statement text="Less repeating." muted="More understanding." />
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {PILLARS.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.1}>
                <div className="group border-t border-ink/15 pt-6">
                  <span className="eyebrow text-faint transition-colors duration-300 group-hover:text-royal">{n}</span>
                  <p className="mt-5 text-[1.45rem] font-semibold tracking-[-0.035em] text-ink">{t}</p>
                  <p className="mt-2 text-[0.98rem] leading-[1.6]">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Statement
          className="mt-14 max-w-[22ch] lg:mt-20"
          text="We want Pracii to become more useful over time,"
          muted="not just more familiar."
        />
      </div>
    </section>
  );
}
