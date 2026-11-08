import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

export async function expectNoAxeViolations(element) {
  expect(await axe(element)).toHaveNoViolations();
}

// Dispatches a keydown, then does what a browser would natively do if the
// handler didn't cancel it: jsdom doesn't turn keys into clicks by itself.
export function press(element, key, options = {}) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options });
  element.dispatchEvent(event);
  if (event.defaultPrevented) return event;
  const isButton = element.tagName === 'BUTTON';
  const isToggle = element.tagName === 'INPUT' && ['checkbox', 'radio'].includes(element.type);
  if ((isButton && (key === 'Enter' || key === ' ')) || (isToggle && key === ' ')) element.click();
  return event;
}
