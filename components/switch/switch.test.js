import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createSwitch } from './switch.js';

let input, api, changes;

beforeEach(() => {
  document.body.innerHTML = `
    <main>
      <label for="s">Notifications</label>
      <input id="s" type="checkbox" role="switch" />
    </main>`;
  input = document.getElementById('s');
  changes = [];
  api = createSwitch(input, { onChange: (checked) => changes.push(checked) });
  input.focus();
});

test('has no axe violations', async () => {
  await expectNoAxeViolations(document.body);
});

test('Space and Enter toggle in place, and Enter cannot submit a form', () => {
  press(input, ' ');
  expect(input.checked).toBe(true);
  const enter = press(input, 'Enter');
  expect(input.checked).toBe(false);
  expect(enter.defaultPrevented).toBe(true);
  expect(document.activeElement).toBe(input);
});

test('onChange fires once per toggle with the new state', () => {
  press(input, 'Enter');
  press(input, 'Enter');
  expect(changes).toEqual([true, false]);
});

test('destroy() removes the Enter shortcut and the hook', () => {
  api.destroy();
  press(input, 'Enter');
  expect(input.checked).toBe(false);
  press(input, ' ');
  expect(input.checked).toBe(true);
  expect(changes).toEqual([]);
});
