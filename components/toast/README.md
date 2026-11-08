# Toast

Non-modal notifications announced through live regions, following the [APG Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/). A toast never takes focus.

## Usage

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="components/toast/toast.css" />

<div id="toaster" class="toaster">
  <!-- role="status": polite live region; waits for the screen reader to finish. Used for info and success. -->
  <!-- role="alert": assertive live region; interrupts. Used for warning and error. -->
  <!-- aria-atomic="false": both roles default to true, which would re-read every visible toast whenever one is added. -->
  <div role="status" aria-atomic="false"></div>
  <div role="alert" aria-atomic="false"></div>
</div>

<script type="module">
  import { createToaster } from './components/toast/toast.js';

  const toaster = createToaster(document.getElementById('toaster'));
  toaster.show('File saved', { severity: 'success' });
</script>
```

## Options

`createToaster(root)` returns `{ show(message, options), destroy() }`. `show` returns a function that dismisses that toast. `destroy()` removes every visible toast and cancels its timer.

| Option     | Type     | Default  | Description |
| ---------- | -------- | -------- | ----------- |
| `severity` | `string` | `'info'` | `'info'`, `'success'`, `'warning'` or `'error'`. |
| `duration` | `number` | 5000 for info/success, 0 for warning/error | Milliseconds before auto-dismissal. `0` keeps it until dismissed. |

## Keyboard interactions

| Key             | Where         | Action |
| --------------- | ------------- | ------ |
| Tab / Shift+Tab | Page          | Reaches the Dismiss button in normal Tab order. |
| Enter / Space   | Dismiss       | Dismisses the toast and returns focus to where it came from. |
| Escape          | Inside toast  | Dismisses the toast and returns focus to where it came from. |

APG defines no keyboard interaction for alerts; these come from the native button, plus Escape as a convenience.

## ARIA roles and states

| Attribute            | Where          | Why it's needed |
| -------------------- | -------------- | --------------- |
| `role="status"`      | Polite region  | Announces info and success without interrupting. |
| `role="alert"`       | Assertive region | Announces warnings and errors immediately. |
| `aria-atomic="false"`| Both regions   | Announces only the newly added toast, not all of them. |

## Accessibility notes

### For designers

- Severity is written in text ("Error:") and in color; never rely on color alone.
- Keep messages short and don't put essential actions only in a toast.
- Errors and warnings stay until dismissed because they may need action.
- The stack scrolls vertically if it exceeds the viewport at 200% zoom.

### For developers

- The empty live regions must be in the page before the first `show()`. Don't create them on demand or the first message may be silent.
- Auto-dismiss pauses on hover and while focus is inside the toast.
- Reserve `error` and `warning` for things that merit interrupting the user.
- Messages are inserted as text, so user content can't inject HTML.
