"use client";

import { animate, useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useEffect, useRef, type RefObject } from "react";
import { clamp, rand } from "@/lib/motion";

export type Gaze = {
  gx: MotionValue<number>;
  gy: MotionValue<number>;
  /** Look at a viewport point (or `null` to go back to following the pointer). */
  lookAt: (point: { x: number; y: number } | null) => void;
};

/**
 * Eyes that follow the mouse, wander when the pointer is idle (or on touch),
 * and can be pointed at something specific.
 */
export function useGaze(target: RefObject<HTMLElement | null>): Gaze {
  const gx = useSpring(0, { stiffness: 150, damping: 19, mass: 0.7 });
  const gy = useSpring(0, { stiffness: 150, damping: 19, mass: 0.7 });
  const override = useRef<{ x: number; y: number } | null>(null);
  const aimRef = useRef<(p: { x: number; y: number }) => void>(() => {});

  useEffect(() => {
    let pointer: { x: number; y: number } | null = null;
    let lastMove = -1e9;
    let timer: ReturnType<typeof setTimeout>;

    const aim = (p: { x: number; y: number }) => {
      const el = target.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const reach = Math.max(window.innerWidth, 900) * 0.42;
      gx.set(clamp(((p.x - cx) / reach) * 1.15, -1, 1));
      gy.set(clamp(((p.y - cy) / reach) * 1.25, -1, 1));
    };
    aimRef.current = aim;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer = { x: e.clientX, y: e.clientY };
      lastMove = performance.now();
      if (!override.current) aim(pointer);
    };
    const onScroll = () => {
      if (override.current) aim(override.current);
      else if (pointer && performance.now() - lastMove < 5000) aim(pointer);
    };
    const onLeave = () => {
      lastMove = -1e9;
    };

    const wander = () => {
      const idle = performance.now() - lastMove > 3200;
      if (idle && !override.current) {
        // short saccades with the occasional return to centre
        if (Math.random() < 0.3) {
          gx.set(rand(-0.15, 0.15));
          gy.set(rand(-0.1, 0.12));
        } else {
          gx.set(rand(-0.75, 0.75));
          gy.set(rand(-0.55, 0.45));
        }
      }
      timer = setTimeout(wander, rand(1100, 2900));
    };
    timer = setTimeout(wander, 1800);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [gx, gy, target]);

  return {
    gx,
    gy,
    lookAt: (point) => {
      override.current = point;
      if (point) aimRef.current(point);
    },
  };
}

/** Natural blinking: irregular intervals, sometimes a double blink. 1 = open, ~0 = shut. */
export function useBlink(active = true) {
  const blink = useMotionValue(1);

  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;

    const once = async () => {
      await animate(blink, 0.06, { duration: 0.07, ease: "easeIn" });
      await animate(blink, 1, { duration: 0.13, ease: "easeOut" });
    };
    const loop = () => {
      timer = setTimeout(async () => {
        if (!alive) return;
        await once();
        if (Math.random() < 0.22) {
          await new Promise((r) => setTimeout(r, 90));
          await once();
        }
        loop();
      }, rand(2300, 5600));
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [active, blink]);

  return blink;
}
