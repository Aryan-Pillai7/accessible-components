import { expectNoAxeViolations, press } from '../../test-helpers.js';
import { createTabs } from './component.js';

let tabs, panels, changes;

const expectSelected = (index) => {
  tabs.forEach((tab, i) => {
    expect(tab.getAttribute('aria-selected')).toBe(String(i === index));
    expect(tab.tabIndex).toBe(i === index ? 0 : -1);
    expect(panels[i].hidden).toBe(i !== index);
  });
  expect(document.activeElement).toBe(tabs[index]);
};

beforeEach(() => {
  document.body.innerHTML = `
    <main>
      <div role="tablist" aria-label="Sections" id="list">
        ${[0, 1, 2]
          .map((i) => `<button role="tab" id="t${i}" aria-controls="p${i}" aria-selected="${i === 0}">Tab ${i}</button>`)
          .join('')}
      </div>
      ${[0, 1, 2].map((i) => `<div role="tabpanel" id="p${i}" aria-labelledby="t${i}" tabindex="0">Panel ${i}</div>`).join('')}
    </main>`;
  tabs = [...document.querySelectorAll('[role="tab"]')];
  panels = [...document.querySelectorAll('[role="tabpanel"]')];
  changes = [];
  createTabs(document.getElementById('list'), { onChange: (tab) => changes.push(tab.id) });
  tabs[0].focus();
});

test('has no axe violations', async () => {
  await expectNoAxeViolations(document.body);
});

test('initialises roving tabindex and panels from the markup', () => {
  expectSelected(0);
});

test('starts on the tab marked selected', () => {
  tabs[0].setAttribute('aria-selected', 'false');
  tabs[2].setAttribute('aria-selected', 'true');
  createTabs(document.getElementById('list'));
  tabs[2].focus();
  expectSelected(2);
});

test('ArrowRight activates the next tab and wraps', () => {
  press(tabs[0], 'ArrowRight');
  expectSelected(1);
  press(tabs[1], 'ArrowRight');
  press(tabs[2], 'ArrowRight');
  expectSelected(0);
});

test('ArrowLeft activates the previous tab and wraps', () => {
  press(tabs[0], 'ArrowLeft');
  expectSelected(2);
});

test('Home and End jump to the first and last tab', () => {
  press(tabs[0], 'End');
  expectSelected(2);
  press(tabs[2], 'Home');
  expectSelected(0);
});

test('clicking a tab activates and focuses it', () => {
  tabs[1].click();
  expectSelected(1);
});

test('onChange fires only when the tab changes', () => {
  press(tabs[0], 'ArrowRight');
  tabs[1].click();
  expect(changes).toEqual(['t1']);
});

test('other keys are left alone', () => {
  expect(press(tabs[0], 'Tab').defaultPrevented).toBe(false);
  expectSelected(0);
});
