# Combobox

Implements the [APG Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): an editable input with list autocomplete and manual selection. DOM focus stays in the input.

## Usage

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="components/combobox/combobox.css" />

<div id="fruit" class="combobox">
  <label class="combobox__label" for="fruit-input">Fruit</label>
  <!-- role="combobox": identifies an input that controls a popup list. -->
  <!-- aria-autocomplete="list": says that typing filters a list of suggestions. -->
  <!-- aria-expanded: exposes whether the list is showing. -->
  <!-- aria-controls: ties the input to its listbox. -->
  <!-- aria-activedescendant (set by the script): names the highlighted option, because DOM focus stays in the input. -->
  <input class="combobox__input" id="fruit-input" role="combobox" aria-autocomplete="list"
         aria-expanded="false" aria-controls="fruit-list" autocomplete="off" />
  <!-- role="listbox" and role="option": native <select> can't be filtered or restyled like this. -->
  <!-- aria-label: names the listbox, which has no visible label of its own. -->
  <ul class="combobox__list" id="fruit-list" role="listbox" aria-label="Fruit">
    <!-- aria-selected: required on options; marks the highlighted one. -->
    <li class="combobox__option" role="option" aria-selected="false">Apple</li>
    <li class="combobox__option" role="option" aria-selected="false">Banana</li>
  </ul>
  <!-- role="status": announces the result count, which is otherwise only visual. -->
  <div class="combobox__status" role="status"></div>
</div>

<script type="module">
  import { createCombobox } from './components/combobox/combobox.js';

  createCombobox(document.getElementById('fruit'));
</script>
```

## Options

`createCombobox(root, options)`

| Option     | Type       | Description |
| ---------- | ---------- | ----------- |
| `onSelect` | `function` | Called with the chosen option's text. |

## Keyboard interactions

| Key               | Action |
| ----------------- | ------ |
| Printable keys    | Edit the text, filter the list and announce the result count. |
| Down Arrow        | Opens the list if needed and highlights the next option; wraps. |
| Up Arrow          | Opens the list if needed and highlights the previous option; wraps. |
| Alt+Down Arrow    | Opens the list without highlighting an option. |
| Alt+Up Arrow      | Closes the list. |
| Enter             | Accepts the highlighted option and closes the list. |
| Escape            | Closes the list; if already closed, clears the text. |
| Home / End        | Moves the caret and returns visual focus to the text. |
| Left / Right Arrow | Moves the caret and returns visual focus to the text. |
| Tab / Shift+Tab   | Leaves the input; the list closes without accepting. |

## ARIA roles and states

| Attribute               | Where    | Why it's needed |
| ----------------------- | -------- | --------------- |
| `role="combobox"`       | `<input>` | Identifies the input as controlling a popup. |
| `aria-autocomplete="list"` | `<input>` | Tells users that suggestions are filtered as they type. |
| `aria-expanded`         | `<input>` | Conveys whether the list is showing. |
| `aria-controls`         | `<input>` | Associates the input with its listbox. |
| `aria-activedescendant` | `<input>` | Announces the highlighted option while DOM focus stays in the input. |
| `role="listbox"`        | `<ul>`   | Gives the suggestions list semantics. |
| `aria-label`            | Listbox  | Names the listbox. |
| `role="option"`         | `<li>`   | Identifies each suggestion. |
| `aria-selected`         | Option   | Marks the highlighted option; required on options. |
| `role="status"`         | Status   | Politely announces the number of results. |

## Accessibility notes

### For designers

- Keep a persistent visible label; don't use placeholder text as the label.
- The highlighted option uses a strong fill and the input keeps its focus ring, so both are visible.
- The list scrolls vertically, so long lists don't run off-screen at 200% zoom.

### For developers

- Use a native `<select>` if users don't need to type to filter.
- Keep the status element in the page from the start, so its updates are announced.
- Set `autocomplete="off"` so the browser's suggestions don't cover the list.
- The script assigns option ids from the listbox `id`, so the listbox needs a unique `id`.
- Escape is cancelled while it has a list to close or text to clear, so a surrounding modal stays open until the combobox has nothing left to do.
