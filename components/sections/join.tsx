"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type FormEvent } from "react";
import { Face, type Expression } from "@/components/robot/face";
import { RobotStage } from "@/components/robot/robot-stage";
import { useBlink, useGaze } from "@/components/robot/use-gaze";
import { Reveal } from "@/components/ui/reveal";
import { SplitWords } from "@/components/ui/split-words";
import { cn, EASE } from "@/lib/motion";

const INTENTS = [
  { id: "early-access", label: "Early access", cta: "Join the early access list" },
  { id: "partnership", label: "Partnership", cta: "Start a conversation" },
  { id: "investing", label: "Investing", cta: "Start a conversation" },
] as const;
type Intent = (typeof INTENTS)[number]["id"];

const field =
  "w-full rounded-[14px] bg-cream px-4 py-3.5 text-[0.98rem] font-medium text-ink placeholder:text-faint ring-1 ring-ink/[0.08] outline-none transition-shadow duration-300 focus:ring-2 focus:ring-sky";

export function Join() {
  const screenRef = useRef<HTMLDivElement>(null);
  const gaze = useGaze(screenRef);
  const blink = useBlink();
  const [intent, setIntent] = useState<Intent>("early-access");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [typing, setTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const follow = (el: HTMLInputElement | HTMLTextAreaElement) => {
    const r = el.getBoundingClientRect();
    const caret = Math.min(r.left + 16 + el.value.length * 8.2, r.right - 16);
    gaze.lookAt({ x: caret, y: r.top + Math.min(r.height / 2, 28) });
  };
  const onType = (el: HTMLInputElement | HTMLTextAreaElement) => {
    follow(el);
    setTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTyping(false), 500);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, intent }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("done");
      gaze.lookAt(null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const expression: Expression =
    status === "done" ? "delighted" : status === "error" ? "thinking" : typing ? "proud" : "happy";
  const current = INTENTS.find((i) => i.id === intent)!;

  return (
    <section id="join" className="relative py-6 lg:py-10">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(180deg,#fffbf0_0%,#eef8ff_45%,#c9e9ff_100%)] px-6 py-14 ring-1 ring-ink/[0.07] sm:px-12 lg:px-16 lg:py-20">
          <div className="grid items-end gap-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="eyebrow text-body">Come along for the journey</p>
              <h3 className="font-display mt-6 text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[1.05]">
                <SplitWords text="We built the first one." stagger={0.04} />{" "}
                <span className="text-[#b3ada0]">
                  <SplitWords text="Now we’re working on what comes next." stagger={0.04} delay={0.2} />
                </span>
              </h3>
              <Reveal>
                <p className="mt-7 max-w-[32rem] text-[1.05rem] leading-[1.7]">
                  Pracii is still in development, and we’d love to bring interested people along as it grows. Whether you want to
                  be among the first to experience Pracii, explore a partnership, or help us take the next step, we’d be glad to
                  hear from you.
                </p>
              </Reveal>
              <p className="font-display mt-14 text-[clamp(3rem,6.4vw,6.4rem)] leading-[0.98] text-ink">
                <SplitWords text="Be here before hello." stagger={0.06} />
              </p>
            </div>

            <div className="relative lg:col-span-5 lg:col-start-8">
              <div className="relative z-0 mx-auto -mb-[9%] w-[62%]">
                <RobotStage screenRef={screenRef} sizes="(min-width: 1024px) 24vw, 56vw" shadow={false}>
                  <Face expression={expression} gx={gaze.gx} gy={gaze.gy} blink={blink} />
                </RobotStage>
              </div>
              <div className="relative z-10 rounded-[28px] bg-white p-6 shadow-[0_40px_80px_-40px_rgb(0_74_173/0.55)] ring-1 ring-ink/[0.06] sm:p-8">
                <AnimatePresence mode="wait" initial={false}>
                  {status === "done" ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="py-6 text-center"
                    >
                      <p className="font-display text-[2.2rem] leading-tight text-ink">
                        {intent === "early-access" ? "You’re on the list." : "Message received."}
                      </p>
                      <p className="mx-auto mt-4 max-w-[22rem] text-[1rem] leading-[1.6]">
                        Thank you. We’ll share early access and launch details as development progresses.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        className="mt-6 text-[0.9rem] font-semibold text-royal underline-offset-4 hover:underline"
                      >
                        Send another
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                      <div className="grid grid-cols-3 gap-1 rounded-full bg-cream p-1 ring-1 ring-ink/[0.06]" role="radiogroup" aria-label="I’m interested in">
                        {INTENTS.map((i) => (
                          <button
                            key={i.id}
                            type="button"
                            role="radio"
                            aria-checked={intent === i.id}
                            onClick={() => setIntent(i.id)}
                            className={cn(
                              "relative whitespace-nowrap rounded-full px-1.5 py-2.5 text-[0.76rem] font-semibold transition-colors duration-300 sm:px-2 sm:text-[0.82rem]",
                              intent === i.id ? "text-ink" : "text-body hover:text-ink",
                            )}
                          >
                            {intent === i.id && (
                              <motion.span
                                layoutId="intent-pill"
                                className="absolute inset-0 rounded-full bg-sky"
                                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                              />
                            )}
                            <span className="relative">{i.label}</span>
                          </button>
                        ))}
                      </div>
                      <input
                        name="name"
                        autoComplete="name"
                        placeholder="Your name"
                        className={field}
                        onFocus={(e) => follow(e.currentTarget)}
                        onInput={(e) => onType(e.currentTarget)}
                        onBlur={() => gaze.lookAt(null)}
                      />
                      <input
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@email.com"
                        className={field}
                        onFocus={(e) => follow(e.currentTarget)}
                        onInput={(e) => onType(e.currentTarget)}
                        onBlur={() => gaze.lookAt(null)}
                      />
                      <AnimatePresence initial={false}>
                        {intent !== "early-access" && (
                          <motion.div
                            key="msg"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <textarea
                              name="message"
                              rows={3}
                              placeholder={intent === "investing" ? "Tell us a little about you" : "What would you like to explore?"}
                              className={cn(field, "resize-none")}
                              onFocus={(e) => follow(e.currentTarget)}
                              onInput={(e) => onType(e.currentTarget)}
                              onBlur={() => gaze.lookAt(null)}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink text-[0.98rem] font-semibold text-white transition-colors duration-500 hover:bg-royal disabled:opacity-60"
                      >
                        {status === "sending" ? "Sending…" : current.cta}
                        <span className="transition-transform duration-500 ease-out-quint group-hover:translate-x-1">→</span>
                      </button>
                      {status === "error" && <p className="text-center text-[0.86rem] font-medium text-[#c2410c]">{error}</p>}
                      <p className="pt-1 text-center text-[0.8rem] leading-[1.5] text-body">
                        Early access and launch details will be shared as development progresses.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
