import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createRadioGroup } from './radio-group.js';

let radios, api, changes;

beforeEach(() => {
  document.body.innerHTML = `
    <main>
      <fieldset id="group">
        <legend>Size</legend>
        ${['s', 'm', 'l']
          .map((v) => `<label><input type="radio" name="size" value="${v}" /> ${v}</label>`)
          .join('')}
      </fieldset>
    </main>`;
  radios = [...document.querySelectorAll('input')];
  changes = [];
  api = createRadioGroup(document.getElementById('group'), {
    onChange: (value) => changes.push(value),
  });
  radios[0].focus();
});

test('has no axe violations', async () => {
  await expectNoAxeViolations(document.body);
});

test('arrows move focus and selection together, wrap, and skip disabled radios', () => {
  radios[1].disabled = true;
  press(radios[0], 'ArrowDown');
  expect(document.activeElement).toBe(radios[2]);
  expect(radios[2].checked).toBe(true);

  press(radios[2], 'ArrowRight');
  expect(document.activeElement).toBe(radios[0]);
  expect(radios[0].checked).toBe(true);

  press(radios[0], 'ArrowUp');
  expect(document.activeElement).toBe(radios[2]);
  expect(radios[2].checked).toBe(true);
});

test('onChange fires once per move with the selected value', () => {
  press(radios[0], 'ArrowDown');
  expect(changes).toEqual(['m']);
});

test('destroy() removes the key handling and the hook', () => {
  api.destroy();
  const event = press(radios[0], 'ArrowDown');
  expect(event.defaultPrevented).toBe(false);
  radios[1].click();
  expect(changes).toEqual([]);
});
