import { Editor } from 'obsidian';
import JustAnotherHotkeyPlugin from './main';

export function registerCommands(plugin: JustAnotherHotkeyPlugin) {
    //SECTION - Heading commands

    /**
     * NOTE - Select to the End of Current Heading command (Mod + S)
     * @see {@link JustAnotherHotkeyPlugin.selectToEndOfCurrentHeading}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-to-end-of-heading',
        name: 'Select to the End of Current Heading',
        editorCallback: (editor: Editor) => {
            plugin.selectToEndOfCurrentHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod'],
                key: 'S',
            },
        ],
    });

    /**
     * NOTE - Select to the Beginning of Current Heading command (Mod + Shift + S)
     * @see {@link JustAnotherHotkeyPlugin.selectToBeginningOfCurrentHeading}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-to-beginning-of-heading',
        name: 'Select to the Beginning of Current Heading',
        editorCallback: (editor: Editor) => {
            plugin.selectToBeginningOfCurrentHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Shift'],
                key: 'S',
            },
        ],
    });

    /**
     * NOTE - Select Current Heading command (Mod + Alt + S)
     * @see {@link JustAnotherHotkeyPlugin.selectCurrentHeading}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-current-heading',
        name: 'Select Current Heading',
        editorCallback: (editor: Editor) => {
            plugin.selectCurrentHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Alt'],
                key: 'S',
            },
        ],
    });


    /**
     * NOTE - Select Current and Child Headings command (Mod + Alt + Shift + S)
     * @see {@link JustAnotherHotkeyPlugin.selectCurrentAndChildHeadings}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'select-current-and-child-headings',
        name: 'Select Current and Child Headings',
        editorCallback: (editor: Editor) => {
            plugin.selectCurrentAndChildHeadings(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Alt', 'Shift'],
                key: 'S',
            },
        ],
    });

    /**
     * NOTE - Select All Current Level Headings command (Mod + Alt + PageDown)
     * @see {@link JustAnotherHotkeyPlugin.selectAllCurrentLevelHeadings}
     * @param editor - The editor to make changes in.
     */
    //TODO - Change hotkey
    plugin.addCommand({
        id: 'select-all-current-level-headings',
        name: 'Select All Current Level Headings',
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
     * NOTE - "Move to Next Heading Level 1-6" commands (Mod + 1, Mod + 2 ... Mod + 6)
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
                    modifiers: ['Mod'],
                    key: `${level}`,
                },
            ],
        });

        /**
         * NOTE - "Move to Previous Heading Level 1-6" commands (Mod + Shift + 1, Mod + Shift + 2 ... Mod + Shift + 6)
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
                    modifiers: ['Mod', 'Shift'],
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
     * NOTE - "Move Heading (with content) Up" command (Alt + PageUp)
     * @see {@link JustAnotherHotkeyPlugin.moveHeadingUp}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'move-heading-up',
        name: 'Move Heading (with content) Up',
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
     * NOTE - "Move Heading (with content) Down" command (Alt + PageDown)
     * @see {@link JustAnotherHotkeyPlugin.moveHeadingDown}
     * @param editor - The editor to make changes in.
     */
    plugin.addCommand({
        id: 'move-heading-down',
        name: 'Move Heading (with content) Down',
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

    //!SECTION - Heading commands

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
     * NOTE - "Select Current Line" command (Mod + L)
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
                modifiers: ['Mod'],
                key: 'L',
            },
        ],
    });



    /**
     * NOTE - "Select Previous Line" command (Mod + Shift + L)
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
                modifiers: ['Mod', 'Shift'],
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
 * NOTE - "Select to Line Start" command (Mod + Shift + <)
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
                modifiers: ['Mod', 'Shift'],
                key: ',',
            },
        ],
    });

    /**
 * NOTE - "Select to Line End" command (Mod + Shift + >)
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
                modifiers: ['Mod', 'Shift'],
                key: '.',
            },
        ],
    });
}