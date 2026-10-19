"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import touch from "@/assets/images/scenes/touch.jpg";
import { Tag } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";

const POINTS = [
  ["01", "Who matters to you.", "The people in your life, and the dates worth remembering."],
  ["02", "What you’re working on.", "Your projects, your meetings, and what’s on your mind."],
  ["03", "What you said yesterday.", "So the next conversation doesn’t start from zero."],
];

export function Idea() {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section id="idea" className="relative py-14 lg:py-20">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <div ref={imgRef} className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-sand">
            <motion.div style={{ y }} className="absolute inset-[-7%]">
              <Image
                src={touch}
                alt="A hand resting on Pracii's head while its screen smiles with happy closed eyes"
                fill
                sizes="(min-width: 1024px) 38vw, 92vw"
                className="object-cover object-[62%_50%]"
              />
            </motion.div>
            <Tag className="absolute bottom-4 left-4">Visualization</Tag>
          </div>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow text-body">Why Pracii</p>
          <h2 className="font-display mt-6 text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[1.04]">
            <SplitWords text="Your phone knows a lot about you." stagger={0.04} />{" "}
            <span className="text-[#b3ada0]">
              <SplitWords text="But how much does it really remember?" stagger={0.04} delay={0.2} />
            </span>
          </h2>
          <Reveal>
            <p className="mt-7 max-w-[34rem] text-[1.05rem] leading-[1.7]">
              You tell your devices what to do. Set an alarm. Check a meeting. Find a contact. Remind you about something.
              Tomorrow, you do it all over again.
            </p>
            <p className="mt-4 max-w-[34rem] text-[1.05rem] leading-[1.7] text-ink">
              But what if you had something that remembered the conversation? Something that knew…
            </p>
          </Reveal>

          <ul className="mt-10">
            {POINTS.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.08}>
                <li className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-t border-line py-6 last:border-b">
                  <span className="eyebrow text-faint transition-colors duration-300 group-hover:text-royal">{n}</span>
                  <div>
                    <p className="text-[clamp(1.5rem,2.1vw,2rem)] font-semibold leading-tight tracking-[-0.035em] text-ink">{t}</p>
                    <p className="mt-1.5 text-[0.98rem]">{d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell mt-14 text-center lg:mt-20">
        <Reveal>
          <p className="eyebrow text-body">That’s the idea behind Pracii</p>
        </Reveal>
        <p className="font-display mx-auto mt-6 max-w-[20ch] text-[clamp(2.2rem,4.2vw,4.2rem)] leading-[1.04] text-ink">
          <SplitWords text="A companion that gets more useful" stagger={0.04} />{" "}
          <span className="text-[#b3ada0]">
            <SplitWords text="as it gets to know you." stagger={0.04} delay={0.2} />
          </span>
        </p>
      </div>
    </section>
  );
}
