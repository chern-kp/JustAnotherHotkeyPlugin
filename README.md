# JustAnotherHotkeyPlugin

JustAnotherHotkeyPlugin is an Obsidian plugin that adds new useful hotkeys for text editing, text selection, navigation and several additional features.
This plugin also adds features such as ability to copy inline code content on double click, and code block language detection that depends on the note's file path (configurable).


In development

## Features
### New hotkeys and commands

#### Headings: Selection and Editing
> `Ctrl` is a button on Windows and Linux, `Command` is a button on macOS

| Feature                                    | Default Hotkey           | Description                                                                                           |
| ------------------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| Select to the End of Current Heading       | `Alt + Shift + Down`     | Selects text from the current position to the end of the current heading (to the next heading).       |
| Select to the Beginning of Current Heading | `Alt + Shift + Up`       | Selects text from the current position to the start of the current heading (to the previous heading). |
| Select Current Heading                     | `Alt + H`                | Selects current heading section. **Press again to include all child headings**.                           |
| Select Heading (with parent)               | `Alt + Shift + H`        | Selects current heading with its parent. **Press again** to select section of higher level.              |
| Select All Current Level Headings          | `Ctrl + Alt + PageDown`  | Selects all headings at the current level.                                                            |
| Move Heading Up                            | `Alt + PageUp`           | Moves entire heading section (including content) up, swapping with the heading above.                 |
| Move Heading Down                          | `Alt + PageDown`         | Moves entire heading section (including content) down, swapping with the heading below.               |

#### Headings: Navigation
| Feature                                      | Default Hotkey       | Description                                                      |
| -------------------------------------------- | -------------------- | ---------------------------------------------------------------- |
| Move Cursor to Next Heading                  | `Ctrl + ~`           | Moves the cursor to the next heading                             |
| Move Cursor to Previous Heading              | `Ctrl + SHIFT + ~`   | Moves the cursor to the previous heading                         |
| Move Cursor to Next Heading of Level 1-6     | `Alt + 1-6`          | Moves the cursor to the next heading of the specified level.     |
| Move Cursor to Previous Heading of Level 1-6 | `Alt + Shift + 1-6`  | Moves the cursor to the previous heading of the specified level. |

#### Links
| Feature                          | Default Hotkey           | Description                                                                                                                                         |
| -------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Select Link Display Text         | `Ctrl + \`               | Selects the display text of an internal link (the text after `\|`), if present. If not present, adds `\|` and places the cursor after it for typing |
| Select Link Without Display Text | `Ctrl + Shift + \`       | Selects the text before `\|` in an internal link, or the entire internal link if `\|` is absent.                                                    |
| Select Link Content              | `Ctrl + Alt + \`         | Selects the content of the internal link, excluding the surrounding brackets.                                                                       |
| Select Full Link                 | `Ctrl + Shift + Alt + \` | Selects the entire internal link, including the surrounding brackets.                                                                               |

#### Lines
| Feature                         | Default Hotkey     | Description                                                                                                      |
| ------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Select Current Line             | `Alt + L`          | Selects the entire logical line of text (until next line break). **Repeatable** for next lines.                  |
| Select Previous Line            | `Alt + Shift + L`  | Selects previous line of text (until previous line break). **Repeatable** for previous lines.                    |
| Clear Selection of Current Line | `Ctrl + Alt + L`   | Clears selection of current logical line of text (until previous line break). **Repeatable** for previous lines. |
| Select to Line Start            | `Alt + <`          | Selects text from the current position to the start of the line. Ignores list markers.                           |
| Select to Line End              | `Alt + >`          | Selects text from the current position to the end of the line.                                                   |

#### Other
| Feature             | Default Hotkey   | Description                                                                                          |
| ------------------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| Paste As Code Block | `Ctrl + Alt + V` | Pastes clipboard content as a code block with automatic language detection (if enabled in settings). |



### Additional Features

- **Smart Code Block Language Detection**: When using `Paste As Code Block` command, the plugin can automatically detect appropriate language based on note's name, parent folder, or nearest root folder
- **Bulk Content Copy**: Copy content from multiple files at once using context menu or tag-based selection
- **Double-Click Code Copy**: Quick copy of inline code content with double-click (when enabled)

### New options in settings

- Turn off TAB key indentation (`True` or `False`)
- Copy inline code on double click (`True` or `False`)
- Use contextual code block language (`True` or `False`)
    - Search language code in... (`Note name`, `Parent folder name`, `Nearest to root folder`)
    - Custom language list
- Turn on "Copy content of files in folder/tag" feature (`True` or `False`)
    - Adds "Copy content" button to file context menu for copying content from multiple files/folders
    - Adds `[Copy all notes with tag…]` command for copying content from all notes with specific tag

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