import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createCombobox } from './combobox.js';

// jsdom has no layout, so it doesn't implement this.
Element.prototype.scrollIntoView = () => {};

let input, listbox, status, options, api, selections, initialMarkup;

const type = (value) => {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
const activeId = () => input.getAttribute('aria-activedescendant');

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
  initialMarkup = document.body.innerHTML;
  input = document.getElementById('c');
  listbox = document.getElementById('l');
  status = document.querySelector('[role="status"]');
  options = [...listbox.children];
  selections = [];
  api = createCombobox(document.getElementById('root'), {
    onSelect: (value) => selections.push([value, input.value, listbox.hidden]),
  });
  input.focus();
});

test('has no axe violations with an active option', async () => {
  press(input, 'ArrowDown');
  await expectNoAxeViolations(document.body);
});

test('typing announces the count and arrows move the active option, keeping focus', () => {
  type('zzz');
  expect(status.textContent).toBe('No results.');
  expect(input.getAttribute('aria-expanded')).toBe('false');

  type('ban');
  expect(status.textContent).toBe('1 result available.');

  type('ap');
  expect(status.textContent).toBe('2 results available.');
  expect(input.getAttribute('aria-expanded')).toBe('true');

  press(input, 'ArrowDown');
  expect(activeId()).toBe(options[0].id);
  expect(options[0].getAttribute('aria-selected')).toBe('true');
  press(input, 'ArrowDown');
  press(input, 'ArrowDown');
  expect(activeId()).toBe(options[0].id);
  press(input, 'ArrowUp');
  expect(activeId()).toBe(options[1].id);
  expect(options[0].getAttribute('aria-selected')).toBe('false');
  expect(document.activeElement).toBe(input);
});

test('Escape closes the list first, then clears the text', () => {
  type('ap');
  press(input, 'Escape');
  expect(listbox.hidden).toBe(true);
  expect(input.value).toBe('ap');
  expect(status.textContent).toBe('');

  press(input, 'Escape');
  expect(input.value).toBe('');
  expect(press(input, 'Escape').defaultPrevented).toBe(false);
});

test('onSelect fires once with the value, after the list closes', () => {
  press(input, 'ArrowDown');
  press(input, 'ArrowDown');
  press(input, 'Enter');
  expect(selections).toEqual([['Apricot', 'Apricot', true]]);
});

test('destroy() restores the markup and removes listeners', () => {
  type('ap');
  press(input, 'ArrowDown');
  input.value = '';
  api.destroy();
  expect(document.body.innerHTML).toBe(initialMarkup);

  type('ap');
  expect(input.getAttribute('aria-expanded')).toBe('false');
  expect(status.textContent).toBe('');
});
