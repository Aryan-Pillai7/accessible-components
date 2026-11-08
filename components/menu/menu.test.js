import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createMenu } from './menu.js';

let button, menu, items, selected;

const expectOpen = (focused) => {
  expect(button.getAttribute('aria-expanded')).toBe('true');
  expect(menu.hidden).toBe(false);
  expect(document.activeElement).toBe(focused);
};

const expectClosedOnButton = () => {
  expect(button.getAttribute('aria-expanded')).toBe('false');
  expect(menu.hidden).toBe(true);
  expect(document.activeElement).toBe(button);
};

beforeEach(() => {
  document.body.innerHTML = `
    <main>
      <button id="btn" aria-haspopup="menu" aria-expanded="false" aria-controls="m">Actions</button>
      <div id="m" role="menu" aria-labelledby="btn">
        <button role="menuitem">Copy</button>
        <button role="menuitem">Cut</button>
        <button role="menuitem">Paste</button>
      </div>
      <button id="after">After</button>
    </main>`;
  button = document.getElementById('btn');
  menu = document.getElementById('m');
  items = [...menu.querySelectorAll('[role="menuitem"]')];
  selected = [];
  createMenu(button, { onSelect: (item) => selected.push(item.textContent) });
  button.focus();
});

test('has no axe violations when closed', async () => {
  await expectNoAxeViolations(document.body);
});

test('has no axe violations when open', async () => {
  press(button, 'ArrowDown');
  await expectNoAxeViolations(document.body);
});

test('starts closed with items out of the Tab order', () => {
  expectClosedOnButton();
  expect(items.every((item) => item.tabIndex === -1)).toBe(true);
});

test.each(['Enter', ' ', 'ArrowDown'])('key "%s" on the button opens on the first item', (key) => {
  press(button, key);
  expectOpen(items[0]);
});

test('ArrowUp on the button opens on the last item', () => {
  press(button, 'ArrowUp');
  expectOpen(items[2]);
});

test('ArrowDown and ArrowUp move through items and wrap', () => {
  press(button, 'ArrowDown');
  press(items[0], 'ArrowUp');
  expectOpen(items[2]);
  press(items[2], 'ArrowDown');
  expectOpen(items[0]);
  press(items[0], 'ArrowDown');
  expectOpen(items[1]);
});

test('Home and End jump to the first and last item', () => {
  press(button, 'ArrowDown');
  press(items[0], 'End');
  expectOpen(items[2]);
  press(items[2], 'Home');
  expectOpen(items[0]);
});

test('typeahead moves to the next match and cycles', () => {
  press(button, 'ArrowDown');
  press(items[0], 'p');
  expectOpen(items[2]);
  press(items[2], 'c');
  expectOpen(items[0]);
  press(items[0], 'C');
  expectOpen(items[1]);
});

test('typeahead with no match leaves focus alone', () => {
  press(button, 'ArrowDown');
  press(items[0], 'z');
  expectOpen(items[0]);
});

test('Escape closes and returns focus to the button', () => {
  press(button, 'ArrowDown');
  press(items[1], 'Escape');
  expectClosedOnButton();
});

test('Tab closes the menu and is not cancelled', () => {
  press(button, 'ArrowDown');
  const event = press(items[0], 'Tab');
  expect(event.defaultPrevented).toBe(false);
  expectClosedOnButton();
});

test.each(['Enter', ' '])('key "%s" activates the item and closes', (key) => {
  press(button, 'ArrowDown');
  press(items[1], key);
  expect(selected).toEqual(['Cut']);
  expectClosedOnButton();
});

test('clicking the button while open closes, even though focus moves to it first', () => {
  press(button, 'ArrowDown');
  button.focus();
  button.click();
  expect(menu.hidden).toBe(true);
  expect(button.getAttribute('aria-expanded')).toBe('false');
});

test('clicking elsewhere on the page closes the menu', () => {
  press(button, 'ArrowDown');
  document.querySelector('main').click();
  expect(menu.hidden).toBe(true);
});

test('moving focus outside closes the menu', () => {
  press(button, 'ArrowDown');
  document.getElementById('after').focus();
  expect(menu.hidden).toBe(true);
  expect(button.getAttribute('aria-expanded')).toBe('false');
});
