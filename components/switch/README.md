# Switch

Implements the [APG Switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) on a native checkbox.

## Usage

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="components/switch/switch.css" />

<label class="switch" for="notify">
  <!-- role="switch": announces "on/off" instead of "checked/not checked".
       It's the only ARIA here; the on/off state comes from the native checked property. -->
  <input class="switch__input" id="notify" type="checkbox" role="switch" />
  Email notifications
</label>

<script type="module">
  import { createSwitch } from './components/switch/switch.js';

  createSwitch(document.getElementById('notify'), {
    onChange: (checked) => console.log(checked),
  });
</script>
```

## Options

`createSwitch(input, options)` returns `{ destroy() }`, which removes the listeners. The native checkbox keeps working.

| Option     | Type       | Description                            |
| ---------- | ---------- | -------------------------------------- |
| `onChange` | `function` | Called with the new `checked` boolean. |

Set the initial state with the native `checked` attribute.

## Keyboard interactions

| Key             | Action                                                         |
| --------------- | -------------------------------------------------------------- |
| Space           | Toggles the switch (native).                                   |
| Enter           | Toggles the switch (optional in APG; added by this component). |
| Tab / Shift+Tab | Moves focus to or from the switch (native).                    |

## ARIA roles and states

| Attribute       | Where     | Why it's needed                                                       |
| --------------- | --------- | --------------------------------------------------------------------- |
| `role="switch"` | `<input>` | Changes the announcement to on/off, which suits an immediate setting. |

`aria-checked` is deliberately absent: the native `checked` state is exposed automatically and can't drift out of sync.

## Accessibility notes

### For designers

- The thumb's position must show state, so it remains clear without color.
- The label should name the setting ("Email notifications") and stay the same in both states.
- A switch should take effect immediately. If the change needs a Save button, use a checkbox.

### For developers

- Always associate a `<label>`; it also enlarges the click target.
- Enter is cancelled so it toggles the switch rather than submitting a surrounding form.
- `appearance: none` is what lets the checkbox be restyled; semantics and keyboard support are unchanged.
