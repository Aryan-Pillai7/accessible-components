# Tabs

Implements the [APG Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) (horizontal, automatic activation) on native `<button>` elements.

## Usage

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="components/tabs/component.css" />

<!-- role="tablist": HTML has no tabs element; groups the tabs for assistive tech. -->
<!-- aria-label: names the tab set, since the tablist has no visible label of its own. -->
<div id="tabs" class="tabs__list" role="tablist" aria-label="Account settings">
  <!-- role="tab": turns each button into a tab, so it's announced as "tab 1 of 2". -->
  <!-- aria-selected: exposes which tab is active; there's no native state for this. -->
  <!-- aria-controls: programmatically ties the tab to its panel. -->
  <button class="tabs__tab" role="tab" id="tab-a" aria-controls="panel-a" aria-selected="true">Profile</button>
  <button class="tabs__tab" role="tab" id="tab-b" aria-controls="panel-b" aria-selected="false">Security</button>
</div>

<!-- role="tabpanel": identifies the region a tab reveals. -->
<!-- aria-labelledby: names the panel after its tab. -->
<div class="tabs__panel" role="tabpanel" id="panel-a" aria-labelledby="tab-a" tabindex="0">Profile settings</div>
<div class="tabs__panel" role="tabpanel" id="panel-b" aria-labelledby="tab-b" tabindex="0">Security settings</div>

<script type="module">
  import { createTabs } from './components/tabs/component.js';

  createTabs(document.getElementById('tabs'));
</script>
```

## Options

`createTabs(tablist, options)`

| Option     | Type       | Description |
| ---------- | ---------- | ----------- |
| `onChange` | `function` | Called with the newly selected tab element when the selection changes. |

The initially active tab comes from `aria-selected="true"` in the markup, defaulting to the first.

## Keyboard interactions

| Key         | Action |
| ----------- | ------ |
| Tab         | Moves into the tab list onto the active tab, then to the panel. |
| Shift+Tab   | Moves back out in reverse order. |
| Right Arrow | Activates and focuses the next tab; wraps. |
| Left Arrow  | Activates and focuses the previous tab; wraps. |
| Home        | Activates and focuses the first tab. |
| End         | Activates and focuses the last tab. |

The tabs use roving tabindex: only the active tab is in the page's Tab order.

## ARIA roles and states

| Attribute         | Where     | Why it's needed |
| ----------------- | --------- | --------------- |
| `role="tablist"`  | Container | HTML has no tab list element. Groups the tabs. |
| `aria-label`      | Tab list  | Names the tab set. Use `aria-labelledby` if a visible heading exists. |
| `role="tab"`      | `<button>` | Conveys tab semantics and position. |
| `aria-selected`   | Tab       | Conveys the active tab; no native equivalent. |
| `aria-controls`   | Tab       | Associates the tab with its panel. |
| `role="tabpanel"` | Panel     | Identifies the content region. |
| `aria-labelledby` | Panel     | Names the panel after its tab. |

## Accessibility notes

### For designers

- The selected tab must differ by more than color. Here it has an underline and bold text.
- Keep labels short. Tabs wrap onto new lines at 200% zoom instead of scrolling.
- Don't use tabs for sequential steps; use them only for peer sections.

### For developers

- Automatic activation assumes panel content is already in the page. If a panel must load over a network, this pattern will fire a request per arrow press.
- Keep `tabindex="0"` on a panel that has no focusable content, so keyboard users can reach and scroll it. Remove it if the panel starts with a focusable element.
- Every tab needs an `id` and `aria-controls` pointing to an existing panel.
