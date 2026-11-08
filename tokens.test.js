import { readFileSync } from 'node:fs';

const css = readFileSync('tokens.css', 'utf8');
const tokens = Object.fromEntries(
  [...css.matchAll(/(--color-[\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [m[1], m[2]]),
);
const pairs = [...css.matchAll(/@contrast\s+([\d.]+)\s+(--[\w-]+)\s+on\s+(--[\w-]+)/g)].map(
  ([, min, fg, bg]) => ({ min: Number(min), fg, bg }),
);

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('contrast formula matches known values', () => {
  expect(contrast('#000000', '#ffffff')).toBeCloseTo(21);
  expect(contrast('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
});

test('pairs are declared', () => {
  expect(pairs.length).toBeGreaterThan(0);
});

test.each(pairs)('$fg on $bg is at least $min:1', ({ fg, bg, min }) => {
  expect(tokens[fg]).toBeDefined();
  expect(tokens[bg]).toBeDefined();
  expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(min);
});

test('every color token is covered by a pair', () => {
  const paired = new Set(pairs.flatMap((p) => [p.fg, p.bg]));
  expect(Object.keys(tokens).filter((t) => !paired.has(t))).toEqual([]);
});
