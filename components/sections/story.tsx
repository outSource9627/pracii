"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import cadFront from "@/assets/images/cad-front.png";
import cadFrontSketch from "@/assets/images/cad-front-sketch.png";
import cadSide from "@/assets/images/cad-side.png";
import detailHead from "@/assets/images/detail-head.jpg";
import detailWheel from "@/assets/images/detail-wheel.jpg";
import prototypeReal from "@/assets/images/prototype-real.jpg";
import { Intro, Tag } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { cn, EASE } from "@/lib/motion";

type Tile = { src: StaticImageData; alt: string; tag: string; steps: number[]; cad?: boolean; tall?: boolean };

const COLUMNS: Tile[][] = [
  [
    { src: cadSide, alt: "CAD side view of Pracii's head, body arm and wheels", tag: "CAD · side view", steps: [1], cad: true },
    { src: detailHead, alt: "Close-up of the 3D-printed display housing and head", tag: "Real photo · printed head", steps: [2, 4] },
  ],
  [
    {
      src: prototypeReal,
      alt: "The first assembled Pracii prototype, blue and grey 3D-printed parts, on a wooden table",
      tag: "Real photo · first assembled prototype",
      steps: [4],
      tall: true,
    },
  ],
  [
    { src: cadFrontSketch, alt: "CAD front view with the display sketch outlined", tag: "CAD · display sketch", steps: [1, 3], cad: true },
    { src: cadFront, alt: "CAD front view of the head and neck assembly", tag: "CAD · head & neck", steps: [3], cad: true },
  ],
  [{ src: detailWheel, alt: "Close-up of a 3D-printed wheel ring, tyre and side arm", tag: "Real photo · printed wheel", steps: [2, 4] }],
];

const STEPS = [
  {
    n: "01",
    title: "The first design",
    lead: "Every little detail had to start somewhere.",
    body: "We started by designing the robot’s physical form: its head, body, wheels, and the parts that would hold everything together. It looked simple on the screen. Making it real was another challenge.",
  },
  {
    n: "02",
    title: "The first prints",
    lead: "Then came the part we could actually hold.",
    body: "We started 3D printing the components. For the first time, we could see the proportions, inspect how the parts fit, and understand what needed to change.",
  },
  {
    n: "03",
    title: "The redesign",
    lead: "The first version taught us what the next one needed.",
    body: "We went back to the design, refined the form, adjusted components, and continued printing. This was the point where Pracii began to look less like a collection of parts and more like a robot.",
  },
  {
    n: "04",
    title: "Our first complete prototype",
    lead: "From a design on a screen to something sitting on our table.",
    body: "We brought the printed parts together into our first assembled physical prototype. A recognizable head. A compact body. Four wheels. A design that finally felt like Pracii.",
  },
];

function TileCard({ tile, step }: { tile: Tile; step: number | null }) {
  const dim = step !== null && !tile.steps.includes(step);
  return (
    <motion.figure
      animate={{ opacity: dim ? 0.3 : 1, scale: dim ? 0.985 : 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        "group relative overflow-hidden rounded-[22px]",
        tile.cad
          ? "bg-[#eef3f8] bg-[linear-gradient(rgb(0_74_173/0.06)_1px,transparent_1px),linear-gradient(90deg,rgb(0_74_173/0.06)_1px,transparent_1px)] bg-[size:22px_22px] p-6"
          : "bg-cream-3",
        tile.tall && "aspect-[4/5] sm:aspect-auto sm:min-h-[30rem] sm:flex-1",
      )}
    >
      <Image
        src={tile.src}
        alt={tile.alt}
        sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
        fill={tile.tall}
        className={cn(
          "transition-transform duration-700 ease-out-quint group-hover:scale-[1.04]",
          tile.tall ? "object-cover object-[50%_60%]" : "h-auto w-full",
        )}
      />
      <figcaption className="absolute bottom-3 left-3">
        <Tag>{tile.tag}</Tag>
      </figcaption>
    </motion.figure>
  );
}

export function Story() {
  const [step, setStep] = useState<number | null>(null);

  return (
    <section id="story" className="relative py-14 lg:py-20">
      <div className="shell">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <Intro
            className="lg:col-span-8"
            eyebrow="The making of Pracii — our real story"
            title="Before Pracii could remember anything,"
            muted="we had to give it a body."
          />
          <p className="text-[1.05rem] leading-[1.65] lg:col-span-4 lg:text-right">
            Pracii didn’t begin as a finished product. It began with an idea, a design, and a lot of work.{" "}
            <span className="text-ink">Below: our actual CAD work and real photos of the prototype.</span>
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col, i) => (
            <Reveal key={i} delay={i * 0.08} className="flex flex-col gap-4">
              {col.map((tile) => (
                <TileCard key={tile.tag} tile={tile} step={step} />
              ))}
              {i === 3 && (
                <div className="flex flex-1 flex-col justify-between rounded-[22px] bg-sky p-7 text-ink">
                  <p className="eyebrow text-[0.62rem]">What’s next</p>
                  <p className="font-display mt-10 text-[2rem] leading-[1.05]">And this is only the beginning.</p>
                  <p className="mt-4 text-[0.95rem] leading-[1.55] text-ink/75">
                    The next challenge isn’t just making Pracii look like a companion. It’s making the experience live up to
                    the idea.
                  </p>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div
                onPointerEnter={() => setStep(i + 1)}
                onPointerLeave={() => setStep(null)}
                className="group cursor-default"
              >
                <div className="flex items-baseline gap-3">
                  <span className={cn("eyebrow transition-colors duration-500", step === i + 1 ? "text-royal" : "text-faint")}>
                    {s.n}
                  </span>
                  <span className="h-px flex-1 bg-ink/15">
                    <motion.span
                      className="block h-px origin-left bg-sky"
                      animate={{ scaleX: step === i + 1 ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  </span>
                </div>
                <p className="mt-5 text-[1.2rem] font-semibold tracking-[-0.03em] text-ink">{s.title}</p>
                <p className="mt-2 text-[0.98rem] font-medium leading-[1.5] text-ink-2">{s.lead}</p>
                <p className="mt-3 text-[0.94rem] leading-[1.65]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
