import { jest } from '@jest/globals';
import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createToaster } from './toast.js';

let root, status, alertRegion, toaster, outside;

beforeEach(() => {
  jest.useFakeTimers();
  document.body.innerHTML = `
    <main>
      <button id="outside">Outside</button>
      <div id="root">
        <div role="status" aria-atomic="false"></div>
        <div role="alert" aria-atomic="false"></div>
      </div>
    </main>`;
  root = document.getElementById('root');
  status = root.querySelector('[role="status"]');
  alertRegion = root.querySelector('[role="alert"]');
  outside = document.getElementById('outside');
  toaster = createToaster(root);
});

afterEach(() => jest.useRealTimers());

test('has no axe violations', async () => {
  jest.useRealTimers();
  toaster.show('Saved', { severity: 'success' });
  toaster.show('Failed', { severity: 'error' });
  await expectNoAxeViolations(document.body);
});

test('show() routes each severity to the right live region as plain text', () => {
  toaster.show('<img src=x>');
  toaster.show('Saved', { severity: 'success' });
  toaster.show('Careful', { severity: 'warning' });
  toaster.show('Failed', { severity: 'error' });

  expect(status.querySelector('img')).toBeNull();
  expect(status.textContent).toContain('Info: <img src=x>');
  expect(status.textContent).toContain('Success: Saved');
  expect(alertRegion.textContent).toContain('Warning: Careful');
  expect(alertRegion.textContent).toContain('Error: Failed');
});

test('polite toasts expire, pausing while focused; alerts persist', () => {
  toaster.show('Bad', { severity: 'error' });
  toaster.show('Hi');
  const button = status.querySelector('button');

  button.focus();
  jest.advanceTimersByTime(60000);
  expect(status.children).toHaveLength(1);

  button.blur();
  jest.advanceTimersByTime(4999);
  expect(status.children).toHaveLength(1);
  jest.advanceTimersByTime(1);
  expect(status.children).toHaveLength(0);
  expect(alertRegion.children).toHaveLength(1);
});

test('Escape dismisses a focused toast and returns focus to where it came from', () => {
  toaster.show('Hi');
  outside.focus();
  const button = status.querySelector('button');
  button.focus();
  press(button, 'Escape');
  expect(status.children).toHaveLength(0);
  expect(document.activeElement).toBe(outside);
});

test('the function from show() and destroy() remove toasts and their timers', () => {
  const dismiss = toaster.show('One');
  dismiss();
  expect(status.children).toHaveLength(0);

  toaster.show('Two');
  toaster.show('Three', { severity: 'error' });
  toaster.destroy();
  expect(root.querySelectorAll('.toast')).toHaveLength(0);
  expect(jest.getTimerCount()).toBe(0);
});
