import { Editor } from 'obsidian';
import JustAnotherHotkeyPlugin from './main';

export function registerCommands(plugin: JustAnotherHotkeyPlugin) {
    plugin.addCommand({
        id: 'select-to-next-heading',
        name: 'Select to Next Heading',
        editorCallback: (editor: Editor) => {
            plugin.selectToNextHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod'],
                key: 's',
            },
        ],
    });

    plugin.addCommand({
        id: 'select-to-previous-heading',
        name: 'Select to Previous Heading',
        editorCallback: (editor: Editor) => {
            plugin.selectToPreviousHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Shift'],
                key: 's',
            },
        ],
    });

    plugin.addCommand({
        id: 'select-current-heading',
        name: 'Select Current Heading',
        editorCallback: (editor: Editor) => {
            plugin.selectCurrentHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Alt'],
                key: 's',
            },
        ],
    });

    plugin.addCommand({
        id: 'select-all-current-level-headings',
        name: 'Select All Current Level Headings',
        editorCallback: (editor: Editor) => {
            plugin.selectAllCurrentLevelHeadings(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Shift', 'Alt'],
                key: 's',
            },
        ],
    });

    for (let level = 1; level <= 6; level++) {
        plugin.addCommand({
            id: `move-to-next-heading-level-${level}`,
            name: `Move to Next Heading Level ${level}`,
            editorCallback: (editor: Editor) => {
                plugin.moveToNextHeading(editor, level);
            },
            hotkeys: [
                {
                    modifiers: ['Alt'],
                    key: `${level}`,
                },
            ],
        });

        plugin.addCommand({
            id: `move-to-previous-heading-level-${level}`,
            name: `Move to Previous Heading Level ${level}`,
            editorCallback: (editor: Editor) => {
                plugin.moveToPreviousHeading(editor, level);
            },
            hotkeys: [
                {
                    modifiers: ['Alt', 'Shift'],
                    key: `${level}`,
                },
            ],
        });
    }

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
}