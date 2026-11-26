// Mobile-first breakpoints - keep in sync with src/styles/variables.css
export const BREAKPOINTS = [
  { name: 'Mobile', min: 0 },
  { name: 'Large Mobile', min: 576 },
  { name: 'Tablet', min: 768 },
  { name: 'Laptop', min: 1024 },
  { name: 'Desktop', min: 1280 },
];

export const getBreakpoint = (width = window.innerWidth) =>
  [...BREAKPOINTS].reverse().find((b) => width >= b.min).name;

// true when the primary input can really hover (mouse / trackpad)
export const canHover = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;
