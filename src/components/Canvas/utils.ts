export const rand = (min: number, max: number) => Math.random() * (max - min) + min;
export const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));