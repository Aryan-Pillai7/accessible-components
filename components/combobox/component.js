// `root` contains the input[role="combobox"], its [role="listbox"] and a [role="status"].
export function createCombobox(root, { onSelect } = {}) {
  const input = root.querySelector('[role="combobox"]');
  const listbox = root.querySelector('[role="listbox"]');
  const status = root.querySelector('[role="status"]');
  const options = [...listbox.querySelectorAll('[role="option"]')];
  options.forEach((option, i) => {
    option.id = `${listbox.id}-${i}`;
  });

  const isOpen = () => input.getAttribute('aria-expanded') === 'true';
  const visible = () => options.filter((option) => !option.hidden);
  const active = () => document.getElementById(input.getAttribute('aria-activedescendant'));

  function setActive(option) {
    active()?.setAttribute('aria-selected', 'false');
    if (!option) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    option.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', option.id);
    option.scrollIntoView({ block: 'nearest' });
  }

  function setExpanded(expanded) {
    input.setAttribute('aria-expanded', String(expanded));
    listbox.hidden = !expanded;
    if (!expanded) setActive(null);
  }

  function announce() {
    const count = visible().length;
    if (count === 0) status.textContent = 'No results.';
    else status.textContent = `${count} ${count === 1 ? 'result' : 'results'} available.`;
  }

  function filter() {
    const query = input.value.trim().toLowerCase();
    for (const option of options) {
      option.hidden = !option.textContent.trim().toLowerCase().includes(query);
    }
  }

  // An empty listbox is invalid, so a search with no matches keeps it closed.
  function openList() {
    filter();
    setActive(null);
    setExpanded(visible().length > 0);
    announce();
  }

  function close() {
    setExpanded(false);
    status.textContent = '';
  }

  function accept(option) {
    input.value = option.textContent.trim();
    close();
    onSelect?.(input.value);
  }

  function move(direction) {
    if (!isOpen()) openList();
    const items = visible();
    if (items.length === 0) return;
    const index = items.indexOf(active());
    let next;
    if (index === -1) next = direction === 1 ? items[0] : items[items.length - 1];
    else next = items[(index + direction + items.length) % items.length];
    setActive(next);
  }

  input.addEventListener('input', openList);
  input.addEventListener('blur', close);

  input.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (event.altKey) openList();
        else move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey) close();
        else move(-1);
        break;
      case 'Enter':
        if (isOpen() && active()) {
          event.preventDefault();
          accept(active());
        }
        break;
      case 'Escape':
        if (!isOpen() && !input.value) break;
        event.preventDefault();
        if (isOpen()) close();
        else input.value = '';
        break;
      case 'Home':
      case 'End':
      case 'ArrowLeft':
      case 'ArrowRight':
        // Native caret movement; visual focus returns to the text.
        setActive(null);
        break;
    }
  });

  // Keep focus in the input so a click doesn't blur it and close the list first.
  listbox.addEventListener('mousedown', (event) => event.preventDefault());
  listbox.addEventListener('click', (event) => {
    const option = event.target.closest('[role="option"]');
    if (option) accept(option);
  });

  setExpanded(false);
}
