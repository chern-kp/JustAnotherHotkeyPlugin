import { Editor } from 'obsidian';
import JustAnotherHotkeyPlugin from './main';

export function registerCommands(plugin: JustAnotherHotkeyPlugin) {
    plugin.addCommand({
        id: 'select-to-end-of-heading',
        name: 'Select to the End of Current Heading',
        editorCallback: (editor: Editor) => {
            plugin.selectToEndOfCurrentHeading(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod'],
                key: 's',
            },
        ],
    });

    plugin.addCommand({
        id: 'select-to-beginning-of-heading',
        name: 'Select to the Beginning of Current Heading',
        editorCallback: (editor: Editor) => {
            plugin.selectToBeginningOfCurrentHeading(editor);
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
                modifiers: ['Mod', 'Alt'],
                key: 'PageDown',
            },
        ],
    });

    plugin.addCommand({
        id: 'select-current-and-child-headings',
        name: 'Select Current and Child Headings',
        editorCallback: (editor: Editor) => {
            plugin.selectCurrentAndChildHeadings(editor);
        },
        hotkeys: [
            {
                modifiers: ['Mod', 'Alt', 'Shift'],
                key: 's',
            },
        ],
    });

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

    
    plugin.addCommand({
		id: 'move-cursor-to-next-heading',
		name: 'Move Cursor to Next Heading',
		editorCallback: (editor: Editor) => {
			plugin.moveCursorToNextHeading(editor);
		},
		hotkeys: [
			{
				modifiers: ["Alt"],
				key: '`',
			},
		],
	});

	plugin.addCommand({
		id: 'move-cursor-to-previous-heading',
		name: 'Move Cursor to Previous Heading',
		editorCallback: (editor: Editor) => {
			plugin.moveCursorToPreviousHeading(editor);
		},
		hotkeys: [
			{
				modifiers: ["Alt", "Shift"],
				key: '`',
			},
		],
	});

}