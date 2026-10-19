"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Face, type Expression } from "@/components/robot/face";
import { RobotStage } from "@/components/robot/robot-stage";
import { useBlink, useGaze } from "@/components/robot/use-gaze";
import { Intro, Statement, Tag } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { cn, EASE } from "@/lib/motion";

const SPOTS = [
  { key: "near", text: "Something that can sit nearby.", x: 80, y: 78 },
  { key: "speak", text: "Something you can speak to naturally.", x: 27, y: 15 },
  { key: "face", text: "Something with a face, expressions, and a presence of its own.", x: 60, y: 25 },
];

const FACES: Expression[] = ["delighted", "curious", "wink", "proud"];

export function Physical() {
  const screenRef = useRef<HTMLDivElement>(null);
  const gaze = useGaze(screenRef);
  const blink = useBlink();
  const [spot, setSpot] = useState<string | null>(null);
  const [faceIndex, setFaceIndex] = useState(0);

  useEffect(() => {
    if (spot !== "face") return;
    const t = setInterval(() => setFaceIndex((i) => (i + 1) % FACES.length), 900);
    return () => clearInterval(t);
  }, [spot]);

  const expression: Expression = spot === "face" ? FACES[faceIndex] : "happy";

  return (
    <section id="physical" className="relative bg-sand py-14 lg:py-20">
      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[30px] bg-[radial-gradient(120%_100%_at_50%_0%,#ffffff_0%,#eaf6ff_45%,#cdeaff_100%)] px-8 pb-10 pt-20 ring-1 ring-ink/[0.04] sm:px-14">
            <div className="relative">
              <RobotStage screenRef={screenRef} sizes="(min-width: 1024px) 40vw, 86vw">
                <Face expression={expression} gx={gaze.gx} gy={gaze.gy} blink={blink} talking={spot === "speak"} />
              </RobotStage>
              {SPOTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  aria-label={s.text}
                  onPointerEnter={() => setSpot(s.key)}
                  onPointerLeave={() => setSpot(null)}
                  onFocus={() => setSpot(s.key)}
                  onBlur={() => setSpot(null)}
                  onClick={() => setSpot((cur) => (cur === s.key ? null : s.key))}
                  className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center"
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                >
                  <span className="absolute h-full w-full animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full bg-white/80" />
                  <span
                    className={cn(
                      "relative grid h-6 w-6 place-items-center rounded-full text-[0.8rem] font-semibold shadow-sm transition-colors duration-300",
                      spot === s.key ? "bg-ink text-white" : "bg-white text-ink",
                    )}
                  >
                    +
                  </span>
                </button>
              ))}
            </div>
            <Tag className="absolute left-6 top-6">Hover the dots</Tag>
          </div>
        </Reveal>

        <div>
          <Intro eyebrow="Why a physical robot?" title="Some things deserve to exist" muted="outside a screen.">
            We already spend enough time looking at phones. Pracii is our attempt to bring a personal AI companion into the
            physical world.
          </Intro>
          <ul className="mt-10 border-t border-line">
            {SPOTS.map((s, i) => (
              <Reveal key={s.key} delay={i * 0.08}>
                <li
                  onPointerEnter={() => setSpot(s.key)}
                  onPointerLeave={() => setSpot(null)}
                  className={cn(
                    "flex cursor-default items-center justify-between gap-6 border-b border-line py-4 text-[1.08rem] font-medium tracking-[-0.02em] transition-colors duration-300",
                    spot === s.key ? "text-royal" : "text-ink",
                  )}
                >
                  {s.text}
                  <motion.span
                    animate={{ x: spot === s.key ? 0 : -6, opacity: spot === s.key ? 1 : 0.25 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    →
                  </motion.span>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <p className="mt-8 max-w-[34rem] text-[1.05rem] leading-[1.7]">
              Not to replace your phone, your friends, or your family.{" "}
              <span className="text-ink">Just to make everyday interactions a little more personal.</span>
            </p>
          </Reveal>
        </div>
      </div>

      <div className="shell mt-12 text-center lg:mt-16">
        <Statement className="mx-auto max-w-[24ch]" text="Small enough to be around." muted="Useful enough to keep around." />
      </div>
    </section>
  );
}
