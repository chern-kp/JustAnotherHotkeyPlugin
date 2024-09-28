/* eslint-disable @typescript-eslint/no-empty-interface */
import { Editor, Notice, Plugin } from 'obsidian';

interface JustAnotherHotkeyPluginSettings {

}

const DEFAULT_SETTINGS: JustAnotherHotkeyPluginSettings = {
}

export default class JustAnotherHotkeyPlugin extends Plugin {
	settings: JustAnotherHotkeyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'select-to-next-heading',
			name: 'Select to Next Heading',
			editorCallback: (editor: Editor) => {
				this.selectToNextHeading(editor);
			},
			hotkeys: [
				{
					modifiers: ['Mod'],
					key: 's',
				},
			],
		});

		this.addCommand({
			id: 'select-to-previous-heading',
			name: 'Select to Previous Heading',
			editorCallback: (editor: Editor) => {
				this.selectToPreviousHeading(editor);
			},
			hotkeys: [
				{
					modifiers: ['Mod', 'Shift'],
					key: 's',
				},
			],
		});

		this.addCommand({
			id: 'select-current-heading',
			name: 'Select Current Heading',
			editorCallback: (editor: Editor) => {
				this.selectCurrentHeading(editor);
			},
			hotkeys: [
				{
					modifiers: ['Mod', 'Alt'],
					key: 's',
				},
			],
		});

		this.addCommand({
			id: 'select-all-current-level-headings',
			name: 'Select All Current Level Headings',
			editorCallback: (editor: Editor) => {
				this.selectAllCurrentLevelHeadings(editor);
			},
			hotkeys: [
				{
					modifiers: ['Mod', 'Shift', 'Alt'],
					key: 's',
				},
			],
		});

		for (let level = 1; level <= 6; level++) {
			this.addCommand({
				id: `move-to-next-heading-level-${level}`,
				name: `Move to Next Heading Level ${level}`,
				editorCallback: (editor: Editor) => {
					this.moveToNextHeading(editor, level);
				},
				hotkeys: [
					{
						modifiers: ['Alt'],
						key: `${level}`,
					},
				],
			});

			this.addCommand({
				id: `move-to-previous-heading-level-${level}`,
				name: `Move to Previous Heading Level ${level}`,
				editorCallback: (editor: Editor) => {
					this.moveToPreviousHeading(editor, level);
				},
				hotkeys: [
					{
						modifiers: ['Alt', 'Shift'],
						key: `${level}`,
					},
				],
			});

			this.addCommand({
				id: 'select-link-display-text',
				name: 'Select Link Display Text',
				editorCallback: (editor: Editor) => {
					this.selectLinkDisplayText(editor);
				},
				hotkeys: [
					{
						modifiers: ['Mod'],
						key: '\\',
					},
				],
			});
			this.addCommand({
				id: 'select-link-without-display-text',
				name: 'Select Link Without Display Text',
				editorCallback: (editor: Editor) => {
					this.selectLinkWithoutDisplayText(editor);
				},
				hotkeys: [
					{
						modifiers: ['Mod', 'Shift'],
						key: '\\',
					},
				],
			});
		}
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	selectToNextHeading(editor: Editor) {
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();

		let nextHeadingLine = -1;

		for (let i = cursor.line + 1; i < lineCount; i++) {
			const lineText = editor.getLine(i);
			if (/^#+\s/.test(lineText)) {
				nextHeadingLine = i;
				break;
			}
		}

		const fromPos = {
			line: cursor.line,
			ch: cursor.ch,
		};

		let toPos;
		if (nextHeadingLine !== -1) {
			toPos = {
				line: nextHeadingLine - 1,
				ch: editor.getLine(nextHeadingLine - 1).length,
			};
		} else {
			toPos = {
				line: lineCount - 1,
				ch: editor.getLine(lineCount - 1).length,
			};
		}

		editor.setSelection(fromPos, toPos);
	}

	selectToPreviousHeading(editor: Editor) {
		const cursor = editor.getCursor();
		let previousHeadingLine = -1;

		for (let i = cursor.line - 1; i >= 0; i--) {
			const lineText = editor.getLine(i);
			if (/^#+\s/.test(lineText)) {
				previousHeadingLine = i;
				break;
			}
		}

		const fromPos = {
			line: cursor.line,
			ch: cursor.ch,
		};

		let toPos;
		if (previousHeadingLine !== -1) {
			toPos = {
				line: previousHeadingLine + 1,
				ch: 0,
			};
		} else {
			toPos = {
				line: 0,
				ch: 0,
			};
		}

		editor.setSelection(toPos, fromPos);
	}

	selectCurrentHeading(editor: Editor) {
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();

		let previousHeadingLine = -1;
		let nextHeadingLine = lineCount;

		for (let i = cursor.line; i >= 0; i--) {
			const lineText = editor.getLine(i);
			if (/^#+\s/.test(lineText)) {
				previousHeadingLine = i;
				break;
			}
		}

		for (let i = cursor.line + 1; i < lineCount; i++) {
			const lineText = editor.getLine(i);
			if (/^#+\s/.test(lineText)) {
				nextHeadingLine = i;
				break;
			}
		}

		const fromPos = {
			line: previousHeadingLine,
			ch: 0,
		};

		const toPos = {
			line: nextHeadingLine - 1,
			ch: editor.getLine(nextHeadingLine - 1).length,
		};

		editor.setSelection(fromPos, toPos);
	}

	selectAllCurrentLevelHeadings(editor: Editor) {
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();

		let currentHeadingLine = -1;
		let currentHeadingLevel = 0;
		for (let i = cursor.line; i >= 0; i--) {
			const lineText = editor.getLine(i);
			const match = lineText.match(/^(#+)\s/);
			if (match) {
				currentHeadingLine = i;
				currentHeadingLevel = match[1].length;
				break;
			}
		}

		if (currentHeadingLine === -1) {
			new Notice('No heading found at the cursor position.');
			return;
		}

		let parentHeadingLine = -1;
		let parentHeadingLevel = 0;
		for (let i = currentHeadingLine - 1; i >= 0; i--) {
			const lineText = editor.getLine(i);
			const match = lineText.match(/^(#+)\s/);
			if (match) {
				const level = match[1].length;
				if (level < currentHeadingLevel) {
					parentHeadingLine = i;
					parentHeadingLevel = level;
					break;
				}
			}
		}

		let startLine = parentHeadingLine + 1;
		if (parentHeadingLine === -1) {
			startLine = 0;
		}

		let endLine = lineCount - 1;
		for (let i = currentHeadingLine + 1; i < lineCount; i++) {
			const lineText = editor.getLine(i);
			const match = lineText.match(/^(#+)\s/);
			if (match) {
				const level = match[1].length;
				if (level <= parentHeadingLevel) {
					endLine = i - 1;
					break;
				}
			}
		}

		let firstSameLevelHeadingLine = -1;
		let lastSameLevelHeadingLine = -1;
		let headingCount = 0;

		for (let i = startLine; i <= endLine; i++) {
			const lineText = editor.getLine(i);
			const match = lineText.match(/^(#+)\s/);
			if (match) {
				const level = match[1].length;
				if (level === currentHeadingLevel) {
					if (firstSameLevelHeadingLine === -1) {
						firstSameLevelHeadingLine = i;
					}
					lastSameLevelHeadingLine = i;
					headingCount++;
				}
			}
		}

		let selectionEndLine = endLine;
		for (let i = lastSameLevelHeadingLine + 1; i <= endLine; i++) {
			const lineText = editor.getLine(i);
			const match = lineText.match(/^(#+)\s/);
			if (match) {
				const level = match[1].length;
				if (level <= currentHeadingLevel) {
					selectionEndLine = i - 1;
					break;
				}
			}
		}

		const fromPos = {
			line: firstSameLevelHeadingLine,
			ch: 0,
		};

		const toPos = {
			line: selectionEndLine,
			ch: editor.getLine(selectionEndLine).length,
		};

		editor.setSelection(fromPos, toPos);

		new Notice(`${headingCount} headings of level ${currentHeadingLevel} were selected.`);
	}


	moveToNextHeading(editor: Editor, level: number) {
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();

		let foundHeadingLine = -1;

		for (let i = cursor.line + 1; i < lineCount; i++) {
			const lineText = editor.getLine(i);
			const match = lineText.match(/^(#+)\s/);
			if (match) {
				const headingLevel = match[1].length;
				if (headingLevel === level) {
					foundHeadingLine = i;
					break;
				}
			}
		}

		if (foundHeadingLine !== -1) {
			const lineText = editor.getLine(foundHeadingLine);
			editor.setCursor({ line: foundHeadingLine, ch: lineText.length });
		} else {
			new Notice(`No further heading level ${level} found.`);
		}
	}

	moveToPreviousHeading(editor: Editor, level: number) {
		const cursor = editor.getCursor();

		let foundHeadingLine = -1;

		for (let i = cursor.line - 1; i >= 0; i--) {
			const lineText = editor.getLine(i);
			const match = lineText.match(/^(#+)\s/);
			if (match) {
				const headingLevel = match[1].length;
				if (headingLevel === level) {
					foundHeadingLine = i;
					break;
				}
			}
		}

		if (foundHeadingLine !== -1) {
			const lineText = editor.getLine(foundHeadingLine);
			editor.setCursor({ line: foundHeadingLine, ch: lineText.length });
		} else {
			new Notice(`No previous heading level ${level} found.`);
		}
	}

	selectLinkDisplayText(editor: Editor) {
		const cursor = editor.getCursor();
		const lineText = editor.getLine(cursor.line);

		const linkRegex = /\[\[([^\]]+)\]\]/g;
		let match;
		let found = false;

		while ((match = linkRegex.exec(lineText)) !== null) {
			const start = match.index;
			const end = linkRegex.lastIndex;

			if (cursor.ch >= start && cursor.ch <= end) {
				const linkContent = match[1];
				const pipeIndex = linkContent.indexOf('|');

				if (pipeIndex !== -1) {
					const fromPos = {
						line: cursor.line,
						ch: start + 2 + pipeIndex + 1,
					};
					const toPos = {
						line: cursor.line,
						ch: end - 2,
					};
					editor.setSelection(fromPos, toPos);
				} else {

					const newLinkContent = linkContent + '|';
					const newLineText = lineText.substring(0, start + 2) + newLinkContent + lineText.substring(end - 2);
					editor.setLine(cursor.line, newLineText);

					const cursorPos = {
						line: cursor.line,
						ch: start + 2 + newLinkContent.length,
					};
					editor.setCursor(cursorPos);
				}

				found = true;
				break;
			}
		}

		if (!found) {
			new Notice('Cursor is not inside or near a link.');
		}
	}

	selectLinkWithoutDisplayText(editor: Editor) {
		const cursor = editor.getCursor();
		const lineText = editor.getLine(cursor.line);

		const linkRegex = /\[\[([^\]]+)\]\]/g;
		let match;
		let found = false;

		while ((match = linkRegex.exec(lineText)) !== null) {
			const start = match.index;
			const end = linkRegex.lastIndex;


			if (cursor.ch >= start && cursor.ch <= end) {
				const linkContent = match[1];
				const pipeIndex = linkContent.indexOf('|');

				if (pipeIndex !== -1) {
					const fromPos = {
						line: cursor.line,
						ch: start + 2,
					};
					const toPos = {
						line: cursor.line,
						ch: start + 2 + pipeIndex,
					};
					editor.setSelection(fromPos, toPos);
				} else {
					const fromPos = {
						line: cursor.line,
						ch: start + 2,
					};
					const toPos = {
						line: cursor.line,
						ch: end - 2,
					};
					editor.setSelection(fromPos, toPos);
				}

				found = true;
				break;
			}
		}

		if (!found) {
			new Notice('Cursor is not inside or near a link.');
		}
	}

}