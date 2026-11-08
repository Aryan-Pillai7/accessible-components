# Screen reader testing checklist

**Status: not yet run.** No screen reader has been used on these components. Automated tests can't confirm what is actually announced, so this checklist has to be completed by a person.

## Setup

1. Run `npx http-server` (or `python -m http.server`) in the repo root and open the demo page.
2. Test each combination: **NVDA + Firefox**, **NVDA + Chrome**, **VoiceOver + Safari**.
3. Record the versions here:

| Tool      | Version | OS  | Tester | Date |
| --------- | ------- | --- | ------ | ---- |
| NVDA      |         |     |        |      |
| Firefox   |         |     |        |      |
| Chrome    |         |     |        |      |
| VoiceOver |         |     |        |      |
| Safari    |         |     |        |      |

Exact wording and order vary by screen reader and version. A step passes if the listed information is conveyed. In Safari, turn on "Press Tab to highlight each item" (or use Option+Tab) so Tab reaches every control.

In the results tables, enter Pass, Fail or N/A, and describe any problem under Notes.

## 1. Modal

| #   | Step                                     | Expected announcement                                                |
| --- | ---------------------------------------- | -------------------------------------------------------------------- |
| 1   | Focus "Delete file" and press Enter      | Dialog, "Delete this file?", "This can't be undone", "Cancel" button |
| 2   | Press Tab repeatedly                     | Only "Cancel" and "Delete"; focus never reaches the page behind      |
| 3   | Try browse mode / VO+arrows past the end | Page content behind the dialog is not reachable                      |
| 4   | Press Escape                             | Dialog closes; "Delete file" button is announced                     |

| Step | NVDA + Firefox | NVDA + Chrome | VoiceOver + Safari | Notes |
| ---- | -------------- | ------------- | ------------------ | ----- |
| 1    |                |               |                    |       |
| 2    |                |               |                    |       |
| 3    |                |               |                    |       |
| 4    |                |               |                    |       |

## 2. Combobox

| #   | Step                      | Expected announcement                                |
| --- | ------------------------- | ---------------------------------------------------- |
| 1   | Tab to the input          | "Fruit", combobox/edit, collapsed, autocomplete hint |
| 2   | Type "ap"                 | Expanded state and "3 results available."            |
| 3   | Press Down Arrow          | "Apple", with its position in the list (1 of 3)      |
| 4   | Press Down Arrow again    | "Apricot" (2 of 3)                                   |
| 5   | Press Enter               | Value "Apricot" is conveyed; list collapsed          |
| 6   | Clear the text, type "zz" | "No results."                                        |
| 7   | Type "ap", press Escape   | Collapsed; the typed text remains                    |

| Step | NVDA + Firefox | NVDA + Chrome | VoiceOver + Safari | Notes |
| ---- | -------------- | ------------- | ------------------ | ----- |
| 1    |                |               |                    |       |
| 2    |                |               |                    |       |
| 3    |                |               |                    |       |
| 4    |                |               |                    |       |
| 5    |                |               |                    |       |
| 6    |                |               |                    |       |
| 7    |                |               |                    |       |

## 3. Tabs

| #   | Step                  | Expected announcement                                      |
| --- | --------------------- | ---------------------------------------------------------- |
| 1   | Tab into the tab list | "Tabs" tab list, "Profile" tab, selected, 1 of 3           |
| 2   | Press Right Arrow     | "Security" tab, selected, 2 of 3                           |
| 3   | Press End, then Home  | "Billing" 3 of 3, then "Profile" 1 of 3                    |
| 4   | Press Tab             | Focus moves to the panel; "Profile" tab panel and its text |

| Step | NVDA + Firefox | NVDA + Chrome | VoiceOver + Safari | Notes |
| ---- | -------------- | ------------- | ------------------ | ----- |
| 1    |                |               |                    |       |
| 2    |                |               |                    |       |
| 3    |                |               |                    |       |
| 4    |                |               |                    |       |

## 4. Menu

| #   | Step                       | Expected announcement                                        |
| --- | -------------------------- | ------------------------------------------------------------ |
| 1   | Tab to "Actions"           | "Actions", menu button, collapsed                            |
| 2   | Press Enter                | "Actions" menu, "Copy" menu item, 1 of 4                     |
| 3   | Press Down Arrow           | "Cut", 2 of 4                                                |
| 4   | Press "r"                  | "Rename", 4 of 4                                             |
| 5   | Press Escape               | "Actions" button, collapsed                                  |
| 6   | Open it and choose "Paste" | "Actions" button, then the polite toast "Info: Paste chosen" |

| Step | NVDA + Firefox | NVDA + Chrome | VoiceOver + Safari | Notes |
| ---- | -------------- | ------------- | ------------------ | ----- |
| 1    |                |               |                    |       |
| 2    |                |               |                    |       |
| 3    |                |               |                    |       |
| 4    |                |               |                    |       |
| 5    |                |               |                    |       |
| 6    |                |               |                    |       |

## 5. Toast

| #   | Step                                       | Expected announcement                                     |
| --- | ------------------------------------------ | --------------------------------------------------------- |
| 1   | Activate "Info"                            | Politely, after current speech: "Info: Draft autosaved"   |
| 2   | Activate "Success"                         | Politely: "Success: Changes published"                    |
| 3   | Activate "Warning"                         | Immediately: "Warning: Storage almost full"               |
| 4   | Activate "Error"                           | Immediately: "Error: Upload failed"                       |
| 5   | With several showing, trigger one more     | Only the new toast is read, not the whole stack           |
| 6   | Tab to a "Dismiss" button and press Escape | Toast removed; focus returns and the control is announced |

| Step | NVDA + Firefox | NVDA + Chrome | VoiceOver + Safari | Notes |
| ---- | -------------- | ------------- | ------------------ | ----- |
| 1    |                |               |                    |       |
| 2    |                |               |                    |       |
| 3    |                |               |                    |       |
| 4    |                |               |                    |       |
| 5    |                |               |                    |       |
| 6    |                |               |                    |       |

## 6. Accordion

| #   | Step                          | Expected announcement                                          |
| --- | ----------------------------- | -------------------------------------------------------------- |
| 1   | Tab to "Shipping"             | "Shipping", button, expanded, heading level 3                  |
| 2   | Press Enter                   | Collapsed                                                      |
| 3   | Press Down Arrow              | "Returns", button, collapsed                                   |
| 4   | Press Enter, then read onward | Expanded; "Returns" region and "Returns are free for 30 days." |
| 5   | Press End, then Home          | "Warranty", then "Shipping"                                    |

| Step | NVDA + Firefox | NVDA + Chrome | VoiceOver + Safari | Notes |
| ---- | -------------- | ------------- | ------------------ | ----- |
| 1    |                |               |                    |       |
| 2    |                |               |                    |       |
| 3    |                |               |                    |       |
| 4    |                |               |                    |       |
| 5    |                |               |                    |       |

## 7. Switch

| #   | Step              | Expected announcement              |
| --- | ----------------- | ---------------------------------- |
| 1   | Tab to the switch | "Email notifications", switch, off |
| 2   | Press Space       | On                                 |
| 3   | Press Enter       | Off                                |

| Step | NVDA + Firefox | NVDA + Chrome | VoiceOver + Safari | Notes |
| ---- | -------------- | ------------- | ------------------ | ----- |
| 1    |                |               |                    |       |
| 2    |                |               |                    |       |
| 3    |                |               |                    |       |

## 8. Radio group

| #   | Step               | Expected announcement                          |
| --- | ------------------ | ---------------------------------------------- |
| 1   | Tab into the group | "Size" group, "Medium", radio, checked, 2 of 3 |
| 2   | Press Down Arrow   | "Large", radio, checked, 3 of 3                |
| 3   | Press Down Arrow   | Wraps: "Small", radio, checked, 1 of 3         |
| 4   | Press Tab          | Focus leaves the group                         |

| Step | NVDA + Firefox | NVDA + Chrome | VoiceOver + Safari | Notes |
| ---- | -------------- | ------------- | ------------------ | ----- |
| 1    |                |               |                    |       |
| 2    |                |               |                    |       |
| 3    |                |               |                    |       |
| 4    |                |               |                    |       |
