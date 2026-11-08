export function createAccordion(root, { onToggle } = {}) {
  const triggers = [...root.querySelectorAll('[aria-expanded][aria-controls]')];
  const panelOf = (trigger) => document.getElementById(trigger.getAttribute('aria-controls'));

  for (const trigger of triggers) {
    panelOf(trigger).hidden = trigger.getAttribute('aria-expanded') !== 'true';
  }

  root.addEventListener('click', (event) => {
    const trigger = event.target.closest('[aria-expanded][aria-controls]');
    if (!trigger) return;
    const expanded = trigger.getAttribute('aria-expanded') !== 'true';
    trigger.setAttribute('aria-expanded', String(expanded));
    panelOf(trigger).hidden = !expanded;
    onToggle?.(trigger, expanded);
  });

  root.addEventListener('keydown', (event) => {
    const index = triggers.indexOf(event.target);
    if (index === -1) return;
    const target = {
      ArrowDown: triggers[(index + 1) % triggers.length],
      ArrowUp: triggers[(index - 1 + triggers.length) % triggers.length],
      Home: triggers[0],
      End: triggers[triggers.length - 1],
    }[event.key];
    if (!target) return;
    event.preventDefault();
    target.focus();
  });
}
