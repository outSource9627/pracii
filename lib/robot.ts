// Geometry of the hero robot cut-out (assets/images/pracii-hero-blank.png).
// The screen quad was measured from the photo; SCREEN_MATRIX maps a flat
// 400×300 box onto it so faces and UI can be drawn "on" the display.
export const HERO_SIZE = { width: 1028, height: 955 } as const;
export const SCREEN_SIZE = { width: 400, height: 300 } as const;
export const SCREEN_MATRIX =
  "matrix3d(1.0467666, 0.09627759, 0, 0.00014574231, -0.024471513, 0.98264018, 0, 0.000045729477, 0, 0, 1, 0, 325.70999, 62.259998, 0, 1)";

// Where the wheels meet the ground, as fractions of the cut-out, for the contact shadow.
export const GROUND = { x: 0.52, y: 0.93, w: 0.92, h: 0.12 } as const;
