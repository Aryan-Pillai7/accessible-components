# Accordion

Implements the [APG Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) with native headings and buttons. Sections open independently.

## Usage

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="components/accordion/component.css" />

<div id="faq">
  <h3 class="accordion__heading">
    <!-- aria-expanded: exposes open/closed; a plain button has no such state. -->
    <!-- aria-controls: ties the button to the panel it shows and hides. -->
    <button class="accordion__trigger" id="q1" aria-expanded="true" aria-controls="a1">Shipping</button>
  </h3>
  <!-- role="region": makes the panel a navigable landmark. Drop it above about six panels, to avoid landmark clutter. -->
  <!-- aria-labelledby: names the region after its button. -->
  <div class="accordion__panel" id="a1" role="region" aria-labelledby="q1">Ships in two days.</div>

  <h3 class="accordion__heading">
    <button class="accordion__trigger" id="q2" aria-expanded="false" aria-controls="a2">Returns</button>
  </h3>
  <div class="accordion__panel" id="a2" role="region" aria-labelledby="q2">Free for 30 days.</div>
</div>

<script type="module">
  import { createAccordion } from './components/accordion/component.js';

  createAccordion(document.getElementById('faq'));
</script>
```

## Options

`createAccordion(root, options)`

| Option     | Type       | Description |
| ---------- | ---------- | ----------- |
| `onToggle` | `function` | Called with `(trigger, expanded)` after a section changes. |

Initial state comes from `aria-expanded` in the markup.

## Keyboard interactions

| Key             | Action |
| --------------- | ------ |
| Enter / Space   | Toggles the focused section (native button behavior). |
| Tab / Shift+Tab | Moves through headers and any focusable panel content. |
| Down Arrow      | Next header; wraps. |
| Up Arrow        | Previous header; wraps. |
| Home            | First header. |
| End             | Last header. |

## ARIA roles and states

| Attribute         | Where     | Why it's needed |
| ----------------- | --------- | --------------- |
| `aria-expanded`   | `<button>` | Conveys open or closed; no native state on a button. |
| `aria-controls`   | `<button>` | Associates the button with its panel. |
| `role="region"`   | Panel     | Optional landmark that lets users jump to open panels. |
| `aria-labelledby` | Panel     | A region needs a name; this reuses the header text. |

## Accessibility notes

### For designers

- Show state with an icon or glyph, not color alone. Here it's + and −.
- Make the whole header row the click target.
- Long headers wrap at 200% zoom, so don't design for a single line.

### For developers

- Match the heading level to the page outline; `h3` isn't required.
- Every panel needs an `id` that its button references.
- Panels use the `hidden` attribute, so collapsed content is removed from the accessibility tree and Tab order.
