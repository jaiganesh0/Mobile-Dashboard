export const percent = (value, total) => Math.round((value / total) * 100);

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
