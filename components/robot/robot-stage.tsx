"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import heroBlank from "@/assets/images/pracii-hero-blank.png";
import { GROUND, HERO_SIZE, SCREEN_MATRIX, SCREEN_SIZE } from "@/lib/robot";
import { cn } from "@/lib/motion";

type Props = {
  /** Drawn on the robot's display, in a flat 400×300 coordinate space. */
  children?: ReactNode;
  screenRef?: RefObject<HTMLDivElement | null>;
  className?: string;
  imageClassName?: string;
  imageStyle?: CSSProperties;
  sizes: string;
  preload?: boolean;
  shadow?: boolean;
  alt?: string;
};

/**
 * The Pracii cut-out with an empty display, plus a perspective-correct layer on top of the
 * display. The layer is laid out at the photo's native pixel size and scaled to fit, so the
 * measured screen matrix stays exact at any width.
 */
export function RobotStage({
  children,
  screenRef,
  className,
  imageClassName,
  imageStyle,
  sizes,
  preload,
  shadow = true,
  alt = "Pracii, a small blue robot with a screen for a face and four wheels",
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / HERO_SIZE.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className={cn("relative", className)}
      style={{ aspectRatio: `${HERO_SIZE.width} / ${HERO_SIZE.height}` }}
    >
      {shadow && (
        <div
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(14_17_23/0.32),rgb(14_17_23/0.12)_55%,transparent)] blur-[6px]"
          style={{
            left: `${GROUND.x * 100}%`,
            top: `${GROUND.y * 100}%`,
            width: `${GROUND.w * 100}%`,
            height: `${GROUND.h * 100}%`,
          }}
        />
      )}
      <Image
        src={heroBlank}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        quality={90}
        draggable={false}
        className={cn("select-none object-contain", imageClassName)}
        style={imageStyle}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{
          width: HERO_SIZE.width,
          height: HERO_SIZE.height,
          transform: `scale(${scale})`,
          visibility: scale ? "visible" : "hidden",
        }}
      >
        <div
          ref={screenRef}
          className="absolute left-0 top-0 origin-top-left overflow-hidden"
          style={{ width: SCREEN_SIZE.width, height: SCREEN_SIZE.height, transform: SCREEN_MATRIX }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
