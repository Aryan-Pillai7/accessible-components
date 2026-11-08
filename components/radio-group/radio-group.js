export function createRadioGroup(fieldset, { onChange } = {}) {
  const radios = () => [...fieldset.querySelectorAll('input[type="radio"]:not(:disabled)')];

  // Browsers already do this natively, with small differences; handling it
  // here gives every browser the APG wrap-around and makes it testable.
  fieldset.addEventListener('keydown', (event) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const items = radios();
    const next = items[(items.indexOf(event.target) + step + items.length) % items.length];
    next.focus();
    next.click();
  });

  fieldset.addEventListener('change', (event) => onChange?.(event.target.value));
}
