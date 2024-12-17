# JustAnotherHotkeyPlugin

JustAnotherHotkeyPlugin is an Obsidian plugin that adds new hotkeys for enhanced navigation and selection within notes.

## Features


| Feature                                      | Default Hotkey               | Description                                                                                                                                         |
| -------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Select to the End of Current Heading         | `Ctrl/Cmd + S`               | Selects text from the current position to the end of the current heading (to the next heading).                                                     |
| Select to the Beginning of Current Heading   | `Ctrl/Cmd + Shift + S`       | Selects text from the current position to the start of the current heading (to the previous heading).                                               |
| Select Current Heading                       | `Ctrl/Cmd + Alt + S`         | Selects the entire current heading section.                                                                                                         |
| Select Current Heading and Child Headings    | `Ctrl/Cmd + Alt + Shift + S` | Selects the entire current heading section, including all sub-headings.                                                                             |
| Select All Current Level Headings            | `Ctrl/Cmd + Alt + PageDown`  | Selects all headings at the current level.                                                                                                          |
| Move Cursor to Next Heading                  | `Ctrl/Cmd + ~`               | Moves the cursor to the next heading                                                                                                                |
| Move Cursor to Previous Heading              | `Ctrl/Cmd + SHIFT + ~`       | Moves the cursor to the previous heading                                                                                                            |
| Move Cursor to Next Heading of Level 1-6     | `Ctrl/Cmd + 1-6`             | Moves the cursor to the next heading of the specified level.                                                                                        |
| Move Cursor to Previous Heading of Level 1-6 | `Ctrl/Cmd + Shift + 1-6`     | Moves the cursor to the previous heading of the specified level.                                                                                    |
| Select Link Display Text                     | `Ctrl/Cmd + \`               | Selects the display text of an internal link (the text after `\|`), if present. If not present, adds `\|` and places the cursor after it for typing |
| Select Link Without Display Text             | `Ctrl/Cmd + Shift + \`       | Selects the text before `\|` in an internal link, or the entire internal link if `\|` is absent.                                                    |
| Select Link Content                          | `Ctrl/Cmd + Alt + \`         | Selects the content of the internal link, excluding the surrounding brackets.                                                                       |
| Select Full Link                             | `Ctrl/Cmd + Shift + Alt + \` | Selects the entire internal link, including the surrounding brackets.                                                                               |
| Paste As Code Block                          | `Ctrl/Cmd + Alt + V`         | Selects the entire internal link, including the surrounding brackets.                                                                               |


New options in settings:

Turn off TAB key indentation (`True` or `False`)
Copy inline code on double click (`True` or `False`)
Use contextual code block language (`True` or `False`)