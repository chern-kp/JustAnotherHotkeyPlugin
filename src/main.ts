/* eslint-disable @typescript-eslint/no-empty-interface */
import { Editor, Notice, Plugin } from 'obsidian';
import { registerCommands } from './hotkeys';


interface JustAnotherHotkeyPluginSettings {

}

const DEFAULT_SETTINGS: JustAnotherHotkeyPluginSettings = {
}

export default class JustAnotherHotkeyPlugin extends Plugin {
	settings: JustAnotherHotkeyPluginSettings;

	async onload() {
		await this.loadSettings();
		registerCommands(this);

	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private getHeadingLevelAtLine(editor: Editor, line: number): number | null {
		const lineText = editor.getLine(line);
		const match = lineText.match(/^(#+)\s/);
		if (match) {
			return match[1].length;
		}
		return null;
	}

	private findHeadingLine(editor: Editor, startLine: number, direction: 'next' | 'previous', level?: number): number {
		const lineCount = editor.lineCount();
		const delta = direction === 'next' ? 1 : -1;
		let line = startLine + delta;
		while (line >= 0 && line < lineCount) {
			const lineText = editor.getLine(line);
			const match = lineText.match(/^(#+)\s/);
			if (match) {
				const headingLevel = match[1].length;
				if (level === undefined || headingLevel === level) {
					return line;
				}
			}
			line += delta;
		}
		return -1;
	}

	private findLinkUnderCursor(editor: Editor): { lineText: string, match: RegExpExecArray, start: number, end: number } | null {
		const cursor = editor.getCursor();
		const lineText = editor.getLine(cursor.line);

		const linkRegex = /$$([^$]+)$$/g;
		let match: RegExpExecArray | null;
		while ((match = linkRegex.exec(lineText)) !== null) {
			const start = match.index;
			const end = linkRegex.lastIndex;
			if (cursor.ch >= start && cursor.ch <= end) {
				return { lineText, match, start, end };
			}
		}
		return null;
	}

	selectToNextHeading(editor: Editor) {
		const cursor = editor.getCursor();
		const nextHeadingLine = this.findHeadingLine(editor, cursor.line, 'next');

		const fromPos = cursor;

		let toPos: CodeMirror.Position;

		if (nextHeadingLine !== -1) {
			toPos = {
				line: nextHeadingLine - 1,
				ch: editor.getLine(nextHeadingLine - 1).length,
			};
		} else {
			const lineCount = editor.lineCount();
			toPos = {
				line: lineCount - 1,
				ch: editor.getLine(lineCount - 1).length,
			};
		}

		editor.setSelection(fromPos, toPos);
	}


	selectToPreviousHeading(editor: Editor) {
		const cursor = editor.getCursor();
		const previousHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');

		const toPos = cursor;

		let fromPos: CodeMirror.Position;

		if (previousHeadingLine !== -1) {
			fromPos = {
				line: previousHeadingLine + 1,
				ch: 0,
			};
		} else {
			fromPos = {
				line: 0,
				ch: 0,
			};
		}

		editor.setSelection(fromPos, toPos);
	}

	selectCurrentHeading(editor: Editor) {
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();

		let currentHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');
		if (currentHeadingLine === -1) currentHeadingLine = cursor.line;

		let nextHeadingLine = this.findHeadingLine(editor, currentHeadingLine, 'next');
		if (nextHeadingLine === -1) nextHeadingLine = lineCount;

		const fromPos = { line: currentHeadingLine, ch: 0 };
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
			const level = this.getHeadingLevelAtLine(editor, i);
			if (level !== null) {
				currentHeadingLine = i;
				currentHeadingLevel = level;
				break;
			}
		}

		if (currentHeadingLine === -1) {
			new Notice('No heading found at the cursor position.');
			return;
		}

		const headings = [];
		for (let i = 0; i < lineCount; i++) {
			const level = this.getHeadingLevelAtLine(editor, i);
			if (level === currentHeadingLevel) {
				headings.push(i);
			}
		}

		if (headings.length === 0) {
			new Notice('No headings of the current level found.');
			return;
		}

		const fromPos = { line: headings[0], ch: 0 };
		const toLine = editor.getLine(headings[headings.length - 1] + 1) ? headings[headings.length - 1] + 1 : lineCount - 1;
		const toPos = { line: toLine, ch: editor.getLine(toLine).length };

		editor.setSelection(fromPos, toPos);

		new Notice(`${headings.length} headings of level ${currentHeadingLevel} were selected.`);
	}

	moveToNextHeading(editor: Editor, level: number) {
		const cursor = editor.getCursor();
		const foundHeadingLine = this.findHeadingLine(editor, cursor.line, 'next', level);

		if (foundHeadingLine !== -1) {
			const lineText = editor.getLine(foundHeadingLine);
			editor.setCursor({ line: foundHeadingLine, ch: lineText.length });
		} else {
			new Notice(`No further heading level ${level} found.`);
		}
	}

	moveToPreviousHeading(editor: Editor, level: number) {
		const cursor = editor.getCursor();
		const foundHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous', level);

		if (foundHeadingLine !== -1) {
			const lineText = editor.getLine(foundHeadingLine);
			editor.setCursor({ line: foundHeadingLine, ch: lineText.length });
		} else {
			new Notice(`No previous heading level ${level} found.`);
		}
	}

	selectLinkDisplayText(editor: Editor) {
		const result = this.findLinkUnderCursor(editor);
		if (!result) {
			new Notice('Cursor is not inside or near a link.');
			return;
		}

		const { lineText, match, start, end } = result;
		const cursor = editor.getCursor();

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
	}


	selectLinkWithoutDisplayText(editor: Editor) {
		const result = this.findLinkUnderCursor(editor);
		if (!result) {
			new Notice('Cursor is not inside or near a link.');
			return;
		}

		const { match, start, end } = result;
		const cursor = editor.getCursor();

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
	}

	selectLinkContent(editor: Editor) {
		const result = this.findLinkUnderCursor(editor);
		if (!result) {
			new Notice('Cursor is not inside or near a link.');
			return;
		}

		const { start, end } = result;
		const cursor = editor.getCursor();

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
}

