export function createSwitch(input, { onChange } = {}) {
  const controller = new AbortController();
  const { signal } = controller;

  // Space is native on a checkbox; APG lists Enter as an optional extra for switches.
  input.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      input.click();
    },
    { signal },
  );

  input.addEventListener('change', () => onChange?.(input.checked), { signal });

  return { destroy: () => controller.abort() };
}
