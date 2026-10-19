"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { LivePhoto } from "@/lib/photos";
import { cn } from "@/lib/motion";
import { SCREEN_SIZE } from "@/lib/robot";

/**
 * A photo shown with object-fit: cover, plus a layer pinned to Pracii's display in that
 * photo — so a live face (or UI) can be drawn on the robot inside the picture.
 */
export function PhotoStage({
  photo,
  position = [0.5, 0.5],
  screenRef,
  children,
  className,
  imageClassName,
  sizes,
  preload,
}: {
  photo: LivePhoto;
  position?: [number, number];
  screenRef?: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
  className?: string;
  imageClassName?: string;
  sizes: string;
  preload?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ s: number; x: number; y: number } | null>(null);
  const { width: iw, height: ih } = photo.src;
  const [px, py] = position;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width: cw, height: ch } = e.contentRect;
      const s = Math.max(cw / iw, ch / ih);
      setBox({ s, x: (cw - iw * s) * px, y: (ch - ih * s) * py });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [iw, ih, px, py]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        preload={preload}
        quality={90}
        className={cn("object-cover", imageClassName)}
        style={{ objectPosition: `${px * 100}% ${py * 100}%` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{
          width: iw,
          height: ih,
          transform: box ? `translate(${box.x}px, ${box.y}px) scale(${box.s})` : undefined,
          visibility: box ? "visible" : "hidden",
        }}
      >
        <div
          ref={screenRef}
          className="absolute left-0 top-0 origin-top-left overflow-hidden"
          style={{ width: SCREEN_SIZE.width, height: SCREEN_SIZE.height, transform: photo.matrix }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
