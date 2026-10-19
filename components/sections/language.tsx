"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import sceneLanguage from "@/assets/images/scene-language.png";
import sceneRehearsal from "@/assets/images/scene-rehearsal.png";
import { SceneWithBubbles, type SceneBubble } from "@/components/robot/live";
import { Intro, Statement, Tag } from "@/components/ui/bits";
import { Conversation } from "@/components/ui/chat";
import { Reveal } from "@/components/ui/reveal";
import { cn, EASE } from "@/lib/motion";

const PHRASES = [
  { lang: "Haryanvi", text: "Pracii, kal subah 7 baje jaga diyo.", meaning: "Wake me up at 7 tomorrow morning." },
  { lang: "Punjabi", text: "Pracii, meri kal di meeting kinne vajje aa?", meaning: "What time is my meeting tomorrow?" },
  { lang: "English", text: "Pracii, what did we discuss yesterday?", meaning: "Same companion, any language." },
];

function Bars({ active }: { active: boolean }) {
  return (
    <span className="flex h-7 items-center gap-[3px]" aria-hidden>
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full bg-current"
          animate={active ? { height: [4, 8 + ((i * 7) % 18), 6, 4 + ((i * 5) % 14), 4] } : { height: 4 }}
          transition={active ? { duration: 1.1, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" } : { duration: 0.3 }}
        />
      ))}
    </span>
  );
}

function PhraseCards() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -20% 0px" });
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    if (!inView || hovering) return;
    const t = setInterval(() => setActive((a) => (a + 1) % PHRASES.length), 3200);
    return () => clearInterval(t);
  }, [inView, hovering]);

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-3" onPointerLeave={() => setHovering(false)}>
      {PHRASES.map((p, i) => {
        const on = active === i;
        return (
          <button
            type="button"
            key={p.lang}
            onPointerEnter={() => {
              setHovering(true);
              setActive(i);
            }}
            onClick={() => setActive(i)}
            className={cn(
              "relative flex min-h-[15rem] flex-col rounded-[24px] p-7 text-left transition-[background-color,color,box-shadow] duration-500",
              on ? "bg-ink text-white shadow-[0_30px_60px_-35px_rgb(18_18_20/0.7)]" : "bg-white text-ink ring-1 ring-ink/[0.06]",
            )}
          >
            <span className="flex items-center justify-between">
              <span className={cn("eyebrow", on ? "text-sky" : "text-body")}>{p.lang}</span>
              <span className={on ? "text-sky" : "text-faint"}>
                <Bars active={on} />
              </span>
            </span>
            <span className="mt-auto block pt-10 text-[1.35rem] font-medium leading-[1.3] tracking-[-0.03em]">“{p.text}”</span>
            <span className={cn("mt-3 block text-[0.9rem]", on ? "text-white/55" : "text-body")}>{p.meaning}</span>
          </button>
        );
      })}
    </div>
  );
}

function SceneCard({
  image,
  alt,
  bubbles,
  className,
}: {
  image: typeof sceneLanguage;
  alt: string;
  bubbles: SceneBubble[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-[28px] px-6 pt-28 sm:px-10 sm:pt-32", className)}>
      <SceneWithBubbles image={image} alt={alt} bubbles={bubbles} play={inView} sizes="(min-width: 1024px) 40vw, 90vw" className="mx-auto max-w-[34rem]" />
      <Tag className="absolute left-5 top-5">Visualization</Tag>
    </div>
  );
}

const FEATURES = [
  ["Learn while talking", "Improve your English through everyday conversations."],
  ["Situational coaching", "Learn what to say in meetings, interviews, social events, and real-life situations."],
  ["Gentle corrections", "Pracii helps you improve your sentences naturally, without interrupting every time."],
  ["Speaking practice", "Build fluency, pronunciation, and confidence through regular conversations."],
  ["Personalized learning", "Pracii remembers where you struggle and helps you improve over time."],
  ["Multilingual learning", "Start in Hindi, Punjabi, Haryanvi, or another supported language and gradually practice English."],
];

const WORDS = ["English", "Hindi", "Punjabi", "Haryanvi"];

export function Language() {
  const [word, setWord] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWord((w) => (w + 1) % WORDS.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="language" className="relative py-14 lg:py-20">
      <div className="shell">
        <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Intro eyebrow="Language — talk the way you actually talk" title="English zaroori" muted="nahi hai." size="lg">
              <p className="text-[0.95rem] italic text-faint">“English isn’t necessary.”</p>
            </Intro>
            <Reveal delay={0.1}>
              <div className="mt-10 space-y-3 text-[1.05rem] leading-[1.6]">
                <p className="text-ink">You don’t speak the same way with everyone.</p>
                <p>At work, it might be English. At home, Hindi. With friends and family, Punjabi, Haryanvi, or a mix of everything.</p>
                <p className="text-ink">Why should talking to a robot be any different?</p>
              </div>
              <p className="mt-8 flex items-center gap-3 text-[0.95rem]">
                Imagine it in
                <span className="relative inline-flex h-8 min-w-[7.5rem] items-center justify-center overflow-hidden rounded-full bg-sky-soft px-3 font-semibold text-royal">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={word}
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      {WORDS[word]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <SceneCard
              image={sceneLanguage}
              alt="A woman leans on a table, sceptically asking Pracii in Haryanvi whether it will understand her"
              className="bg-[linear-gradient(180deg,#eef8ff,#d3edff)]"
              bubbles={[
                { from: "you", text: "Haryanvi mein bolungi toh samajh bhi aayega tumhe?", className: "right-[0%] top-[-26%]", tail: "bottom-right" },
                { from: "pracii", text: "Samajh bhi aave se, bolni bhi aave se. Tu shuru toh kar!", className: "left-[-2%] top-[-6%]", tail: "bottom-left" },
              ]}
            />
          </Reveal>
        </div>

        <div className="mt-12 lg:mt-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <Statement text="Built for the way" muted="we speak." />
            <Tag>Planned language experiences</Tag>
          </div>
          <PhraseCards />
          <p className="mt-8 text-right text-[1.1rem] font-medium tracking-[-0.02em] text-ink">Different languages. Same companion.</p>
        </div>

        {/* learning */}
        <div className="mt-14 grid items-center gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="order-2 lg:order-1 lg:col-span-6">
            <SceneCard
              image={sceneRehearsal}
              alt="A young man practises a client conversation with Pracii at a desk"
              className="bg-[linear-gradient(180deg,#fff6e6,#fde6c6)]"
              bubbles={[
                { from: "you", text: "Pracii, interview mein apna introduction kaise doon?", className: "right-[0%] top-[-28%]", tail: "bottom-right" },
                {
                  from: "pracii",
                  text: "Let’s practice! I’ll be the interviewer, and you answer in English. I’ll help you improve along the way.",
                  className: "left-[-1%] top-[-8%]",
                  tail: "bottom-left",
                },
              ]}
            />
          </Reveal>
          <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
            <Intro eyebrow="Learn a language, just by talking" title="What if learning English felt like" muted="a conversation with a friend?">
              No boring lessons. No pressure to speak perfectly. Just talk to Pracii, and let it help you get better, one
              conversation at a time.
            </Intro>
            <Conversation
              className="mt-8"
              lines={[
                { from: "you", text: "Pracii, aaj meeting mein mujhe English mein apni baat samjhani nahi aayi." },
                {
                  from: "pracii",
                  text: (
                    <>
                      You could say, <span className="font-semibold text-royal">“I’d like to share my thoughts on this.”</span> Want to
                      try saying it together?
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Statement text="Learn through real life," muted="not textbooks." />
            <p className="max-w-[22rem] text-[0.98rem] leading-[1.6] lg:text-right">
              <span className="text-ink">No separate class. No fixed schedule.</span> Just a little progress every day.
            </p>
          </div>
          <div className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([t, d], i) => (
              <Reveal key={t} delay={(i % 3) * 0.08}>
                <div className="group border-t border-line py-7">
                  <span className="eyebrow text-faint transition-colors duration-300 group-hover:text-royal">0{i + 1}</span>
                  <p className="mt-4 text-[1.2rem] font-semibold tracking-[-0.03em] text-ink">{t}</p>
                  <p className="mt-2 text-[0.96rem] leading-[1.6]">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Statement
          className="mt-12 max-w-[24ch] lg:mt-16"
          text="A better conversation today."
          muted="A more confident you tomorrow."
        />
      </div>
    </section>
  );
}
