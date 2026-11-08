import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createAccordion } from './accordion.js';

let triggers, panels, toggles;

beforeEach(() => {
  document.body.innerHTML = `
    <div id="root">
      ${[0, 1, 2]
        .map(
          (i) => `
        <h3><button id="b${i}" aria-expanded="${i === 0}" aria-controls="p${i}">Section ${i}</button></h3>
        <div id="p${i}" role="region" aria-labelledby="b${i}">Content ${i}</div>`,
        )
        .join('')}
    </div>`;
  triggers = [...document.querySelectorAll('button')];
  panels = [...document.querySelectorAll('[role="region"]')];
  toggles = [];
  createAccordion(document.getElementById('root'), {
    onToggle: (trigger, expanded) => toggles.push([trigger.id, expanded]),
  });
  triggers[0].focus();
});

test('has no axe violations', async () => {
  await expectNoAxeViolations(document.body);
});

test('initial panel visibility follows aria-expanded', () => {
  expect(panels.map((p) => p.hidden)).toEqual([false, true, true]);
});

test.each(['Enter', ' '])('key "%s" toggles the focused section', (key) => {
  press(triggers[0], key);
  expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
  expect(panels[0].hidden).toBe(true);
  press(triggers[0], key);
  expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
  expect(panels[0].hidden).toBe(false);
  expect(document.activeElement).toBe(triggers[0]);
});

test('sections open independently', () => {
  press(triggers[1], 'Enter');
  expect(panels.map((p) => p.hidden)).toEqual([false, false, true]);
});

test('ArrowDown and ArrowUp move focus and wrap', () => {
  press(triggers[0], 'ArrowDown');
  expect(document.activeElement).toBe(triggers[1]);
  press(triggers[1], 'ArrowUp');
  press(triggers[0], 'ArrowUp');
  expect(document.activeElement).toBe(triggers[2]);
  press(triggers[2], 'ArrowDown');
  expect(document.activeElement).toBe(triggers[0]);
});

test('Home and End move focus to the first and last header', () => {
  press(triggers[0], 'End');
  expect(document.activeElement).toBe(triggers[2]);
  press(triggers[2], 'Home');
  expect(document.activeElement).toBe(triggers[0]);
});

test('arrow keys do not change expanded state', () => {
  press(triggers[0], 'ArrowDown');
  expect(triggers.map((t) => t.getAttribute('aria-expanded'))).toEqual(['true', 'false', 'false']);
});

test('keys pressed inside a panel are ignored', () => {
  panels[0].innerHTML = '<input id="field" aria-label="Field" />';
  const field = document.getElementById('field');
  field.focus();
  expect(press(field, 'ArrowDown').defaultPrevented).toBe(false);
  expect(document.activeElement).toBe(field);
});

test('onToggle reports the trigger and new state', () => {
  press(triggers[1], 'Enter');
  expect(toggles).toEqual([['b1', true]]);
});
