# Menu (menu button)

Implements the [APG Menu Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) with native `<button>` elements. Use it for actions, not site navigation.

## Usage

```html
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="components/menu/menu.css" />

<div class="menu">
  <!-- aria-haspopup="menu": tells users the button opens a menu. -->
  <!-- aria-expanded: exposes open/closed; a plain button has no such state. -->
  <!-- aria-controls: ties the button to its menu. -->
  <button
    id="actions"
    class="menu__button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="actions-menu"
  >
    Actions
  </button>
  <!-- role="menu": HTML has no equivalent for an application-style action menu. -->
  <!-- aria-labelledby: names the menu after its button. -->
  <div id="actions-menu" class="menu__list" role="menu" aria-labelledby="actions">
    <!-- role="menuitem": exposes each button as an item, with its position in the menu. -->
    <button class="menu__item" role="menuitem">Copy</button>
    <button class="menu__item" role="menuitem">Paste</button>
  </div>
</div>

<script type="module">
  import { createMenu } from './components/menu/menu.js';

  createMenu(document.getElementById('actions'), {
    onSelect: (item) => console.log(item.textContent),
  });
</script>
```

## Options

`createMenu(button, options)` returns `{ destroy() }`, which removes all listeners and restores the original attributes.

| Option     | Type       | Description                                             |
| ---------- | ---------- | ------------------------------------------------------- |
| `onSelect` | `function` | Called with the chosen menu item after the menu closes. |

## Keyboard interactions

| Key             | Where  | Action                                                       |
| --------------- | ------ | ------------------------------------------------------------ |
| Enter / Space   | Button | Opens the menu and focuses the first item.                   |
| Down Arrow      | Button | Opens the menu and focuses the first item.                   |
| Up Arrow        | Button | Opens the menu and focuses the last item.                    |
| Down Arrow      | Menu   | Next item; wraps.                                            |
| Up Arrow        | Menu   | Previous item; wraps.                                        |
| Home            | Menu   | First item.                                                  |
| End             | Menu   | Last item.                                                   |
| A–Z, 0–9        | Menu   | Next item starting with that character (typeahead).          |
| Enter / Space   | Menu   | Activates the item, closes, and returns focus to the button. |
| Escape          | Menu   | Closes and returns focus to the button.                      |
| Tab / Shift+Tab | Menu   | Closes the menu and continues from the button.               |

## ARIA roles and states

| Attribute              | Where      | Why it's needed                                      |
| ---------------------- | ---------- | ---------------------------------------------------- |
| `aria-haspopup="menu"` | `<button>` | Announces that activating it opens a menu.           |
| `aria-expanded`        | `<button>` | Conveys open or closed; no native state on a button. |
| `aria-controls`        | `<button>` | Associates the button with its menu.                 |
| `role="menu"`          | Container  | HTML has no native action-menu element.              |
| `aria-labelledby`      | Menu       | Gives the menu a name from its button.               |
| `role="menuitem"`      | `<button>` | Conveys menu item semantics and position.            |

## Accessibility notes

### For designers

- Give the button a visible cue that it opens a menu, like the caret here.
- Keep items short and start them with different letters, so typeahead reaches each directly.
- Menu width is capped to the viewport and long labels wrap at 200% zoom.

### For developers

- Use real links in a list for navigation. Screen readers treat `role="menu"` as an application widget.
- Focus moves into the menu, so all items are `tabindex="-1"`; the component sets this.
- Native button behavior handles Enter and Space; don't add separate key handlers.
- Escape is cancelled when it closes the menu, so a surrounding modal stays open.
