"use client";

import { animate, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect } from "react";

export type Expression =
  | "happy"
  | "delighted"
  | "curious"
  | "listening"
  | "thinking"
  | "sleepy"
  | "wink"
  | "proud";

type EyeMode = "open" | "arc" | "closed";
type Shape = {
  browL: string;
  browR: string;
  mouth: string;
  eyes: [EyeMode, EyeMode];
  eyeScale: number;
  /** 1 swaps the smile for a small round "o" */
  o: number;
};

// Every path keeps the same "M x y Q cx cy x y" shape so they morph cleanly.
// The happy face reproduces the face printed in the product photo.
const SHAPES: Record<Expression, Shape> = {
  happy: {
    browL: "M 70.2 62.1 Q 92.9 41.8 117.1 52.1",
    browR: "M 285.7 49.6 Q 309.3 40.2 331.6 61.2",
    mouth: "M 162.8 228.8 Q 203.2 272 242.4 225.5",
    eyes: ["open", "open"],
    eyeScale: 1,
    o: 0,
  },
  delighted: {
    browL: "M 68 50 Q 93 25 118 40",
    browR: "M 284 38 Q 310 24 334 47",
    mouth: "M 150 220 Q 203 298 256 218",
    eyes: ["arc", "arc"],
    eyeScale: 1,
    o: 0,
  },
  curious: {
    browL: "M 71 66 Q 94 57 117 61",
    browR: "M 286 41 Q 309 15 332 35",
    mouth: "M 196 246 Q 203 247 210 246",
    eyes: ["open", "open"],
    eyeScale: 1.05,
    o: 1,
  },
  listening: {
    browL: "M 74 63 Q 97 55 120 46",
    browR: "M 284 46 Q 306 55 329 63",
    mouth: "M 178 238 Q 203 254 228 238",
    eyes: ["open", "open"],
    eyeScale: 0.84,
    o: 0,
  },
  thinking: {
    browL: "M 70 47 Q 93 29 117 41",
    browR: "M 285 57 Q 309 51 331 59",
    mouth: "M 182 243 Q 211 252 236 232",
    eyes: ["open", "open"],
    eyeScale: 0.94,
    o: 0,
  },
  sleepy: {
    browL: "M 72 74 Q 94 68 116 72",
    browR: "M 287 72 Q 309 68 330 74",
    mouth: "M 189 240 Q 203 248 217 240",
    eyes: ["closed", "closed"],
    eyeScale: 1,
    o: 0,
  },
  wink: {
    browL: "M 70.2 60 Q 92.9 39 117.1 50",
    browR: "M 285.7 58 Q 309.3 52 331.6 64",
    mouth: "M 156 224 Q 203 282 250 222",
    eyes: ["open", "arc"],
    eyeScale: 1,
    o: 0,
  },
  proud: {
    browL: "M 69 55 Q 93 36 118 47",
    browR: "M 285 44 Q 309 34 333 55",
    mouth: "M 156 226 Q 203 280 250 223",
    eyes: ["open", "open"],
    eyeScale: 1,
    o: 0,
  },
};

const EYES = [
  { cx: 105.9, cy: 158.5 },
  { cx: 306.8, cy: 160.4 },
] as const;
const RX = 28.5;
const RY = 30;

const arc = (cx: number, cy: number) => `M ${cx - 25} ${cy + 9} Q ${cx} ${cy - 27} ${cx + 25} ${cy + 9}`;
const shut = (cx: number, cy: number) => `M ${cx - 24} ${cy - 1} Q ${cx} ${cy + 19} ${cx + 24} ${cy - 1}`;

const MORPH = { type: "spring", stiffness: 260, damping: 24, mass: 0.8 } as const;

type FaceProps = {
  expression?: Expression;
  gx: MotionValue<number>;
  gy: MotionValue<number>;
  blink: MotionValue<number>;
  talking?: boolean;
  awake?: boolean;
  color?: string;
};

export function Face({
  expression = "happy",
  gx,
  gy,
  blink,
  talking = false,
  awake = true,
  color = "#0c0e12",
}: FaceProps) {
  const s = SHAPES[expression];

  // parallax: eyes travel most, brows and mouth less — reads as a head turn
  const ex = useTransform(gx, (v) => v * 17);
  const ey = useTransform(gy, (v) => v * 12);
  const bx = useTransform(gx, (v) => v * 8);
  const by = useTransform(gy, (v) => v * 8);
  const mx = useTransform(gx, (v) => v * 8);
  const my = useTransform(gy, (v) => v * 4);

  const openL = useSpring(0, { stiffness: 320, damping: 26 });
  const openR = useSpring(0, { stiffness: 320, damping: 26 });
  useEffect(() => {
    openL.set(awake && s.eyes[0] === "open" ? s.eyeScale : 0.02);
    openR.set(awake && s.eyes[1] === "open" ? s.eyeScale : 0.02);
  }, [awake, s, openL, openR]);
  const scaleL = useTransform(() => blink.get() * openL.get());
  const scaleR = useTransform(() => blink.get() * openR.get());

  const talk = useMotionValue(1);
  useEffect(() => {
    if (!talking) {
      animate(talk, 1, { duration: 0.18 });
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      animate(talk, 0.45 + Math.random() * 1.3, { duration: 0.08 });
      timer = setTimeout(step, 80 + Math.random() * 80);
    };
    step();
    return () => clearTimeout(timer);
  }, [talking, talk]);

  const scales = [scaleL, scaleR];

  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: awake ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        stroke={color}
        strokeLinecap="round"
        fill="none"
      >
        <motion.g style={{ x: bx, y: by }}>
          <motion.path initial={false} animate={{ d: s.browL }} transition={MORPH} strokeWidth={13.9} />
          <motion.path initial={false} animate={{ d: s.browR }} transition={MORPH} strokeWidth={14.6} />
        </motion.g>

        <motion.g style={{ x: ex, y: ey }}>
          {EYES.map((e, i) => (
            <g key={i}>
              <motion.ellipse
                cx={e.cx}
                cy={e.cy}
                rx={RX}
                ry={RY}
                fill={color}
                stroke="none"
                style={{ scaleY: scales[i], transformBox: "fill-box", transformOrigin: "50% 50%" }}
              />
              <motion.path
                d={arc(e.cx, e.cy)}
                strokeWidth={13}
                initial={false}
                animate={{ opacity: awake && s.eyes[i] === "arc" ? 1 : 0, y: s.eyes[i] === "arc" ? 0 : 6 }}
                transition={{ duration: 0.18 }}
              />
              <motion.path
                d={shut(e.cx, e.cy)}
                strokeWidth={12}
                initial={false}
                animate={{ opacity: awake && s.eyes[i] === "closed" ? 1 : 0 }}
                transition={{ duration: 0.25 }}
              />
            </g>
          ))}
        </motion.g>

        <motion.g style={{ x: mx, y: my, scaleY: talk, transformBox: "fill-box", transformOrigin: "50% 50%" }}>
          <motion.path
            initial={false}
            animate={{ d: s.mouth, opacity: s.o ? 0 : 1 }}
            transition={MORPH}
            strokeWidth={11.1}
          />
          <motion.ellipse
            cx={203}
            cy={244}
            rx={11}
            ry={13}
            strokeWidth={9}
            initial={false}
            animate={{ opacity: s.o, scale: s.o ? 1 : 0.3 }}
            transition={MORPH}
            style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
          />
        </motion.g>
      </motion.g>
    </svg>
  );
}
