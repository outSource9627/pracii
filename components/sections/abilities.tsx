"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import sceneBirthday from "@/assets/images/scene-birthday.png";
import sceneReminder from "@/assets/images/scene-reminder.png";
import { LiveRobot, SceneWithBubbles } from "@/components/robot/live";
import { Tag } from "@/components/ui/bits";
import { SplitWords } from "@/components/ui/split-words";
import { cn, EASE } from "@/lib/motion";

type Item = {
  title: string;
  body: string;
  quote: string;
  visual: "agenda" | "team" | "reminder" | "birthday" | "listening";
};

const ITEMS: Item[] = [
  {
    title: "Your day, in one conversation",
    body: "Your meetings, reminders, and important plans. All in one conversation.",
    quote: "“Pracii, what’s on my schedule today?”",
    visual: "agenda",
  },
  {
    title: "Chases the updates for you",
    body: "With your permission, Pracii reaches out to your team, gathers their responses, and gives you one clear update. Fewer follow-up calls. Less chasing. More time to work.",
    quote: "“Pracii, check with my team. Where are we on the project?”",
    visual: "team",
  },
  {
    title: "The small things don’t slip away",
    body: "Sometimes, remembering one small thing saves an entire day. From early alarms to everyday tasks, tell Pracii what needs remembering.",
    quote: "“Pracii, remind me to take my documents tomorrow.”",
    visual: "reminder",
  },
  {
    title: "Remembers the people who matter",
    body: "Birthdays, anniversaries, personal occasions, and the little details worth remembering. Because some dates are too important to miss.",
    quote: "“Pracii, any important dates coming up?”",
    visual: "birthday",
  },
  {
    title: "Someone to talk to",
    body: "Some days you need a reminder. Other days, you just want to talk. We’re building Pracii to respond with care and remember the context.",
    quote: "“Pracii, today was a really bad day.”",
    visual: "listening",
  },
];

const DURATION = 6;

function Visual({ item }: { item: Item }) {
  if (item.visual === "reminder")
    return (
      <SceneWithBubbles
        image={sceneReminder}
        alt="A woman heading out smiles down at Pracii, who reminds her about her documents"
        sizes="(min-width: 1024px) 34vw, 80vw"
        play
        className="mx-auto w-[64%]"
        bubbles={[
          { from: "pracii", text: "Don’t forget your documents — you asked me to remind you.", className: "left-[42%] top-[42%]", tail: "bottom-right" },
          { from: "you", text: "Oh, thanks Pracii! I totally forgot.", className: "left-[-16%] top-[2%]", tail: "bottom-right" },
        ]}
      />
    );
  if (item.visual === "birthday")
    return (
      <SceneWithBubbles
        image={sceneBirthday}
        alt="A young man laughs in surprise as Pracii reminds him it's his mom's birthday tomorrow"
        sizes="(min-width: 1024px) 40vw, 86vw"
        play
        className="mx-auto w-[86%]"
        bubbles={[
          { from: "pracii", text: "Rohit! It’s your mom’s birthday tomorrow. Planned something special?", className: "left-[55%] top-[16%]", tail: "bottom-right" },
          { from: "you", text: "Oh my God, it’s tomorrow? Thanks for reminding me!", className: "left-[0%] top-[-9%]", tail: "bottom-right" },
        ]}
      />
    );
  return <LiveRobot screen={item.visual} sizes="(min-width: 1024px) 42vw, 86vw" className="mx-auto w-[92%]" />;
}

export function Abilities() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-25% 0px -25% 0px" });
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const running = inView && !hovering;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % ITEMS.length), DURATION * 1000);
    return () => clearTimeout(t);
  }, [active, running]);

  return (
    <section ref={ref} id="abilities" className="relative bg-sand py-14 lg:py-20">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="relative flex min-h-[26rem] items-center justify-center lg:col-span-6 lg:min-h-[38rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="w-full"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <Visual item={ITEMS[active]} />
            </motion.div>
          </AnimatePresence>
          <Tag className="absolute left-0 top-0">Concept</Tag>
        </div>

        <div className="lg:col-span-5 lg:col-start-8" onPointerEnter={() => setHovering(true)} onPointerLeave={() => setHovering(false)}>
          <h2 className="font-display text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[1.04]">
            <SplitWords text="Here’s what Pracii is learning to do." stagger={0.04} />
          </h2>
          <ul className="mt-10">
            {ITEMS.map((item, i) => {
              const on = i === active;
              return (
                <li key={item.title} className={cn(!on && "border-b border-line", i === active - 1 && "border-transparent")}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    className={cn(
                      "relative w-full text-left transition-[background-color,box-shadow,padding] duration-500",
                      on
                        ? "my-2 rounded-[20px] bg-white px-6 py-6 shadow-[0_18px_40px_-26px_rgb(18_18_20/0.35)]"
                        : "rounded-none px-6 py-5 hover:bg-white/40",
                    )}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className="text-[1.2rem] font-medium tracking-[-0.03em] text-ink">{item.title}</span>
                      <motion.svg
                        viewBox="0 0 16 16"
                        className="h-4 w-4 shrink-0 text-body"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.6}
                        animate={{ rotate: on ? 90 : 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        aria-hidden
                      >
                        <path d="m6 3.5 4.5 4.5L6 12.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          key="body"
                          className="block overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                        >
                          <span className="mt-2 block h-[2px] w-14 rounded-full bg-sky" />
                          <span className="mt-4 block text-[0.98rem] leading-[1.65]">{item.body}</span>
                          <span className="mt-4 block text-[0.92rem] font-medium text-royal">{item.quote}</span>
                          <span className="mt-5 block h-[2px] overflow-hidden rounded-full bg-ink/[0.06]">
                            <motion.span
                              key={`${active}-${running}`}
                              className="block h-full origin-left bg-ink/25"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: running ? 1 : 0 }}
                              transition={{ duration: running ? DURATION : 0.2, ease: "linear" }}
                            />
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
