# JustAnotherHotkeyPlugin

JustAnotherHotkeyPlugin is an Obsidian plugin that adds new useful hotkeys for text editing, text selection, navigation and several additional features.
This plugin also adds features such as ability to copy inline code content on double click, and code block language detection that depends on the note's file path (configurable).


In development

## Features

### New hotkeys and commands

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
| Select Current Line                          | `Ctrl/Cmd + L`               | Selects the entire logical line of text (until next line break). **Repeatable** for next lines.                                                     |
| Select Previous Line                         | `Ctrl/Cmd + Shift + L`       | Selects previous line of text (until previous line break). **Repeatable** for previous lines.                                                       |
| Clear Selection of Current Line              | `Ctrl/Cmd + Alt + L`         | Clears selection of current logical line of text (until previous line break). **Repeatable** for previous lines.                                    |
| Select to Line Start                         | `Ctrl/Cmd + Shift + <`       | Selects text from the current position to the start of the line. Ignores list markers.                                                              |
| Select to Line End                           | `Ctrl/Cmd + Shift + >`       | Selects text from the current position to the end of the line.                                                                                      |
| Move Heading Up                              | `Alt + PageUp`               | Moves entire heading section (including content) up, swapping with the heading above.                                                               |
| Move Heading Down                            | `Alt + PageDown`             | Moves entire heading section (including content) down, swapping with the heading below.                                                             |

### New options in settings

- Turn off TAB key indentation (`True` or `False`)
- Copy inline code on double click (`True` or `False`)
- Use contextual code block language (`True` or `False`)
    - Use contextual code block language (`True` or `False`)
    - Search language code in... (`Note name`, `Parent folder name`, `Nearest to root folder`)
    - Custom language list

# Installation
Install the BRAT Plugin from Obsidian Community Plugins or from the [GitHub repository](https://github.com/TfTHacker/obsidian42-brat).

1. Navigate to Settings > BRAT > Beta Plugin List
2. Click "Add Beta plugin"
3. Enter `https://github.com/chern-kp/JustAnotherHotkeyPlugin`
4. Click "Add Plugin"
5. Enable the plugin to begin using it

## Updating the Plugin

Update the plugin by either:
* Using the BRAT command `Check for updates to all beta plugins and UPDATE`
* Using the BRAT settings panel in Obsidian

# Support
This plugin is in active development. If you have any feature requests or bug reports, please open an issue on the [GitHub repository](https://github.com/chern-kp/JustAnotherHotkeyPlugin).