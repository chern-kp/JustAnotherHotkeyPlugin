import { Editor } from 'obsidian';
import JustAnotherHotkeyPlugin from './main';

export function registerCommands(plugin: JustAnotherHotkeyPlugin) {
    //SECTION - Section commands

    /**
     * NOTE - Select to the End of Current Section command (Alt + Shift + ArrowDown)
     * @see {@link JustAnotherHotkeyPlugin.selectToEndOfCurrentHeading}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-to-end-of-section',
        name: 'Select to the End of Current Section',
        editorCallback: (editor: Editor) => {
            plugin.selectToEndOfCurrentHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt', 'Shift'],
                key: 'ArrowDown',
            },
        ],
    });

    /**
     * NOTE - Select to the Beginning of Current Section command (Alt + Shift + ArrowUp)
     * @see {@link JustAnotherHotkeyPlugin.selectToBeginningOfCurrentHeading}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-to-beginning-of-section',
        name: 'Select to the Beginning of Current Section',
        editorCallback: (editor: Editor) => {
            plugin.selectToBeginningOfCurrentHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt', 'Shift'],
                key: 'ArrowUp',
            },
        ],
    });

    /**
     * NOTE - Select Section command (Alt + H).
     * First press selects the current section; second press expands to include child sections.
     * @see {@link JustAnotherHotkeyPlugin.selectHeadingProgressive}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-section',
        name: 'Select Section',
        editorCallback: (editor: Editor) => {
            plugin.selectHeadingProgressive(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt'],
                key: 'H',
            },
        ],
    });

    /**
     * NOTE - Select Section Upward command (Alt + Shift + H).
     * First press selects the current section with its parent; repeated presses expand further upward.
     * @see {@link JustAnotherHotkeyPlugin.selectHeadingUpwardProgressive}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-section-upward',
        name: 'Select Section Upward',
        editorCallback: (editor: Editor) => {
            plugin.selectHeadingUpwardProgressive(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt', 'Shift'],
                key: 'H',
            },
        ],
    });

    /**
     * NOTE - Select All Current Level Sections command (Mod + Alt + PageDown)
     * @see {@link JustAnotherHotkeyPlugin.selectAllCurrentLevelHeadings}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-all-current-level-sections',
        name: 'Select All Current Level Sections',
        editorCallback: (editor: Editor) => {
            plugin.selectAllCurrentLevelHeadings(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Alt'],
                key: 'PageDown',
            },
        ],
    });


    /**
     * NOTE - "Move to Next Heading Level 1-6" commands (Alt + 1, Alt + 2 ... Alt + 6)
     * @see {@link JustAnotherHotkeyPlugin.moveToNextHeadingOfLevel}
     * @param editor - The editor to make changes in.
     * @param level - The level of the heading to move to.
     */
    for (let level = 1; level <= 6; level++) {
        plugin.addCommand({
            id: `move-to-next-heading-level-${level}`,
            name: `Move to Next Heading Level ${level}`,
            editorCallback: (editor: Editor) => {
                plugin.moveToNextHeadingOfLevel(editor, level);
            },
            hotkeys: [
                {
                    modifiers: ['Alt'],
                    key: `${level}`,
                },
            ],
        });

        /**
         * NOTE - "Move to Previous Heading Level 1-6" commands (Alt + Shift + 1, Alt + Shift + 2 ... Alt + Shift + 6)
         * @see {@link JustAnotherHotkeyPlugin.moveToPreviousHeadingOfLevel}
         * @param editor - The editor to make changes in.
         * @param level - The level of the heading to move to.
         */
        plugin.addCommand({
            id: `move-to-previous-heading-level-${level}`,
            name: `Move to Previous Heading Level ${level}`,
            editorCallback: (editor: Editor) => {
                plugin.moveToPreviousHeadingOfLevel(editor, level);
            },
            hotkeys: [
                {
                modifiers: ['Alt', 'Shift'],
                    key: `${level}`,
                },
            ],
        });
    }

    /**
     * NOTE - "Move Cursor to Next Heading" command (Mod + ~)
     * @see {@link JustAnotherHotkeyPlugin.moveCursorToNextHeading}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'move-cursor-to-next-heading',
        name: 'Move Cursor to Next Heading',
        editorCallback: (editor: Editor) => {
            plugin.moveCursorToNextHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ["Mod"],
                key: '`',
            },
        ],
    });

    /**
     * NOTE - "Move Cursor to Previous Heading" command (Mod + Shift + ~)
     * @see {@link JustAnotherHotkeyPlugin.moveCursorToPreviousHeading}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'move-cursor-to-previous-heading',
        name: 'Move Cursor to Previous Heading',
        editorCallback: (editor: Editor) => {
            plugin.moveCursorToPreviousHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ["Mod", "Shift"],
                key: '`',
            },
        ],
    });

    /**
     * NOTE - "Move Section Up" command (Alt + PageUp)
     * @see {@link JustAnotherHotkeyPlugin.moveHeadingUp}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'move-section-up',
        name: 'Move Section Up',
        editorCallback: (editor: Editor) => {
            plugin.moveHeadingUp(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt'],
                key: 'PageUp',
            },
        ],
    });

    /**
     * NOTE - "Move Section Down" command (Alt + PageDown)
     * @see {@link JustAnotherHotkeyPlugin.moveHeadingDown}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'move-section-down',
        name: 'Move Section Down',
        editorCallback: (editor: Editor) => {
            plugin.moveHeadingDown(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt'],
                key: 'PageDown',
            },
        ],
    });

    //!SECTION - Section commands

    //SECTION - Link commands
    /**
     * NOTE - "Select Link Display Text" command (Mod + \)
     * @see {@link JustAnotherHotkeyPlugin.selectLinkDisplayText}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-link-display-text',
        name: 'Select Link Display Text',
        editorCallback: (editor: Editor) => {
            plugin.selectLinkDisplayText(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod'],
                key: '\\',
            },
        ],
    });

    /**
     * NOTE - "Select Link Without Display Text" command (Mod + Shift + \)
     * @see {@link JustAnotherHotkeyPlugin.selectLinkWithoutDisplayText}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-link-without-display-text',
        name: 'Select Link Without Display Text',
        editorCallback: (editor: Editor) => {
            plugin.selectLinkWithoutDisplayText(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Shift'],
                key: '\\',
            },
        ],
    });

    /**
     * NOTE - "Select Link Content" command (Mod + Alt + \)
     * @see {@link JustAnotherHotkeyPlugin.selectLinkContent}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-link-content',
        name: 'Select Link Content',
        editorCallback: (editor: Editor) => {
            plugin.selectLinkContent(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Alt'],
                key: '\\',
            },
        ],
    });


    /**
     * NOTE - "Select Full Link" command (Mod + Shift + Alt + \)
     * @see {@link JustAnotherHotkeyPlugin.selectFullLink}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-full-link',
        name: 'Select Full Link',
        editorCallback: (editor: Editor) => {
            plugin.selectFullLink(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Shift', 'Alt'],
                key: '\\',
            },
        ],
    });
    //!SECTION - Link commands

    /**
 * NOTE - "Paste as Code Block" command (Mod + Alt + V)
 * @see {@link JustAnotherHotkeyPlugin.pasteAsCodeBlock}
 * @param editor - The editor to make changes in.
 */
    plugin.addCommand({
        id: 'paste-as-code-block',
        name: 'Paste as Code Block',
        editorCallback: (editor: Editor) => {
            plugin.pasteAsCodeBlock(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Alt'],
                key: 'V',
            },
        ],
    });

    /**
     * NOTE - "Select Current Line" command (Alt + L)
     * @see {@link JustAnotherHotkeyPlugin.selectCurrentLine}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-current-line',
        name: 'Select Current Line',
        editorCallback: (editor: Editor) => {
            plugin.selectCurrentLine(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt'],
                key: 'L',
            },
        ],
    });



    /**
     * NOTE - "Select Previous Line" command (Alt + Shift + L)
     * @see {@link JustAnotherHotkeyPlugin.selectPreviousLine}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-previous-line',
        name: 'Select Previous Line',
        editorCallback: (editor: Editor) => {
            plugin.selectPreviousLine(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt', 'Shift'],
                key: 'L',
            },
        ],
    });

    /**
 * NOTE - "Clear Selection from Current Line" command (Mod + Alt + L)
 * @see {@link JustAnotherHotkeyPlugin.clearSelectionFromCurrentLine}
 * @param editor - The editor to make changes in.
 */
    plugin.addCommand({
        id: 'clear-selection-from-current-line',
        name: 'Clear Selection from Current Line',
        editorCallback: (editor: Editor) => {
            plugin.clearSelectionFromCurrentLine(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Alt'],
                key: 'L',
            },
        ],
    });

    /**
 * NOTE - "Select to Line Start" command (Alt + <)
 * @see {@link JustAnotherHotkeyPlugin.selectToLineStart}
 * @param editor - The editor to make changes in.
 */
    plugin.addCommand({
        id: 'select-to-line-start',
        name: 'Select to Line Start',
        editorCallback: (editor: Editor) => {
            plugin.selectToLineStart(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt'],
                key: ',',
            },
        ],
    });

    /**
 * NOTE - "Select to Line End" command (Alt + >)
 * @see {@link JustAnotherHotkeyPlugin.selectToLineEnd}
 * @param editor - The editor to make changes in.
 */
    plugin.addCommand({
        id: 'select-to-line-end',
        name: 'Select to Line End',
        editorCallback: (editor: Editor) => {
            plugin.selectToLineEnd(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt'],
                key: '.',
            },
        ],
    });
}