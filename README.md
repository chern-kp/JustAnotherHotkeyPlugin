# JustAnotherHotkeyPlugin

JustAnotherHotkeyPlugin is an Obsidian plugin that adds new hotkeys for enhanced navigation and selection within notes.

## Features

| Feature                            | Default Hotkey               | Description                                                                                                                                                  |
| ---------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Select to Next Heading             | `Ctrl/Cmd + S`               | Selects text from the current position to the next heading.                                                                                                  |
| Select to Previous Heading         | `Ctrl/Cmd + Shift + S`       | Selects text from the current position to the previous heading.                                                                                              |
| Select Current Heading             | `Ctrl/Cmd + Alt + S`         | Selects the entire current heading section.                                                                                                                  |
| Select All Current Level Headings  | `Ctrl/Cmd + Shift + Alt + S` | Selects all headings at the current level.                                                                                                                   |
| Move to Next Heading Level 1-6     | `Alt + 1-6`                  | Moves the cursor to the next heading of the specified level.                                                                                                 |
| Move to Previous Heading Level 1-6 | `Alt + Shift + 1-6`          | Moves the cursor to the previous heading of the specified level.                                                                                             |
| Select Link Display Text           | `Ctrl + \`                   | Selects the display text of an internal link (the text after `\|`), if present. If not present, adds `\|` and places the cursor after it for typing          |
| Select Link Without Display Text   | `Ctrl + Shift + \`           | Selects the text before `\|` in an internal link, or the entire internal link if `\|` is absent.                                                             |
| Select Link Content                | `Ctrl/Cmd + Alt + \`         | Selects the content of the internal link, excluding the surrounding brackets.                                                                                |
| Select Full Link                   | `Ctrl/Cmd + Shift + Alt + \` | Selects the entire internal link, including the surrounding brackets.                                                                                        |
