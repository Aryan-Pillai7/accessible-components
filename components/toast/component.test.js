import { jest } from '@jest/globals';
import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createToaster } from './component.js';

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
  toaster.show('Saved', { severity: 'success', duration: 0 });
  toaster.show('Failed', { severity: 'error' });
  await expectNoAxeViolations(document.body);
});

test.each([
  ['info', 'status'],
  ['success', 'status'],
  ['warning', 'alert'],
  ['error', 'alert'],
])('%s toasts go in the role="%s" region', (severity, role) => {
  toaster.show('Message', { severity });
  expect(root.querySelector(`[role="${role}"] .toast`)).not.toBeNull();
  expect(root.querySelectorAll('.toast')).toHaveLength(1);
});

test('defaults to info and writes the severity as text', () => {
  toaster.show('Hello');
  expect(status.textContent).toContain('Info: Hello');
});

test('renders the message as text, not HTML', () => {
  toaster.show('<img src=x>');
  expect(status.querySelector('img')).toBeNull();
});

test('polite toasts auto-dismiss after the default duration', () => {
  toaster.show('Bye');
  jest.advanceTimersByTime(4999);
  expect(status.children).toHaveLength(1);
  jest.advanceTimersByTime(1);
  expect(status.children).toHaveLength(0);
});

test('alert toasts persist by default', () => {
  toaster.show('Bad', { severity: 'error' });
  jest.advanceTimersByTime(60000);
  expect(alertRegion.children).toHaveLength(1);
});

test('duration overrides the default', () => {
  toaster.show('Bad', { severity: 'error', duration: 100 });
  jest.advanceTimersByTime(100);
  expect(alertRegion.children).toHaveLength(0);
});

test('show returns a dismiss function', () => {
  const dismiss = toaster.show('Hi');
  dismiss();
  expect(status.children).toHaveLength(0);
});

test('focus inside pauses the timer and leaving resumes it', () => {
  toaster.show('Hi');
  const button = status.querySelector('button');
  button.focus();
  jest.advanceTimersByTime(60000);
  expect(status.children).toHaveLength(1);
  button.blur();
  jest.advanceTimersByTime(5000);
  expect(status.children).toHaveLength(0);
});

test('hover pauses the timer and leaving resumes it', () => {
  toaster.show('Hi');
  const toast = status.querySelector('.toast');
  toast.dispatchEvent(new MouseEvent('mouseenter'));
  jest.advanceTimersByTime(60000);
  expect(status.children).toHaveLength(1);
  toast.dispatchEvent(new MouseEvent('mouseleave'));
  jest.advanceTimersByTime(5000);
  expect(status.children).toHaveLength(0);
});

test('the pointer leaving does not restart the timer while focus is inside', () => {
  toaster.show('Hi');
  const toast = status.querySelector('.toast');
  status.querySelector('button').focus();
  toast.dispatchEvent(new MouseEvent('mouseenter'));
  toast.dispatchEvent(new MouseEvent('mouseleave'));
  jest.advanceTimersByTime(60000);
  expect(status.children).toHaveLength(1);
});

test.each(['Enter', ' ', 'Escape'])('key "%s" dismisses and returns focus', (key) => {
  toaster.show('Hi');
  outside.focus();
  const button = status.querySelector('button');
  button.focus();
  press(button, key);
  expect(status.children).toHaveLength(0);
  expect(document.activeElement).toBe(outside);
});
