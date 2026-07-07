# JustAnotherHotkeyAddon

**Just Another Hotkey Addon** is an Obsidian plugin that adds new useful hotkeys for text editing, text selection, navigation and several additional features that obsidian powerusers could find useful.

>I continue to work on this plugin and add new features, so I'm happy to get any suggestions or feedback. Initially created to add features to Obsidian that I felt would be useful for my daily Obsidian usage, but I hope it can also be useful to others.

## Features
### New hotkeys and commands

#### Sections: Selection and Editing
> `Ctrl` is a button on Windows and Linux, `Command` is a button on macOS

| Feature                                    | Default Hotkey           | Description                                                                                           |
| ------------------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| Select to the End of Current Section       | `Alt + Shift + Down`     | Selects text from the current position to the end of the current section.                             |
| Select to the Beginning of Current Section | `Alt + Shift + Up`       | Selects text from the current position to the start of the current section.                           |
| Select Current Section                     | `Alt + H`                | Selects current section. **Press again** to include all child sections.                               |
| Select Section (with parent)               | `Alt + Shift + H`        | Selects current section with its parent. **Press again** to select section of higher level.           |
| Select All Current Level Sections          | `Ctrl + Alt + PageDown`  | Selects all sections at the current level.                                                            |
| Move Section Up                            | `Alt + PageUp`           | Moves entire section (including content) up, swapping with the section above.                         |
| Move Section Down                          | `Alt + PageDown`         | Moves entire section (including content) down, swapping with the section below.                       |

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
| Select to Line Start            | `Alt + ,`          | Selects text from the current position to the start of the line. Ignores list markers.                           |
| Select to Line End              | `Alt + .`          | Selects text from the current position to the end of the line.                                                   |

#### Other
| Feature             | Default Hotkey   | Description                                                                                          |
| ------------------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| Paste As Code Block | `Ctrl + Alt + V` | Pastes clipboard content as a code block with automatic language detection (if enabled in settings). |

### Additional Features
#### Contextual Code Block Language Detection

When you use the **Paste As Code Block** command (`Ctrl+Alt+V` by default), the plugin can automatically detect the programming language and insert it into the opening fence (e.g. ````python`), depending on settings. Can be turned on in the settings.

**List of languages** is completely customizable. Just input them one per line. languages higher in the list have higher priority when multiple matches are found. Case-insensitive.

**Search language code in…** setting determines where to look for the language name. Options:
- `Note name` — the filename of the current note
- `Parent folder name` — the name of the folder containing the note
- `Nearest to root ancestor folder name` — walks up the folder tree from root, stops at first match
- `Tags` — tags in the note body and frontmatter. Supports nested tags (e.g. `#languages/python`).

##### Example

1. You have a note `python-scripts.md` in folder `Projects`
2. Custom language list: `python`, `javascript`, `typescript`
3. Search location: `Note name`
4. Press `Ctrl+Alt+V` → plugin detects `python` in the filename
5. Pastes: ````python ... ````

### Other Features

- **Disable TAB key indentation**. Turns off ability to use Tab key for indentation (also disables `Shift+Tab`)
- **Copy Inline Code on Double-Click**. Copy content of inline code on double-click
- **Bulk Content Copy**: Copy content from multiple files at once using context menu or tag-based selection

# Installation
Install the BRAT Plugin from Obsidian Community Plugins or from the [GitHub repository](https://github.com/TfTHacker/obsidian42-brat).

1. Navigate to Settings > BRAT > Beta Plugin List
2. Click "Add Beta plugin"
3. Enter `https://github.com/chern-kp/JustAnotherHotkeyAddon`
4. Click "Add Plugin"
5. Enable the plugin to begin using it

## Updating the Plugin

Update the plugin by either:
* Using the BRAT command `Check for updates to all beta plugins and UPDATE`
* Using the BRAT settings panel in Obsidian

# Support
This plugin is in active development. If you have any feature requests or bug reports, please open an issue on the [GitHub repository](https://github.com/chern-kp/JustAnotherHotkeyAddon).
