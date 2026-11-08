import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createMenu } from './menu.js';

let button, menu, items, api, selections, initialMarkup;

beforeEach(() => {
  document.body.innerHTML = `
    <main>
      <button id="btn" aria-haspopup="menu" aria-expanded="false" aria-controls="m">Actions</button>
      <div id="m" role="menu" aria-labelledby="btn">
        <button role="menuitem">Copy</button>
        <button role="menuitem">Cut</button>
        <button role="menuitem">Paste</button>
      </div>
    </main>`;
  initialMarkup = document.body.innerHTML;
  button = document.getElementById('btn');
  menu = document.getElementById('m');
  items = [...menu.querySelectorAll('[role="menuitem"]')];
  selections = [];
  api = createMenu(button, {
    onSelect: (item) => selections.push([item.textContent, document.activeElement]),
  });
  button.focus();
});

test('has no axe violations while open', async () => {
  press(button, 'ArrowDown');
  await expectNoAxeViolations(document.body);
});

test('moves focus by arrows and typeahead, and Escape returns to the button', () => {
  press(button, 'ArrowUp');
  expect(document.activeElement).toBe(items[2]);
  expect(button.getAttribute('aria-expanded')).toBe('true');
  expect(menu.hidden).toBe(false);

  press(items[2], 'ArrowDown');
  expect(document.activeElement).toBe(items[0]);
  press(items[0], 'p');
  expect(document.activeElement).toBe(items[2]);
  press(items[2], 'c');
  expect(document.activeElement).toBe(items[0]);
  press(items[0], 'c');
  expect(document.activeElement).toBe(items[1]);

  press(items[1], 'Escape');
  expect(document.activeElement).toBe(button);
  expect(button.getAttribute('aria-expanded')).toBe('false');
  expect(menu.hidden).toBe(true);
});

test('the button toggles the menu and an outside click closes it', () => {
  button.click();
  expect(menu.hidden).toBe(false);
  // A mouse click focuses the button first; that must not reopen the menu.
  button.focus();
  button.click();
  expect(menu.hidden).toBe(true);

  button.click();
  document.querySelector('main').click();
  expect(menu.hidden).toBe(true);
});

test('onSelect fires once with the item, after focus has returned', () => {
  press(button, 'ArrowDown');
  press(items[1], 'Enter');
  expect(selections).toEqual([['Cut', button]]);
  expect(menu.hidden).toBe(true);
});

test('destroy() restores the markup and removes every listener', () => {
  button.click();
  api.destroy();
  expect(document.body.innerHTML).toBe(initialMarkup);

  button.click();
  items[0].click();
  expect(button.getAttribute('aria-expanded')).toBe('false');
  expect(selections).toEqual([]);
});
