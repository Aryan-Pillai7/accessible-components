import { readFileSync, readdirSync } from 'node:fs';

const names = readdirSync('components', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
const stylesheets = names.map((name) => [name, readFileSync(`components/${name}/component.css`, 'utf8')]);

test('all 8 components exist', () => {
  expect(names.sort()).toEqual([
    'accordion', 'combobox', 'menu', 'modal', 'radio-group', 'switch', 'tabs', 'toast',
  ]);
});

describe.each(stylesheets)('%s styles', (_name, css) => {
  test('uses no pixel units', () => {
    expect(css).not.toMatch(/\d+px\b/);
  });

  test('takes every color from tokens or system colors', () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i);
  });

  test('has a visible focus style', () => {
    expect(css).toMatch(/:focus-visible\s*{[^}]*outline:\s*var\(--focus-width\)/);
  });

  test('has forced-colors styles', () => {
    expect(css).toContain('@media (forced-colors: active)');
  });
});
