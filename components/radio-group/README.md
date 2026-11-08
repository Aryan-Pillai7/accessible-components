# Radio group

Implements the [APG Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) using native `<fieldset>`, `<legend>` and `<input type="radio">`.

## Usage

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="components/radio-group/radio-group.css" />

<!-- No ARIA attributes: fieldset, legend and radio inputs already expose the
     group, its name, each radio's role and checked state, and "1 of 3". -->
<fieldset id="size" class="radio-group">
  <legend class="radio-group__legend">Size</legend>
  <label class="radio-group__option">
    <input class="radio-group__input" type="radio" name="size" value="s" /> Small
  </label>
  <label class="radio-group__option">
    <input class="radio-group__input" type="radio" name="size" value="m" checked /> Medium
  </label>
  <label class="radio-group__option">
    <input class="radio-group__input" type="radio" name="size" value="l" /> Large
  </label>
</fieldset>

<script type="module">
  import { createRadioGroup } from './components/radio-group/radio-group.js';

  createRadioGroup(document.getElementById('size'));
</script>
```

## Options

`createRadioGroup(fieldset, options)` returns `{ destroy() }`, which removes the listeners. The native radios keep working.

| Option     | Type       | Description                               |
| ---------- | ---------- | ----------------------------------------- |
| `onChange` | `function` | Called with the selected radio's `value`. |

## Keyboard interactions

| Key                | Action                                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Tab / Shift+Tab    | Moves into or out of the group. Focus lands on the checked radio, or the first radio if none is checked (native). |
| Down / Right Arrow | Moves to and checks the next radio; wraps.                                                                        |
| Up / Left Arrow    | Moves to and checks the previous radio; wraps.                                                                    |
| Space              | Checks the focused radio (native).                                                                                |

The browser supplies roving tabindex for radios that share a `name`, so no `tabindex` is written.

## ARIA roles and states

None. Native elements provide everything this pattern needs, so adding ARIA would only create a chance for it to disagree with the real state.

## Accessibility notes

### For designers

- Selection is shown by a heavy ring, so it doesn't depend on hue.
- Keep the visible group label; it's what `<legend>` announces.
- At 200% zoom, options stack in a single column.

### For developers

- All radios in a group need the same `name`, or arrow keys and Tab order fall apart.
- Don't replace these with `div role="radio"`; you'd have to rebuild focus and state by hand.
- Moving with arrows checks the radio and fires `change`, so don't run expensive work per change.
