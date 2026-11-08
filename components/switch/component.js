export function createSwitch(input, { onChange } = {}) {
  // Space is native on a checkbox; APG lists Enter as an optional extra for switches.
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    input.click();
  });

  input.addEventListener('change', () => onChange?.(input.checked));
}
