# Accessible UI Components

Eight reusable components in plain HTML, CSS and JavaScript, following the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/). There are no frameworks and no build step: link `tokens.css` and a component's CSS, then import its ES module.

## Components

| Component                                       | Pattern                                        |
| ----------------------------------------------- | ---------------------------------------------- |
| [Modal](components/modal/README.md)             | Native `<dialog>` with focus trap and return   |
| [Combobox](components/combobox/README.md)       | Editable, list autocomplete, announced count   |
| [Tabs](components/tabs/README.md)               | Automatic activation, roving tabindex          |
| [Menu](components/menu/README.md)               | Menu button with typeahead                     |
| [Toast](components/toast/README.md)             | `role="status"` or `role="alert"` by severity  |
| [Accordion](components/accordion/README.md)     | Native headings and buttons                    |
| [Switch](components/switch/README.md)           | Native checkbox with `role="switch"`           |
| [Radio group](components/radio-group/README.md) | Native fieldset, styled as a segmented control |

Colors and contrast pairs live in [`tokens.css`](tokens.css).

## Run the demo

ES modules don't load from `file://`, so serve the repo root with a local server:

```sh
npx http-server
# or
python -m http.server
```

Then open the printed URL. `index.html` shows all 8 components and is the manual test bed.

## Run the tests

```sh
npm install
npm test
```

`npm test` runs `prettier --check .`, then Jest with jsdom and jest-axe.

## Verification status

| Check                                                                            | Status                                                                     |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Formatting, token contrast, axe, API, hooks, keyboard and focus (`npm test`)     | Automated, done                                                            |
| Keyboard, 200% and 400% width reflow, forced-colors emulation in headless Chrome | Checked once by hand during development; the script is not in this repo    |
| Screen readers (NVDA, VoiceOver)                                                 | **Pending manual run**: see [the checklist](docs/screen-reader-testing.md) |

jsdom has no layout and doesn't implement `showModal()`, so `npm test` can't cover visual reflow, forced colors or real dialog inertness. Forced colors was emulated in Chrome, not tested under a real Windows contrast theme. jest-axe can't measure color contrast in jsdom; the token test covers that instead.
