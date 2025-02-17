import { Editor } from 'obsidian';
import JustAnotherHotkeyPlugin from './main';

export function registerCommands(plugin: JustAnotherHotkeyPlugin) {
    //SECTION - Heading commands
    //NOTE - "Select to the End of Current Heading" command (Mod + S)
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

    //NOTE - "Select to the Beginning of Current Heading" command (Mod + Shift + S)
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

    //NOTE - "Select Current Heading" command (Mod + Alt + S)
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

    //NOTE - "Select All Current Level Headings" command (Mod + Alt + PageDown)
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

    //NOTE - "Select Current and Child Headings" command (Mod + Alt + Shift + S)
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

    //NOTE - "Move to Next Heading Level 1-6" commands (Mod + 1, Mod + 2 ... Mod + 6)
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

        //NOTE - "Move to Previous Heading Level 1-6" commands (Mod + Shift + 1, Mod + Shift + 2 ... Mod + Shift + 6)
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

    //NOTE - "Move Cursor to Next Heading" command (Mod + ~)
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

    //NOTE - "Move Cursor to Previous Heading" command (Mod + Shift + ~)
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

    //TODO - add functions
    //NOTE - "Move Heading (with content) Up" command (Alt + PageUp)
    plugin.addCommand({
        id: 'move-heading-up',
        name: 'Move Heading (with content) Up',
        editorCallback: (editor: Editor) => {
            //! plugin.moveHeadingUp(editor);
        },
        hotkeys: [
            {
                modifiers: ['Alt'],
                key: 'PageUp',
            },
        ],
    });

    //NOTE - "Move Heading (with content) Down" command (Alt + PageDown)
    plugin.addCommand({
        id: 'move-heading-down',
        name: 'Move Heading (with content) Down',
        editorCallback: (editor: Editor) => {
            //! plugin.moveHeadingDown(editor);
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
    //NOTE - "Select Link Display Text" command (Mod + \)
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

    //NOTE - "Select Link Without Display Text" command (Mod + Shift + \)
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

    //NOTE - "Select Link Content" command (Mod + Alt + \)
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

    //NOTE - "Select Full Link" command (Mod + Shift + Alt + \)
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

    //NOTE - "Paste as Code Block" command (Mod + Alt + V)
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

    //NOTE - Select current line (Mod + L)
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

    //NOTE - Clear selection from current line (Mod + Shift + L)
    plugin.addCommand({
        id: 'clear-selection-from-current-line',
        name: 'Clear Selection from Current Line',
        editorCallback: (editor: Editor) => {
            plugin.clearSelectionFromCurrentLine(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Shift'],
                key: 'L',
            },
        ],
    });
}