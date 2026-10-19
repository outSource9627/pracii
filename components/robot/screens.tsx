"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

// UI drawn on Pracii's display. Everything here lives in a flat 400×300 box.

const row = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: EASE, delay: 0.35 + i * 0.16 },
});

const LABEL = "text-[15px] font-bold uppercase tracking-[0.16em] text-body";

export function AgendaScreen() {
  const items = [
    ["11:00", "Client meeting"],
    ["4:00", "Proposal review"],
    ["Eve", "Call Dad"],
  ];
  return (
    <div className="absolute inset-0 flex flex-col px-[34px] pb-[26px] pt-[30px] text-ink">
      <motion.div {...row(0)} className="flex items-baseline justify-between">
        <span className={LABEL}>Today</span>
        <span className="font-display text-[40px] leading-none">7:30</span>
      </motion.div>
      <div className="mt-[20px] flex flex-col gap-[16px]">
        {items.map(([t, label], i) => (
          <motion.div key={label} {...row(i + 1)} className="flex items-center gap-[16px] text-[27px] font-semibold leading-none tracking-[-0.01em]">
            <span className="font-display w-[78px] text-[28px] font-normal text-royal">{t}</span>
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function TeamScreen() {
  const people = [
    ["A", "Aditi", "Done", "#004aad"],
    ["K", "Kabir", "On track", "#004aad"],
    ["M", "Meera", "Needs you", "#e07b22"],
  ];
  return (
    <div className="absolute inset-0 flex flex-col px-[32px] pb-[24px] pt-[28px] text-ink">
      <motion.div {...row(0)} className="flex items-baseline justify-between">
        <span className={LABEL}>Team update</span>
        <span className={LABEL}>3/3</span>
      </motion.div>
      <div className="mt-[16px] flex flex-col gap-[11px]">
        {people.map(([i, name, status, color], k) => (
          <motion.div key={name} {...row(k + 1)} className="flex items-center gap-[14px] text-[24px] font-semibold leading-none">
            <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-sky-soft text-[15px] font-bold text-royal">{i}</span>
            <span className="flex-1">{name}</span>
            <span className="text-[16px] font-bold" style={{ color }}>
              {status}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div {...row(4)} className="mt-auto rounded-[12px] bg-ink px-[16px] py-[11px] text-[19px] font-semibold leading-none text-white">
        2 on track · 1 needs your input
      </motion.div>
    </div>
  );
}

export function Waveform({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[5px] ${className}`}>
      {[0.5, 0.9, 0.6, 1, 0.7, 0.45, 0.8].map((h, i) => (
        <motion.span
          key={i}
          className="w-[6px] rounded-full bg-sky"
          animate={{ height: [8, 30 * h, 10, 22 * h, 8] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.09 }}
        />
      ))}
    </div>
  );
}
