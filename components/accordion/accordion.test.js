import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createAccordion } from './accordion.js';

let triggers, panels, api, toggles, initialMarkup;

beforeEach(() => {
  document.body.innerHTML = `<main><div id="root">${[0, 1, 2]
    .map(
      (i) => `
      <h3><button id="b${i}" aria-expanded="${i === 0}" aria-controls="p${i}">Section ${i}</button></h3>
      <div id="p${i}" role="region" aria-labelledby="b${i}">Content ${i}</div>`,
    )
    .join('')}</div></main>`;
  initialMarkup = document.body.innerHTML;
  triggers = [...document.querySelectorAll('button')];
  panels = [...document.querySelectorAll('[role="region"]')];
  toggles = [];
  api = createAccordion(document.getElementById('root'), {
    onToggle: (trigger, expanded) => toggles.push([trigger, expanded]),
  });
  triggers[0].focus();
});

test('has no axe violations', async () => {
  await expectNoAxeViolations(document.body);
});

test('arrows, Home and End move focus; Enter toggles the focused section', () => {
  press(triggers[0], 'ArrowUp');
  expect(document.activeElement).toBe(triggers[2]);
  press(triggers[2], 'ArrowDown');
  expect(document.activeElement).toBe(triggers[0]);
  press(triggers[0], 'End');
  expect(document.activeElement).toBe(triggers[2]);
  press(triggers[2], 'Home');
  expect(document.activeElement).toBe(triggers[0]);

  press(triggers[0], 'ArrowDown');
  press(triggers[1], 'Enter');
  expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
  expect(panels.map((panel) => panel.hidden)).toEqual([false, false, true]);
  expect(document.activeElement).toBe(triggers[1]);
});

test('onToggle fires once per change with the trigger and new state', () => {
  press(triggers[1], 'Enter');
  press(triggers[1], 'ArrowDown');
  press(triggers[0], ' ');
  expect(toggles).toEqual([
    [triggers[1], true],
    [triggers[0], false],
  ]);
});

test('destroy() restores the markup and removes listeners', () => {
  press(triggers[1], 'Enter');
  api.destroy();
  expect(document.body.innerHTML).toBe(initialMarkup);

  triggers[1].click();
  expect(triggers[1].getAttribute('aria-expanded')).toBe('false');
  expect(toggles).toHaveLength(1);
});
