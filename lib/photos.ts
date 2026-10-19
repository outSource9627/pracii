import type { StaticImageData } from "next/image";
import heroNight from "@/assets/images/scenes/hero-night-blank.jpg";
import livingRoom from "@/assets/images/scenes/living-room-blank.jpg";
import morning from "@/assets/images/scenes/morning-blank.jpg";
import nightTalk from "@/assets/images/scenes/night-talk-blank.jpg";

// Visualization photos with Pracii's printed face removed. `matrix` maps a flat
// 400×300 face onto the display, in the photo's own pixel space (1536×1024).
export type LivePhoto = { src: StaticImageData; matrix: string; alt: string };

export const PHOTOS = {
  heroNight: {
    src: heroNight,
    alt: "Pracii on a walnut desk at night, a warm lamp glowing behind it",
    matrix:
      "matrix3d(0.7957297, 0.078418615, 0, 0.000095851818, -0.0057989959, 0.6837024, 0, 0.000031787043, 0, 0, 1, 0, 912.88135, 251.17822, 0, 1)",
  },
  morning: {
    src: morning,
    alt: "Pracii on a bedside table in morning sunlight, next to a steel tumbler of chai and a phone",
    matrix:
      "matrix3d(0.7883033, 0.073494327, 0, 0.000098025573, 0.0027730775, 0.67639297, 0, 0.000035322236, 0, 0, 1, 0, 962.25116, 265.17508, 0, 1)",
  },
  livingRoom: {
    src: livingRoom,
    alt: "Pracii on a wooden coffee table in a warm Indian living room in the late afternoon",
    matrix:
      "matrix3d(0.7634242, 0.058107933, 0, 0.00008075361, -0.012984252, 0.66061375, 0, 0.000014406777, 0, 0, 1, 0, 951.91992, 236.41447, 0, 1)",
  },
  nightTalk: {
    src: nightTalk,
    alt: "Late evening: a young man rests his head on his hand, quietly talking to Pracii on his desk",
    matrix:
      "matrix3d(0.11046999, -0.028295301, 0, -0.00015132904, -0.2325737, 0.35055285, 0, -0.00012118384, 0, 0, 1, 0, 1156.4709, 420.93353, 0, 1)",
  },
} satisfies Record<string, LivePhoto>;
