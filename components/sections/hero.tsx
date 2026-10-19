"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Face, type Expression } from "@/components/robot/face";
import { RobotStage } from "@/components/robot/robot-stage";
import { useBlink, useGaze } from "@/components/robot/use-gaze";
import { PillButton, TextLink } from "@/components/ui/button";
import { SplitWords } from "@/components/ui/split-words";
import { EASE } from "@/lib/motion";

const LINES = ["Hi, I’m Pracii.", "Good to see you again.", "Namaste!", "Sat Sri Akal!", "Ram Ram ji!"];

function useTypewriter(lines: string[], start: boolean) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const line = lines[index % lines.length];
  const typing = start && count < line.length;

  useEffect(() => {
    if (!start) return;
    const done = count >= line.length;
    const t = setTimeout(
      () => {
        if (done) {
          setIndex((n) => n + 1);
          setCount(0);
        } else setCount((c) => c + 1);
      },
      done ? 2600 : count === 0 ? 420 : 45 + Math.random() * 40,
    );
    return () => clearTimeout(t);
  }, [start, count, line]);

  return { text: line.slice(0, count), typing, key: index };
}

const STRIPES = ["bg-royal", "bg-sky", "bg-ink"];

/** Diagonal bands behind Pracii, drawn in from the left on load. */
function Stripes() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[52%] -z-10 w-[320vw] -translate-x-1/2 -translate-y-1/2 -rotate-[16deg] lg:top-[21%] lg:w-[200vw] lg:-rotate-[19deg]"
    >
      {STRIPES.map((c, i) => (
        <motion.div
          key={c}
          className={`${c} h-[clamp(16px,2.3vw,36px)] origin-left`}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.35 + i * 0.12 }}
        />
      ))}
    </div>
  );
}

function HeroRobot() {
  const screenRef = useRef<HTMLDivElement>(null);
  const gaze = useGaze(screenRef);
  const blink = useBlink();
  const [awake, setAwake] = useState(false);
  const [hover, setHover] = useState(false);
  const [poke, setPoke] = useState<Expression | null>(null);
  const line = useTypewriter(LINES, awake);

  useEffect(() => {
    const t = setTimeout(() => setAwake(true), 1100);
    return () => clearTimeout(t);
  }, []);

  const expression: Expression = poke ?? (hover ? "delighted" : "happy");

  return (
    <div className="relative">
      <Stripes />
      <motion.div
        className="relative cursor-pointer"
        initial={{ opacity: 0, y: 50, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.3, ease: EASE, delay: 0.5 }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onClick={() => {
          setPoke("wink");
          setTimeout(() => setPoke(null), 900);
        }}
      >
        <motion.div
          animate={poke ? { rotate: [0, -2.4, 1.8, 0], y: [0, -8, 0] } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ transformOrigin: "50% 92%" }}
        >
          <RobotStage screenRef={screenRef} preload sizes="(min-width: 1024px) 560px, 86vw">
            <Face expression={expression} gx={gaze.gx} gy={gaze.gy} blink={blink} awake={awake} talking={line.typing} />
          </RobotStage>
        </motion.div>

        <div className="absolute right-[-4%] top-[-12%] sm:right-[-14%] sm:top-[-8%]">
          <AnimatePresence mode="wait">
            {awake && (
              <motion.div
                key={line.key}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96, transition: { duration: 0.25 } }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                style={{ transformOrigin: "10% 100%" }}
                className="relative rounded-[18px] rounded-bl-[5px] bg-white px-4 py-3 text-[0.98rem] font-semibold tracking-[-0.02em] text-ink shadow-[0_18px_40px_-18px_rgb(18_18_20/0.4)] ring-1 ring-ink/[0.05]"
              >
                <span className="eyebrow mb-1.5 block text-[0.58rem] text-royal">Pracii</span>
                <span className="inline-block min-w-[9ch]">
                  {line.text}
                  <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-sky" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden lg:h-[100svh] lg:max-h-[68rem] lg:min-h-[44rem]">
      <div className="shell relative h-full pb-14 pt-[calc(var(--nav-h)+2rem)] lg:pb-0 lg:pt-[calc(var(--nav-h)+3.5vh)]">
        {/* top-left */}
        <div className="relative z-10">
          <h1 className="font-display text-[clamp(2.7rem,5.6vw,5.6rem)] leading-[1.02] lg:pt-[3vh]">
            <SplitWords text="What if your next" trigger="mount" delay={0.25} />{" "}
            <br className="hidden lg:block" />
            <SplitWords text="conversation" trigger="mount" delay={0.45} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.3 }}
            className="mt-6 hidden max-w-[22rem] text-[1rem] leading-[1.6] lg:block"
          >
            Not another app. Not another voice in your phone.{" "}
            <span className="font-semibold text-ink">Something you can actually have around.</span>
          </motion.p>
        </div>

        {/* centre */}
        <div className="relative mx-auto mt-10 w-[84%] max-w-[560px] sm:w-[66%] lg:absolute lg:bottom-[5vh] lg:left-[45%] lg:mt-0 lg:w-[min(35vw,calc((100svh-var(--nav-h))*0.6))] lg:max-w-[640px] lg:-translate-x-1/2">
          <HeroRobot />
        </div>

        {/* bottom-right */}
        <div className="relative z-10 mt-12 text-right lg:absolute lg:bottom-[6vh] lg:right-[var(--gutter)] lg:mt-0">
          <h2 className="font-display text-[clamp(2.7rem,5.6vw,5.6rem)] leading-[1.02]">
            <SplitWords text="didn’t start" trigger="mount" delay={0.6} />{" "}
            <br className="hidden lg:block" />
            <SplitWords text="from zero" trigger="mount" delay={0.75} />
            <motion.span
              className="dot inline-block"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 14, delay: 1.25 }}
            >
              ?
            </motion.span>
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.1 }}
          >
            <p className="ml-auto mt-5 max-w-[24rem] text-[1rem] leading-[1.6]">
              Meet <span className="font-semibold text-ink">Pracii</span>. A little robot we’re building to remember your
              conversations, understand your world, and help with the things that matter every day.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-end gap-x-6 gap-y-3">
              <TextLink href="#story" className="text-[0.92rem]">
                See our journey
              </TextLink>
              <PillButton href="#film" direction="down">
                Meet Pracii
              </PillButton>
            </div>
          </motion.div>
        </div>

        <p className="mt-8 text-right text-[0.95rem] leading-[1.55] lg:hidden">
          Not another app. Not another voice in your phone.{" "}
          <span className="font-semibold text-ink">Something you can actually have around.</span>
        </p>
      </div>
    </section>
  );
}
