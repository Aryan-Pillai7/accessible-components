import { snapshotAttributes } from '../snapshot-attributes.js';

export function createTabs(tablist, { onChange } = {}) {
  const controller = new AbortController();
  const { signal } = controller;
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const panelOf = (tab) => document.getElementById(tab.getAttribute('aria-controls'));
  const restore = snapshotAttributes(
    [...tabs, ...tabs.map(panelOf)],
    ['aria-selected', 'tabindex', 'hidden'],
  );

  function select(selected) {
    for (const tab of tabs) {
      const isSelected = tab === selected;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      panelOf(tab).hidden = !isSelected;
    }
  }

  function activate(tab) {
    const changed = tab.getAttribute('aria-selected') !== 'true';
    select(tab);
    tab.focus();
    if (changed) onChange?.(tab);
  }

  tablist.addEventListener(
    'click',
    (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab) activate(tab);
    },
    { signal },
  );

  tablist.addEventListener(
    'keydown',
    (event) => {
      const index = tabs.indexOf(document.activeElement);
      const target = {
        ArrowRight: tabs[(index + 1) % tabs.length],
        ArrowLeft: tabs[(index - 1 + tabs.length) % tabs.length],
        Home: tabs[0],
        End: tabs[tabs.length - 1],
      }[event.key];
      if (!target) return;
      event.preventDefault();
      activate(target);
    },
    { signal },
  );

  select(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? tabs[0]);

  return {
    select: (index) => select(tabs[index]),
    destroy() {
      controller.abort();
      restore();
    },
  };
}
