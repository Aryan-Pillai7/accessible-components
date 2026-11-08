import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createRadioGroup } from './radio-group.js';

let radios, changes;

const expectChecked = (index) => {
  expect(radios.map((r) => r.checked)).toEqual(radios.map((_, i) => i === index));
  expect(document.activeElement).toBe(radios[index]);
};

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
  createRadioGroup(document.getElementById('group'), { onChange: (value) => changes.push(value) });
  radios[0].focus();
});

test('has no axe violations', async () => {
  await expectNoAxeViolations(document.body);
});

test('Space checks the focused radio', () => {
  press(radios[0], ' ');
  expectChecked(0);
});

test.each(['ArrowDown', 'ArrowRight'])('%s moves to, and checks, the next radio', (key) => {
  press(radios[0], key);
  expectChecked(1);
});

test.each(['ArrowUp', 'ArrowLeft'])('%s moves to, and checks, the previous radio', (key) => {
  press(radios[1], key);
  expectChecked(0);
});

test('arrows wrap in both directions', () => {
  press(radios[0], 'ArrowUp');
  expectChecked(2);
  press(radios[2], 'ArrowDown');
  expectChecked(0);
});

test('disabled radios are skipped', () => {
  radios[1].disabled = true;
  press(radios[0], 'ArrowDown');
  expectChecked(2);
});

test('onChange reports the selected value', () => {
  press(radios[0], 'ArrowDown');
  expect(changes).toEqual(['m']);
});

test('Tab is left to the browser', () => {
  expect(press(radios[0], 'Tab').defaultPrevented).toBe(false);
});
