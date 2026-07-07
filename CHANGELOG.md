# CHANGELOG

## [1.1.0] - 2026-07-07
### Added
- **Contextual Code Block Language** feature overhaul:
  - New search location: `Tags` — detects language from note body tags and frontmatter
  - Support for nested tags (`#languages/python`) with priority on the most specific (last) subtag
  - Redesigned settings UI: 6-row textarea, "Clear all" and "Reset to default" buttons with two-click confirmation
  - Default language list: `python`, `javascript`, `typescript`, `markdown`, `html`
- `Select Section` command (`Alt+H`) — progressive selection: first press selects current section, second press expands to include child sections
- `Select Section Upward` command (`Alt+Shift+H`) — progressive selection upward to parent sections
### Changed
- Default hotkeys for section selection changed to `Alt+Shift+ArrowDown` / `Alt+Shift+ArrowUp`
- Default hotkeys for "Move to Next/Previous Heading Level" changed to `Alt+1-6` / `Alt+Shift+1-6`
- Default hotkeys for line commands and heading navigation changed to use `Alt` modifier consistently
- Merged "Select Current Heading" and "Select Current and Child Headings" into single progressive `Select Section` command
- `Turn off TAB key indentation` setting now also disables `Shift+Tab`
- Standardized terminology: "Section" instead of "Heading" in command names
### Fixed
- `Select All Current Level Sections` command now selects correct ranges
- `Copy content` no longer attempts to read binary files (images, PDFs) — only `.md` files are copied
- `Move Section Up` and `Move Section Down` actions now performed in 1 step, instead of 2 steps - important for undo/redo.
- Internal code improvements.

## [1.0.12.1] - 2025-07-23
### Changed
- `[Copy all notes with tag…]` command now works with nested tags (`#tag1/tag2`)
- `[Copy all notes with tag…]` command now ignores YAML information in the copied content

## [1.0.12] - 2025-05-29
### Added
- Added new feature for copying content from multiple files at the same time. Depends on new `Turn on "Copy content of files in folder/tag" feature` setting.
	- Added new button to context menu of file manager "Copy content". Allows user to copy content from one or several files or folders.
	- Added new `[Copy all notes with tag…]` command for copying content of all notes with specific tag parameter.
## [1.0.11] - 2025-02-18
### Added
- Added new commands to move headings and their content up and down:
  - `Move Heading Up` (ALT + PageUp): Moves the current heading and all its content (including subheadings) up, swapping positions with the heading above
  - `Move Heading Down` (ALT + PageDown): Moves the current heading and all its content (including subheadings) down, swapping positions with the heading below
- New command `Select Previous Line` (CTRL + SHIFT + L): Selects the previous logical line in the editor
- Added a new command `Paste as code block` with the default hotkey `CTRL + ALT + V`.
	- Added the `Contextual code block language` setting. When enabled, the language for code blocks inserted via `Paste as code block` is automatically detected based on the note title, parent folder name, or the nearest ancestor folder name (closest to the vault root).
### Changed
- Default hotkey for `Clear selection from current line` command changed from `CTRL + SHIFT + L` to `CTRL + ALT + L`
## [1.0.10] - 2025-02-17
### Added
- Added new line selection commands:
	- `Select current line` (CTRL + L): Selects the current logical line in the editor
	- `Clear selection from current line` (CTRL + SHIFT + L): Removes selection from the current logical line and moves cursor to the beginning of the previous line
	- `Select to Line Start` (CTRL + SHIFT + <): Selects text from cursor position to the start of current line (Ignores list markers)
	- `Select to Line End` (CTRL + SHIFT + >): Selects text from cursor position to the end of current line
## [1.0.9] - 2024-12-17
### Added
- Added a new feature to paste as a code block. The default hotkey is `CTRL + ALT + V`.
- Introduced the "contextual code block language" feature. This allows the plugin to automatically determine the programming language for a code block that is being pasted using "Paste as a code block" based on the note's title, its parent folder, or the nearest to the root folder ancestor folder.
## [1.0.8] - 2024-12-12
### Added
- Added a setting that allows the content of an inline code block to be copied with a double-click.
### Changed
- The page now scrolls to the top when the cursor moves to the end of the page, providing a clearer indication of the cursor's current position.
### Fixed
- Fixed an issue with cursor positioning after executing the `Select Link Display Text` command.
- Resolved an issue that prevented hotkeys from working with non-English keyboard layouts on Windows.
## [1.0.7] - 2024-11-27
- Added ability to turn Off "Tab" key indentation, if the setting `Turn off TAB key indentation` is turned on
## [1.0.6] - 2024-10-27
- Changed "Move Cursor to Next Heading" / "Move Cursor to Previous Heading" default hotkeys to `CTRL + ~` / `CTRL + SHIFT + ~`
- Changed "Move to Next Heading Level X" /  "Move to Previous Heading Level X" default hotkeys to `CTRL + 1-6` / `CTRL + SHIFT + 1-6`
- Updated "Move Cursor to Next Heading" and "Move Cursor to Previous Heading" to move the cursor to the end or beginning of the note, respectively, when no further or previous headings are found.
- Updated "Move to Next Heading Level X" and "Move to Previous Heading Level X" to move the cursor to the end or beginning of the note, respectively, when no further or previous headings of the specified level are found.
## [1.0.5] - 2024-10-19
- Changed ID of plugin
- Added Hotkeys to move to next and previous heading
