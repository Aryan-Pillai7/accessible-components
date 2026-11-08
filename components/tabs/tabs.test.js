import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createTabs } from './tabs.js';

let tablist, tabs, panels, api, changes, initialMarkup;

const selectedState = () => ({
  selected: tabs.map((tab) => tab.getAttribute('aria-selected')),
  tabindex: tabs.map((tab) => tab.tabIndex),
  panelsHidden: panels.map((panel) => panel.hidden),
});
const stateFor = (index) => ({
  selected: tabs.map((_, i) => String(i === index)),
  tabindex: tabs.map((_, i) => (i === index ? 0 : -1)),
  panelsHidden: panels.map((_, i) => i !== index),
});

beforeEach(() => {
  const ids = [0, 1, 2];
  document.body.innerHTML = `<main>
    <div role="tablist" aria-label="Sections" id="list">${ids
      .map(
        (i) =>
          `<button role="tab" id="t${i}" aria-controls="p${i}" aria-selected="${i === 0}">Tab ${i}</button>`,
      )
      .join('')}</div>
    ${ids.map((i) => `<div role="tabpanel" id="p${i}" aria-labelledby="t${i}" tabindex="0">Panel ${i}</div>`).join('')}
  </main>`;
  initialMarkup = document.body.innerHTML;
  tablist = document.getElementById('list');
  tabs = [...document.querySelectorAll('[role="tab"]')];
  panels = [...document.querySelectorAll('[role="tabpanel"]')];
  changes = [];
  api = createTabs(tablist, { onChange: (tab) => changes.push(tab) });
  tabs[0].focus();
});

test('has no axe violations', async () => {
  await expectNoAxeViolations(document.body);
});

test('arrows, Home and End move roving tabindex, selection, panel and focus', () => {
  const steps = [
    ['ArrowLeft', 2],
    ['ArrowRight', 0],
    ['ArrowRight', 1],
    ['End', 2],
    ['Home', 0],
  ];
  for (const [key, expected] of steps) {
    press(document.activeElement, key);
    expect(selectedState()).toEqual(stateFor(expected));
    expect(document.activeElement).toBe(tabs[expected]);
  }
});

test('select() updates state without moving focus or calling onChange', () => {
  api.select(2);
  expect(selectedState()).toEqual(stateFor(2));
  expect(document.activeElement).toBe(tabs[0]);
  expect(changes).toEqual([]);
});

test('onChange fires once with the new tab, and not when reselecting', () => {
  press(tabs[0], 'ArrowRight');
  tabs[1].click();
  expect(changes).toEqual([tabs[1]]);
});

test('destroy() restores the markup and removes listeners', () => {
  press(tabs[0], 'ArrowRight');
  api.destroy();
  expect(document.body.innerHTML).toBe(initialMarkup);

  press(tabs[0], 'ArrowRight');
  expect(changes).toHaveLength(1);
  expect(tabs[1].getAttribute('aria-selected')).toBe('false');
});
