import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createSwitch } from './switch.js';

let input, changes;

beforeEach(() => {
  document.body.innerHTML = `
    <main>
      <label for="s">Notifications</label>
      <input id="s" type="checkbox" role="switch" />
    </main>`;
  input = document.getElementById('s');
  changes = [];
  createSwitch(input, { onChange: (checked) => changes.push(checked) });
  input.focus();
});

test('has no axe violations', async () => {
  await expectNoAxeViolations(document.body);
});

test('off and on states have no axe violations', async () => {
  press(input, ' ');
  await expectNoAxeViolations(document.body);
});

test('Space toggles and keeps focus', () => {
  press(input, ' ');
  expect(input.checked).toBe(true);
  press(input, ' ');
  expect(input.checked).toBe(false);
  expect(document.activeElement).toBe(input);
});

test('Enter toggles and is cancelled so it cannot submit a form', () => {
  const event = press(input, 'Enter');
  expect(input.checked).toBe(true);
  expect(event.defaultPrevented).toBe(true);
  expect(document.activeElement).toBe(input);
});

test('onChange reports the new state', () => {
  press(input, ' ');
  press(input, 'Enter');
  expect(changes).toEqual([true, false]);
});

test('a disabled switch does not toggle', () => {
  input.disabled = true;
  press(input, 'Enter');
  expect(input.checked).toBe(false);
});
