# 1.0.11
## Added
- Added new commands to move headings and their content up and down:
  - `Move Heading Up` (ALT + PageUp): Moves the current heading and all its content (including subheadings) up, swapping positions with the heading above
  - `Move Heading Down` (ALT + PageDown): Moves the current heading and all its content (including subheadings) down, swapping positions with the heading below
- New command `Select Previous Line` (CTRL + SHIFT + L): Selects the previous logical line in the editor
## Changed
- Default hotkey for `Clear selection from current line` command changed from `CTRL + SHIFT + L` to `CTRL + ALT + L`
# 1.0.10
## Added
- Added new line selection commands:
	- `Select current line` (CTRL + L): Selects the current logical line in the editor
	- `Clear selection from current line` (CTRL + SHIFT + L): Removes selection from the current logical line and moves cursor to the beginning of the previous line
	- `Select to Line Start` (CTRL + SHIFT + <): Selects text from cursor position to the start of current line (Ignores list markers)
	- `Select to Line End` (CTRL + SHIFT + >): Selects text from cursor position to the end of current line
# 1.0.9
## Added
- Added a new feature to paste as a code block. The default hotkey is `CTRL + ALT + V`.
- Introduced the "contextual code block language" feature. This allows the plugin to automatically determine the programming language for a code block that is being pasted using "Paste as a code block" based on the note's title, its parent folder, or the nearest to the root folder ancestor folder.
# 1.0.8
## Added
- Added a setting that allows the content of an inline code block to be copied with a double-click.
## Changed
- The page now scrolls to the top when the cursor moves to the end of the page, providing a clearer indication of the cursor's current position.
## Fixed
- Fixed an issue with cursor positioning after executing the `Select Link Display Text` command.
- Resolved an issue that prevented hotkeys from working with non-English keyboard layouts on Windows.
# 1.0.7
- Added ability to turn Off "Tab" key indentation, if the setting `Turn off TAB key indentation` is turned on
# 1.0.6
- Changed "Move Cursor to Next Heading" / "Move Cursor to Previous Heading" default hotkeys to `CTRL + ~` / `CTRL + SHIFT + ~`
- Changed "Move to Next Heading Level X" /  "Move to Previous Heading Level X" default hotkeys to `CTRL + 1-6` / `CTRL + SHIFT + 1-6`
- Updated "Move Cursor to Next Heading" and "Move Cursor to Previous Heading" to move the cursor to the end or beginning of the note, respectively, when no further or previous headings are found.
- Updated "Move to Next Heading Level X" and "Move to Previous Heading Level X" to move the cursor to the end or beginning of the note, respectively, when no further or previous headings of the specified level are found.
# 1.0.5
- Changed ID of plugin
- Added Hotkeys to move to next and previous heading
