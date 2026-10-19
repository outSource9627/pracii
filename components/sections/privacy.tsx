"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Tag } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";
import { cn, EASE } from "@/lib/motion";

const SEED = [
  { id: 1, text: "Sister’s birthday is on Friday", kind: "Important date" },
  { id: 2, text: "Client meeting didn’t go well", kind: "Conversation" },
  { id: 3, text: "Prefers a 7 AM alarm", kind: "Routine" },
  { id: 4, text: "Calls Dad on Sunday evenings", kind: "People" },
];

function Switch({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300", on ? "bg-sky" : "bg-white/15")}
    >
      <motion.span
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
        animate={{ left: on ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}

function Controls() {
  const [items, setItems] = useState(SEED);
  const [paused, setPaused] = useState(false);
  const [access, setAccess] = useState({ Calendar: true, Contacts: true, Reminders: false });
  const [toast, setToast] = useState<string | null>(null);

  const forget = (id: number) => {
    setItems((list) => list.filter((m) => m.id !== id));
    setToast("Forgotten. Pracii won’t bring that up again.");
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="relative rounded-[26px] bg-white/[0.06] p-5 ring-1 ring-white/10 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow text-white">What Pracii remembers</p>
        <Tag tone="dark">Interface concept</Tag>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-[16px] bg-white/[0.06] px-4 py-3.5">
        <div>
          <p className="text-[0.98rem] font-semibold text-white">{paused ? "Memory paused" : "Memory on"}</p>
          <p className="text-[0.82rem] text-white/50">{paused ? "Nothing new will be remembered." : "You decide what stays."}</p>
        </div>
        <Switch on={!paused} onChange={() => setPaused((p) => !p)} label="Memory" />
      </div>

      <ul className={cn("mt-4 space-y-2 transition-opacity duration-500", paused && "opacity-40")}>
        <AnimatePresence initial={false}>
          {items.map((m) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, filter: "blur(6px)", transition: { duration: 0.4, ease: EASE } }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-[14px] bg-white/[0.04] px-4 py-3">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
                <div className="flex-1">
                  <p className="text-[0.95rem] font-medium text-white">{m.text}</p>
                  <p className="text-[0.75rem] text-white/45">{m.kind}</p>
                </div>
                <button
                  type="button"
                  onClick={() => forget(m.id)}
                  className="rounded-full px-3 py-1.5 text-[0.8rem] font-semibold text-white/70 ring-1 ring-white/15 transition-colors duration-300 hover:bg-white hover:text-ink"
                >
                  Forget
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        {items.length === 0 && (
          <li className="flex items-center justify-between rounded-[14px] bg-white/[0.04] px-4 py-4 text-[0.9rem] text-white/60">
            Nothing remembered.
            <button type="button" onClick={() => setItems(SEED)} className="font-semibold text-sky">
              Reset demo
            </button>
          </li>
        )}
      </ul>

      <p className="eyebrow mt-7 text-[0.62rem] text-white/50">What it can access</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {(Object.keys(access) as (keyof typeof access)[]).map((k) => (
          <div key={k} className="flex items-center justify-between rounded-[14px] bg-white/[0.04] px-4 py-3">
            <span className="text-[0.9rem] font-medium text-white">{k}</span>
            <Switch on={access[k]} onChange={() => setAccess((a) => ({ ...a, [k]: !a[k] }))} label={k} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-x-6 -bottom-5 rounded-full bg-sky px-4 py-2.5 text-center text-[0.85rem] font-semibold text-ink shadow-lg"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Privacy() {
  return (
    <section id="privacy" className="relative py-6 lg:py-10">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[36px] bg-ink px-6 py-14 text-white sm:px-12 lg:px-16 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(56_182_255/0.28),transparent)]"
          />
          <div className="relative grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-sky">Something personal should stay personal</p>
              <h3 className="font-display mt-6 text-[clamp(2.4rem,4.4vw,4.4rem)] leading-[1.04] text-white">
                <SplitWords text="Your memories." stagger={0.05} />{" "}
                <span className="text-white/40">
                  <SplitWords text="Your choice." stagger={0.05} delay={0.15} />
                </span>
              </h3>
              <Reveal>
                <p className="mt-8 max-w-[32rem] text-[1.05rem] leading-[1.7] text-white/65">
                  If Pracii is going to remember personal details, trust matters just as much as intelligence. We believe people
                  should have control over what their companion remembers, what it can access, and what it should forget.
                </p>
                <p className="mt-4 max-w-[32rem] text-[1.05rem] leading-[1.7] text-white/65">
                  That’s a principle we want to carry through the development of Pracii’s memory, conversations, and connected
                  features.
                </p>
                <p className="mt-8 text-[1.15rem] font-semibold text-white">
                  Because a personal companion should always feel like yours.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <Controls />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
