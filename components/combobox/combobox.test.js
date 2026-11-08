import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createCombobox } from './combobox.js';

// jsdom has no layout, so it doesn't implement this.
Element.prototype.scrollIntoView = () => {};

let input, listbox, status, options, selected;

const type = (value) => {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
const activeId = () => input.getAttribute('aria-activedescendant');
const expanded = () => input.getAttribute('aria-expanded');

beforeEach(() => {
  document.body.innerHTML = `
    <main>
      <div id="root">
        <label for="c">Fruit</label>
        <input id="c" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="l" autocomplete="off" />
        <ul id="l" role="listbox" aria-label="Fruit">
          <li role="option" aria-selected="false">Apple</li>
          <li role="option" aria-selected="false">Apricot</li>
          <li role="option" aria-selected="false">Banana</li>
        </ul>
        <div role="status"></div>
      </div>
    </main>`;
  input = document.getElementById('c');
  listbox = document.getElementById('l');
  status = document.querySelector('[role="status"]');
  options = [...listbox.children];
  selected = [];
  createCombobox(document.getElementById('root'), { onSelect: (value) => selected.push(value) });
  input.focus();
});

test('has no axe violations when closed', async () => {
  await expectNoAxeViolations(document.body);
});

test('has no axe violations when open with an active option', async () => {
  press(input, 'ArrowDown');
  await expectNoAxeViolations(document.body);
});

test('starts collapsed', () => {
  expect(expanded()).toBe('false');
  expect(listbox.hidden).toBe(true);
});

test('typing filters, opens and announces the count', () => {
  type('ap');
  expect(expanded()).toBe('true');
  expect(options.map((o) => o.hidden)).toEqual([false, false, true]);
  expect(status.textContent).toBe('2 results available.');
});

test('announces a single result in the singular', () => {
  type('ban');
  expect(status.textContent).toBe('1 result available.');
});

test('no matches keeps the list closed and announces it', () => {
  type('zzz');
  expect(expanded()).toBe('false');
  expect(listbox.hidden).toBe(true);
  expect(status.textContent).toBe('No results.');
});

test('ArrowDown opens on the first option and keeps DOM focus on the input', () => {
  press(input, 'ArrowDown');
  expect(expanded()).toBe('true');
  expect(activeId()).toBe(options[0].id);
  expect(options[0].getAttribute('aria-selected')).toBe('true');
  expect(document.activeElement).toBe(input);
});

test('ArrowUp opens on the last option', () => {
  press(input, 'ArrowUp');
  expect(activeId()).toBe(options[2].id);
});

test('arrows wrap and clear the previous selection', () => {
  press(input, 'ArrowDown');
  press(input, 'ArrowUp');
  expect(activeId()).toBe(options[2].id);
  expect(options[0].getAttribute('aria-selected')).toBe('false');
  press(input, 'ArrowDown');
  expect(activeId()).toBe(options[0].id);
});

test('arrows skip filtered-out options', () => {
  type('ap');
  press(input, 'ArrowUp');
  expect(activeId()).toBe(options[1].id);
});

test('Alt+ArrowDown opens without choosing an option', () => {
  press(input, 'ArrowDown', { altKey: true });
  expect(expanded()).toBe('true');
  expect(activeId()).toBeNull();
});

test('Alt+ArrowUp closes', () => {
  press(input, 'ArrowDown');
  press(input, 'ArrowUp', { altKey: true });
  expect(expanded()).toBe('false');
  expect(document.activeElement).toBe(input);
});

test('Enter accepts the active option and closes', () => {
  press(input, 'ArrowDown');
  press(input, 'ArrowDown');
  const event = press(input, 'Enter');
  expect(event.defaultPrevented).toBe(true);
  expect(input.value).toBe('Apricot');
  expect(expanded()).toBe('false');
  expect(activeId()).toBeNull();
  expect(selected).toEqual(['Apricot']);
  expect(document.activeElement).toBe(input);
});

test('Enter with no active option is left to the form', () => {
  type('ap');
  expect(press(input, 'Enter').defaultPrevented).toBe(false);
});

test('Escape closes first, and clears the text when already closed', () => {
  type('ap');
  press(input, 'Escape');
  expect(expanded()).toBe('false');
  expect(input.value).toBe('ap');
  expect(status.textContent).toBe('');
  press(input, 'Escape');
  expect(input.value).toBe('');
  expect(document.activeElement).toBe(input);
});

test('Escape with nothing to close or clear is not cancelled', () => {
  expect(press(input, 'Escape').defaultPrevented).toBe(false);
});

test.each(['Home', 'End', 'ArrowLeft', 'ArrowRight'])('%s returns visual focus to the text', (key) => {
  press(input, 'ArrowDown');
  const event = press(input, key);
  expect(activeId()).toBeNull();
  expect(event.defaultPrevented).toBe(false);
  expect(expanded()).toBe('true');
});

test('blur closes without changing the value', () => {
  type('ap');
  press(input, 'ArrowDown');
  input.blur();
  expect(expanded()).toBe('false');
  expect(input.value).toBe('ap');
});

test('Tab is left to the browser', () => {
  press(input, 'ArrowDown');
  expect(press(input, 'Tab').defaultPrevented).toBe(false);
});

test('clicking an option accepts it without blurring the input', () => {
  type('b');
  const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
  options[2].dispatchEvent(down);
  options[2].click();
  expect(down.defaultPrevented).toBe(true);
  expect(input.value).toBe('Banana');
  expect(document.activeElement).toBe(input);
});
