# Modal (dialog)

Implements the [APG Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) on the native `<dialog>` element.

## Usage

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="components/modal/component.css" />

<button id="open" class="modal-trigger">Delete file</button>

<!-- aria-labelledby: <dialog> gets no accessible name from its content, so it
     points at the heading; without it the dialog is announced with no name. -->
<!-- aria-describedby: optional; has the supporting text read when the dialog opens. -->
<dialog id="confirm" class="modal" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
  <h2 id="confirm-title">Delete this file?</h2>
  <p id="confirm-desc">This can't be undone.</p>
  <div class="modal__actions">
    <button data-modal-close>Cancel</button>
    <button id="confirm-delete">Delete</button>
  </div>
</dialog>

<script type="module">
  import { createModal } from './components/modal/component.js';

  const modal = createModal(document.getElementById('confirm'));
  document.getElementById('open').addEventListener('click', modal.open);
</script>
```

## Options

`createModal(dialog, options)` returns `{ open(), close() }`.

| Option    | Type       | Description                          |
| --------- | ---------- | ------------------------------------ |
| `onClose` | `function` | Called after the dialog has closed and focus has returned. |

Any element inside the dialog with `data-modal-close` closes it on click. Put `autofocus` on an element to focus it first; otherwise the first focusable element gets focus.

## Keyboard interactions

| Key         | Action |
| ----------- | ------ |
| Tab         | Next focusable element in the dialog; wraps from last to first. |
| Shift+Tab   | Previous focusable element in the dialog; wraps from first to last. |
| Escape      | Closes the dialog and returns focus to the element that opened it. |

## ARIA roles and states

| Attribute          | Where      | Why it's needed |
| ------------------ | ---------- | --------------- |
| `aria-labelledby`  | `<dialog>` | Gives the dialog its accessible name. Native `<dialog>` has none by default. |
| `aria-describedby` | `<dialog>` | Optional. Associates the supporting text so it's read on open. |

`role="dialog"` and `aria-modal="true"` are deliberately absent: `<dialog>` opened with `showModal()` already exposes both.

## Accessibility notes

### For designers

- Every dialog needs a visible title; it becomes the dialog's name.
- Include a visible way to close it. Don't rely on Escape alone.
- For destructive confirmations, make the safe action the first control or mark it `autofocus`.
- Allow for tall content: the dialog scrolls vertically rather than clipping at 200% zoom.

### For developers

- Always open with `modal.open`, not `showModal()` directly, or focus won't be returned.
- Include at least one focusable element, normally the close button.
- The trap treats each radio as its own stop. If a radio group is the first or last thing in the dialog, put a button after or before it so the wrap lands correctly.
- A popup inside the dialog should call `preventDefault()` on the Escape that closes it, so the dialog stays open.
- jsdom doesn't implement `showModal()`, so tests stub it. Real inertness of the background is covered by the manual checklist.
