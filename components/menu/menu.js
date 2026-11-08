import { snapshotAttributes } from '../snapshot-attributes.js';

export function createMenu(button, { onSelect } = {}) {
  const controller = new AbortController();
  const { signal } = controller;
  const menu = document.getElementById(button.getAttribute('aria-controls'));
  const items = [...menu.querySelectorAll('[role="menuitem"]')];
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const restore = snapshotAttributes([button, menu, ...items], [
    'aria-expanded',
    'hidden',
    'tabindex',
  ]);

  function open(item) {
    button.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
    item.focus();
  }

  function close() {
    button.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
  }

  function closeAndRefocus() {
    button.focus();
    close();
  }

  // Next item, after the focused one, whose label starts with the typed character.
  function matchTypeahead(char) {
    const start = items.indexOf(document.activeElement);
    const ordered = [...items.slice(start + 1), ...items.slice(0, start + 1)];
    return ordered.find((item) => item.textContent.trim().toLowerCase().startsWith(char));
  }

  close();
  for (const item of items) item.tabIndex = -1;

  button.addEventListener(
    'click',
    () => {
      if (isOpen()) close();
      else open(items[0]);
    },
    { signal },
  );

  button.addEventListener(
    'keydown',
    (event) => {
      const target = { ArrowDown: items[0], ArrowUp: items[items.length - 1] }[event.key];
      if (!target) return;
      event.preventDefault();
      open(target);
    },
    { signal },
  );

  menu.addEventListener(
    'click',
    (event) => {
      const item = event.target.closest('[role="menuitem"]');
      if (!item) return;
      closeAndRefocus();
      onSelect?.(item);
    },
    { signal },
  );

  // The button is excluded because its own click handler toggles the menu.
  menu.addEventListener(
    'focusout',
    ({ relatedTarget }) => {
      if (isOpen() && relatedTarget && relatedTarget !== button && !menu.contains(relatedTarget)) {
        close();
      }
    },
    { signal },
  );

  document.addEventListener(
    'click',
    ({ target }) => {
      if (isOpen() && !button.contains(target) && !menu.contains(target)) close();
    },
    { signal },
  );

  menu.addEventListener(
    'keydown',
    (event) => {
      const index = items.indexOf(document.activeElement);
      const isCharacter = event.key.length === 1 && event.key !== ' ';
      const target = {
        ArrowDown: items[(index + 1) % items.length],
        ArrowUp: items[(index - 1 + items.length) % items.length],
        Home: items[0],
        End: items[items.length - 1],
      }[event.key];

      if (event.key === 'Escape') {
        event.preventDefault();
        closeAndRefocus();
      } else if (event.key === 'Tab') {
        // Not cancelled: Tab continues from the button to the next page control.
        closeAndRefocus();
      } else if (target) {
        event.preventDefault();
        target.focus();
      } else if (isCharacter && !event.ctrlKey && !event.metaKey && !event.altKey) {
        matchTypeahead(event.key.toLowerCase())?.focus();
      }
    },
    { signal },
  );

  return {
    destroy() {
      controller.abort();
      restore();
    },
  };
}
