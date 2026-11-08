import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createModal } from './component.js';

// jsdom has HTMLDialogElement but doesn't implement these two methods.
HTMLDialogElement.prototype.showModal = function showModal() {
  this.open = true;
};
HTMLDialogElement.prototype.close = function close() {
  if (!this.open) return;
  this.open = false;
  this.dispatchEvent(new Event('close'));
};

let opener, dialog, first, last, modal, closed;

beforeEach(() => {
  document.body.innerHTML = `
    <button id="opener">Open</button>
    <dialog id="d" class="modal" aria-labelledby="title">
      <h2 id="title">Confirm</h2>
      <button id="first">Save</button>
      <button id="last" data-modal-close>Cancel</button>
    </dialog>`;
  opener = document.getElementById('opener');
  dialog = document.getElementById('d');
  first = document.getElementById('first');
  last = document.getElementById('last');
  closed = 0;
  modal = createModal(dialog, { onClose: () => closed++ });
  opener.focus();
});

test('has no axe violations when open', async () => {
  modal.open();
  await expectNoAxeViolations(document.body);
});

test('open moves focus to the first focusable element', () => {
  modal.open();
  expect(dialog.open).toBe(true);
  expect(document.activeElement).toBe(first);
});

test('open prefers an [autofocus] element', () => {
  last.setAttribute('autofocus', '');
  modal.open();
  expect(document.activeElement).toBe(last);
});

test('Tab from the last element wraps to the first', () => {
  modal.open();
  last.focus();
  const event = press(last, 'Tab');
  expect(event.defaultPrevented).toBe(true);
  expect(document.activeElement).toBe(first);
});

test('Shift+Tab from the first element wraps to the last', () => {
  modal.open();
  const event = press(first, 'Tab', { shiftKey: true });
  expect(event.defaultPrevented).toBe(true);
  expect(document.activeElement).toBe(last);
});

test('Tab between inner elements is left to the browser', () => {
  modal.open();
  expect(press(first, 'Tab').defaultPrevented).toBe(false);
});

test('Escape closes and returns focus to the opener', () => {
  modal.open();
  press(first, 'Escape');
  expect(dialog.open).toBe(false);
  expect(document.activeElement).toBe(opener);
  expect(closed).toBe(1);
});

test('Escape already handled by an inner popup does not close', () => {
  modal.open();
  first.addEventListener('keydown', (event) => event.preventDefault());
  press(first, 'Escape');
  expect(dialog.open).toBe(true);
});

test('a [data-modal-close] button closes and returns focus', () => {
  modal.open();
  last.focus();
  press(last, 'Enter');
  expect(dialog.open).toBe(false);
  expect(document.activeElement).toBe(opener);
});
