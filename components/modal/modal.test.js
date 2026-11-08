import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createModal } from './modal.js';

// jsdom has HTMLDialogElement but doesn't implement these two methods.
HTMLDialogElement.prototype.showModal = function showModal() {
  this.open = true;
};
HTMLDialogElement.prototype.close = function close() {
  if (!this.open) return;
  this.open = false;
  this.dispatchEvent(new Event('close'));
};

let opener, dialog, first, last, modal, onCloseCalls;

beforeEach(() => {
  document.body.innerHTML = `
    <main><button id="opener">Open</button></main>
    <dialog id="d" aria-labelledby="title">
      <h2 id="title">Confirm</h2>
      <button id="first">Save</button>
      <button id="last" data-modal-close>Cancel</button>
    </dialog>`;
  opener = document.getElementById('opener');
  dialog = document.getElementById('d');
  first = document.getElementById('first');
  last = document.getElementById('last');
  onCloseCalls = [];
  modal = createModal(dialog, {
    onClose: () => onCloseCalls.push(document.activeElement),
  });
  opener.focus();
});

test('has no axe violations while open', async () => {
  modal.open();
  await expectNoAxeViolations(document.body);
});

test('traps Tab in both directions and returns focus on Escape', () => {
  modal.open();
  expect(document.activeElement).toBe(first);

  press(first, 'Tab', { shiftKey: true });
  expect(document.activeElement).toBe(last);
  press(last, 'Tab');
  expect(document.activeElement).toBe(first);

  press(first, 'Escape');
  expect(dialog.open).toBe(false);
  expect(document.activeElement).toBe(opener);
});

test('open(), close() and [data-modal-close] drive the dialog', () => {
  modal.open();
  expect(dialog.open).toBe(true);
  modal.close();
  expect(dialog.open).toBe(false);

  modal.open();
  last.click();
  expect(dialog.open).toBe(false);
});

test('onClose fires once, after focus has returned', () => {
  modal.open();
  press(first, 'Escape');
  expect(onCloseCalls).toEqual([opener]);
});

test('destroy() closes silently, returns focus and removes listeners', () => {
  modal.open();
  modal.destroy();
  expect(dialog.open).toBe(false);
  expect(document.activeElement).toBe(opener);
  expect(onCloseCalls).toEqual([]);

  dialog.showModal();
  press(first, 'Escape');
  last.click();
  expect(dialog.open).toBe(true);
});
