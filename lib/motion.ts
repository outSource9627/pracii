export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.83, 0, 0.17, 1] as const;

export const rand = (min: number, max: number) => min + Math.random() * (max - min);
export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
