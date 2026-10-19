"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { Face, type Expression } from "@/components/robot/face";
import { PhotoStage } from "@/components/robot/photo-stage";
import { RobotStage } from "@/components/robot/robot-stage";
import { AgendaScreen, TeamScreen, Waveform } from "@/components/robot/screens";
import { useBlink, useGaze } from "@/components/robot/use-gaze";
import { Bubble } from "@/components/ui/chat";
import type { LivePhoto } from "@/lib/photos";
import { cn } from "@/lib/motion";

export type Screen = "agenda" | "team" | "listening" | Expression;

/** The product cut-out with something live on its display. */
export function LiveRobot({ screen = "happy", className, sizes }: { screen?: Screen; className?: string; sizes: string }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const gaze = useGaze(screenRef);
  const blink = useBlink();
  return (
    <RobotStage screenRef={screenRef} sizes={sizes} className={className}>
      {screen === "agenda" && <AgendaScreen />}
      {screen === "team" && <TeamScreen />}
      {screen === "listening" && (
        <>
          <Face expression="listening" gx={gaze.gx} gy={gaze.gy} blink={blink} />
          <Waveform className="absolute bottom-[16px] left-1/2 -translate-x-1/2" />
        </>
      )}
      {screen !== "agenda" && screen !== "team" && screen !== "listening" && (
        <Face expression={screen} gx={gaze.gx} gy={gaze.gy} blink={blink} />
      )}
    </RobotStage>
  );
}

/** A visualization photo where Pracii's face is live. */
export function LivePhotoFace({
  photo,
  expression = "happy",
  position,
  className,
  sizes,
}: {
  photo: LivePhoto;
  expression?: Expression;
  position?: [number, number];
  className?: string;
  sizes: string;
}) {
  const screenRef = useRef<HTMLDivElement>(null);
  const gaze = useGaze(screenRef);
  const blink = useBlink();
  return (
    <PhotoStage photo={photo} position={position} screenRef={screenRef} className={className} sizes={sizes}>
      <Face expression={expression} gx={gaze.gx} gy={gaze.gy} blink={blink} />
    </PhotoStage>
  );
}

export type SceneBubble = { from: "you" | "pracii"; text: string; className: string; tail: "bottom-left" | "bottom-right" };

/** Cut-out illustration with speech bubbles that pop in when `play` is true. */
export function SceneWithBubbles({
  image,
  alt,
  bubbles,
  play,
  className,
  sizes,
}: {
  image: StaticImageData;
  alt: string;
  bubbles: SceneBubble[];
  play: boolean;
  className?: string;
  sizes: string;
}) {
  return (
    <div className={cn("relative", className)} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
      <Image src={image} alt={alt} fill sizes={sizes} className="object-contain" />
      {bubbles.map((b, i) => (
        <Bubble key={i} from={b.from} tail={b.tail} play={play} delay={0.4 + i * 1.1} className={b.className}>
          {b.text}
        </Bubble>
      ))}
    </div>
  );
}
