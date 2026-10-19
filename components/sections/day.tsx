"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import type { Expression } from "@/components/robot/face";
import { LivePhotoFace } from "@/components/robot/live";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";
import { PHOTOS, type LivePhoto } from "@/lib/photos";
import { cn, EASE } from "@/lib/motion";

type Scene = {
  photo: LivePhoto;
  position: [number, number];
  face: Expression;
  align: "bottom" | "left";
  time: string;
  ask: string;
  reply: string;
};

const SCENES: Scene[] = [
  {
    photo: PHOTOS.morning,
    position: [0.62, 0.5],
    face: "happy",
    align: "bottom",
    time: "7:30 AM.",
    ask: "“Pracii, what’s on my schedule today?”",
    reply: "You have a client meeting at 11, a proposal review at 4, and you wanted to call Dad this evening.",
  },
  {
    photo: PHOTOS.livingRoom,
    position: [0.6, 0.5],
    face: "proud",
    align: "bottom",
    time: "5:30 PM.",
    ask: "“Pracii, any important dates coming up?”",
    reply: "Your sister’s birthday is on Friday.",
  },
  {
    photo: PHOTOS.nightTalk,
    position: [0.6, 0.5],
    face: "listening",
    align: "bottom",
    time: "9:00 PM.",
    ask: "“Pracii, today was a really bad day.”",
    reply: "I’m listening. Want to tell me what happened?",
  },
  {
    photo: PHOTOS.heroNight,
    position: [0.66, 0.5],
    face: "thinking",
    align: "left",
    time: "A week later.",
    ask: "“Pracii, remember that client I was worried about?”",
    reply: "Yes, you mentioned the meeting wasn’t going well. Did things work out?",
  },
];

function Scenes() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) =>
    setIndex(Math.min(SCENES.length - 1, Math.max(0, Math.floor(p * SCENES.length)))),
  );
  const s = SCENES[index];

  return (
    <div ref={ref} className="relative" style={{ height: `${SCENES.length * 100}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-night">
        {SCENES.map((scene, i) => (
          <motion.div
            key={scene.time}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.06 }}
            transition={{ opacity: { duration: 1, ease: "easeInOut" }, scale: { duration: 2.4, ease: EASE } }}
          >
            <LivePhotoFace
              photo={scene.photo}
              expression={scene.face}
              position={scene.position}
              className="h-full w-full"
              sizes="100vw"
            />
          </motion.div>
        ))}

        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-700",
            "bg-[linear-gradient(0deg,rgb(0_0_0/0.8)_0%,rgb(0_0_0/0.45)_34%,rgb(0_0_0/0.05)_62%)]",
            s.align === "left" &&
              "lg:bg-[linear-gradient(90deg,rgb(0_0_0/0.78)_0%,rgb(0_0_0/0.45)_38%,rgb(0_0_0/0)_66%)]",
          )}
        />

        <div
          className={cn(
            "absolute inset-0 flex items-end justify-center px-[var(--gutter)] pb-[13vh] text-center",
            s.align === "left" && "lg:items-center lg:justify-start lg:pb-0 lg:text-left",
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(6px)", transition: { duration: 0.35 } }}
              transition={{ duration: 0.9, ease: EASE }}
              className={cn("max-w-[46rem]", s.align === "left" && "lg:ml-[4vw] lg:max-w-[34rem]")}
            >
              <p className="text-[clamp(1rem,1.3vw,1.15rem)] text-white/70">{s.ask}</p>
              <p className="mt-4 text-[clamp(1.75rem,3.2vw,3.1rem)] font-normal leading-[1.14] tracking-[-0.04em] text-white/85">
                <span className="font-semibold text-white">{s.time}</span> {s.reply}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-[var(--gutter)] pb-6">
          <span className="eyebrow text-white/50">
            Visualization<span className="hidden sm:inline"> · what we’re working toward</span>
          </span>
          <span className="eyebrow text-white/70">
            {String(index + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Day() {
  return (
    <section id="day" className="relative">
      <div className="shell pb-10 pt-14 text-center lg:pb-14 lg:pt-20">
        <Reveal>
          <p className="eyebrow text-body">A day with Pracii</p>
        </Reveal>
        <h2 className="font-display mx-auto mt-6 max-w-[16ch] text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[1.02]">
          <SplitWords text="Imagine a day with Pracii." stagger={0.05} />
        </h2>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-[34rem] text-[1.08rem] leading-[1.65]">
            Not a list of commands to memorize. Just ordinary conversations that make your day a little easier.
          </p>
        </Reveal>
      </div>
      <Scenes />
    </section>
  );
}
