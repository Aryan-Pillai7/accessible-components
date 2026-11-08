const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function createModal(dialog, { onClose } = {}) {
  const controller = new AbortController();
  const { signal } = controller;
  let returnFocusTo = null;

  const focusables = () =>
    [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => !el.closest('[hidden]'));

  function open() {
    returnFocusTo = document.activeElement;
    dialog.showModal();
    (dialog.querySelector('[autofocus]') ?? focusables()[0]).focus();
  }

  function close() {
    dialog.close();
  }

  function destroy() {
    controller.abort();
    if (dialog.open) {
      dialog.close();
      returnFocusTo.focus();
    }
  }

  dialog.addEventListener(
    'keydown',
    (event) => {
      // A popup inside the dialog cancels Escape when it uses the key to close itself.
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault();
        close();
      }
      if (event.key !== 'Tab') return;

      // showModal() makes the page inert, but Tab can still leave for the browser UI.
      const items = focusables();
      const edge = event.shiftKey ? items[0] : items[items.length - 1];
      if (document.activeElement === edge) {
        event.preventDefault();
        (event.shiftKey ? items[items.length - 1] : items[0]).focus();
      }
    },
    { signal },
  );

  dialog.addEventListener(
    'click',
    (event) => {
      if (event.target.closest('[data-modal-close]')) close();
    },
    { signal },
  );

  dialog.addEventListener(
    'close',
    () => {
      returnFocusTo.focus();
      onClose?.();
    },
    { signal },
  );

  return { open, close, destroy };
}
