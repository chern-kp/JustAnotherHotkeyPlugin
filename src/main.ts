/* eslint-disable @typescript-eslint/no-empty-interface */
import { Editor, Notice, Plugin } from 'obsidian';
import { registerCommands } from './hotkeys';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { JustAnotherHotkeyPluginSettingTab } from './settings';


interface JustAnotherHotkeyPluginSettings {
	disableTabIndentation: boolean;
	copyInlineCodeOnDoubleClick: boolean;
	useContextualCodeBlockLanguage: boolean;
	languageSearchLocation: 'noteName' | 'parentFolder' | 'nearestToRootAncestorFolder' | 'tags';
	codeBoxLanguages: string[];
}

const DEFAULT_SETTINGS: JustAnotherHotkeyPluginSettings = {
	disableTabIndentation: false,
	copyInlineCodeOnDoubleClick: false,
	useContextualCodeBlockLanguage: false,
	languageSearchLocation: 'noteName',
	codeBoxLanguages: [],
}

export default class JustAnotherHotkeyPlugin extends Plugin {
	settings: JustAnotherHotkeyPluginSettings;

	async onload() {
		await this.loadSettings();
		registerCommands(this); //! for hotkeys

		// for "Copy inline code on double click" setting
		this.registerDomEvent(document, 'dblclick', (evt: MouseEvent) => {
			if (!this.settings.copyInlineCodeOnDoubleClick) {
				return;
			}
			const target = evt.target as HTMLElement;
			const isInlineCode = target.classList.contains('cm-inline-code');
			if (isInlineCode) {
				const text = target.textContent;
				if (text) {
					navigator.clipboard.writeText(text).then(() => {
						new Notice('Code copied to clipboard');
					}).catch(err => {
						console.error('Failed to copy text: ', err);
						new Notice('Failed to copy code');
					});
				}
			}
		});

		//NOTE - Turn Off "Tab" key indentation, if the setting is turned on.
		const tabKeymap = Prec.highest(keymap.of([{
			key: 'Tab',
			run: (): boolean => {
				if (this.settings?.disableTabIndentation) {
					return true;
				}
				return false;
			}
		}]));
		this.registerEditorExtension([tabKeymap]);

		this.addSettingTab(new JustAnotherHotkeyPluginSettingTab(this.app, this));
	}

	onunload() {
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	//SECTION - Additional functions
	//NOTE - Additional function for "Move to Next Heading" and "Move to Previous Heading" commands. Scrolls the editor (moves on the screen) to the position of the heading.
	private scrollToPosition(editor: Editor, pos: CodeMirror.Position) {
		editor.setCursor(pos);
		editor.scrollIntoView({ from: pos, to: pos }, true);
	}

	//NOTE - Additional function for "Select to End of Current Heading" command. Returns the level of the heading at the provided line number.
	private getHeadingLevelAtLine(editor: Editor, line: number): number | null {
		const lineText = editor.getLine(line);
		const match = lineText.match(/^(#+)\s/);
		if (match) {
			return match[1].length;
		}
		return null;
	}

	//NOTE - Additional function for "Move to Next Heading" and "Move to Previous Heading" commands. Finds the next heading line in the specified direction (next or previous).
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

	//NOTE - Additional function for "Select to End of Current Heading" command. Selects the heading line from the current cursor position.
	private findLinkUnderCursor(editor: Editor): { lineText: string, match: RegExpExecArray, start: number, end: number } | null {
		const cursor = editor.getCursor();
		const lineText = editor.getLine(cursor.line);

		const linkRegex = /\[\[([^[\]]*(?:\[[^[\]]*\][^[\]]*)*)\]\]/g;
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

	//NOTE - Additional function for "Paste as Code Block" command. Finds the language of the code block based on the context (settings).
	private determineCodeLanguage(): string | null {

		if (!this.settings.useContextualCodeBlockLanguage) {
			return null;
		}

		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			return null;
		}

		const filePath = activeFile.path;
		const pathComponents = filePath.split('/');
		const fileName = pathComponents[pathComponents.length - 1];

		const findLanguageMatch = (text: string): string | null => {

			const lowerText = text.toLowerCase();

			for (const lang of this.settings.codeBoxLanguages) {
				const lowerLang = lang.toLowerCase();
				if (lowerText.includes(lowerLang)) {
					return lang;
				}
			}
			return null;
		};

		let foundLanguage: string | null = null;

		switch (this.settings.languageSearchLocation) {
			case 'noteName':
				foundLanguage = findLanguageMatch(fileName);
				break;

			case 'parentFolder':
				if (pathComponents.length > 1) {
					const parentFolder = pathComponents[pathComponents.length - 2];
					foundLanguage = findLanguageMatch(parentFolder);
				}
				break;

				case 'nearestToRootAncestorFolder':
					for (let i = 0; i < pathComponents.length - 1; i++) {
						foundLanguage = findLanguageMatch(pathComponents[i]);
						if (foundLanguage) {
							console.log(`Found language in ancestor folder: ${pathComponents[i]}`);
							break;
						}
					}
					break;

			case 'tags':
				// TODO
				console.log('todo');
				break;
		}
		return foundLanguage;
	}

	//!SECTION - Additional functions

	//SECTION - Heading commands
	//NOTE - Function of "Select to the End of Current Heading" command (CTRL + S).
	selectToEndOfCurrentHeading(editor: Editor) {
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
		editor.scrollIntoView({ from: toPos, to: toPos }, true);
	}

	//NOTE - Function of "Select to the Beginning of Current Heading" command (CTRL + SHIFT + S).
	selectToBeginningOfCurrentHeading(editor: Editor) {
		const cursor = editor.getCursor();
		const currentLineText = editor.getLine(cursor.line);
		const headingMatch = currentLineText.match(/^(#+)\s/);

		const toPos = cursor;
		let fromPos: CodeMirror.Position;

		if (headingMatch) {
			fromPos = {
				line: cursor.line,
				ch: 0,
			};
		} else {
			const currentHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');
			if (currentHeadingLine !== -1) {
				fromPos = {
					line: currentHeadingLine,
					ch: 0,
				};
			} else {
				fromPos = {
					line: 0,
					ch: 0,
				};
			}
		}

		editor.setSelection(fromPos, toPos);
	}

	//NOTE - Function of "Select Current Heading" command (CTRL + ALT + S).
	selectCurrentHeading(editor: Editor) {
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();

		let currentHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');
		if (currentHeadingLine === -1 || currentHeadingLine < cursor.line) {
			currentHeadingLine = cursor.line;
		}

		const currentHeadingLevel = this.getHeadingLevelAtLine(editor, currentHeadingLine);
		if (currentHeadingLevel === null) {
			currentHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');
		}

		let nextHeadingLine = this.findHeadingLine(editor, currentHeadingLine, 'next');
		if (nextHeadingLine === -1) nextHeadingLine = lineCount;

		const fromPos = { line: currentHeadingLine, ch: 0 };
		const toPos = {
			line: nextHeadingLine - 1,
			ch: editor.getLine(nextHeadingLine - 1).length,
		};

		editor.setSelection(fromPos, toPos);
		editor.scrollIntoView({ from: toPos, to: toPos }, true);
	}

	//NOTE - Function of "Select Current and Child Headings" command (CTRL + ALT + SHIFT + S).
	selectCurrentAndChildHeadings(editor: Editor) {
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();

		let currentHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');
		if (currentHeadingLine === -1 || currentHeadingLine < cursor.line) {
			currentHeadingLine = cursor.line;
		}

		const currentHeadingLevel = this.getHeadingLevelAtLine(editor, currentHeadingLine);
		if (currentHeadingLevel === null) {
			currentHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');
		}

		if (currentHeadingLine !== -1) {
			const currentHeadingLevel = this.getHeadingLevelAtLine(editor, currentHeadingLine);

			if (currentHeadingLevel !== null) {
				let nextHeadingLine = lineCount;
				for (let i = currentHeadingLine + 1; i < lineCount; i++) {
					const level = this.getHeadingLevelAtLine(editor, i);
					if (level !== null && level <= currentHeadingLevel) {
						nextHeadingLine = i;
						break;
					}
				}

				const fromPos = { line: currentHeadingLine, ch: 0 };
				const toPos = {
					line: nextHeadingLine - 1,
					ch: editor.getLine(nextHeadingLine - 1).length,
				};

				editor.setSelection(fromPos, toPos);
			} else {
				const fromPos = { line: 0, ch: 0 };
				const toPos = {
					line: lineCount - 1,
					ch: editor.getLine(lineCount - 1).length,
				};

				editor.setSelection(fromPos, toPos);
			}
		} else {
			const fromPos = { line: 0, ch: 0 };
			const toPos = {
				line: lineCount - 1,
				ch: editor.getLine(lineCount - 1).length,
			};

			editor.setSelection(fromPos, toPos);
			editor.scrollIntoView({ from: toPos, to: toPos }, true);
		}
	}

	//NOTE - Function of "Select All Current Level Headings" command (CTRL + ALT + PAGE DOWN).
	//TODO - Change hotkey
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
		editor.scrollIntoView({ from: toPos, to: toPos }, true);

		new Notice(`${headings.length} headings of level ${currentHeadingLevel} were selected.`);
	}

	//NOTE - Function of "Move to Next Heading Level 1-6" commands (CTRL + 1, CTRL + 2 ... CTRL + 6).
	moveToNextHeadingOfLevel(editor: Editor, level: number) {
		const cursor = editor.getCursor();
		const foundHeadingLine = this.findHeadingLine(editor, cursor.line, 'next', level);
		if (foundHeadingLine !== -1) {
			const lineText = editor.getLine(foundHeadingLine);
			const pos = { line: foundHeadingLine, ch: lineText.length };
			this.scrollToPosition(editor, pos);
		} else {
			const lineCount = editor.lineCount();
			const lastLine = lineCount - 1;
			const lastCh = editor.getLine(lastLine).length;
			const pos = { line: lastLine, ch: lastCh };
			this.scrollToPosition(editor, pos);
		}
	}

	//NOTE - Function of "Move to Previous Heading Level 1-6" commands (CTRL + SHIFT + 1, CTRL + SHIFT + 2 ... CTRL + SHIFT + 6).
	moveToPreviousHeadingOfLevel(editor: Editor, level: number) {
		const cursor = editor.getCursor();
		const foundHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous', level);

		if (foundHeadingLine !== -1) {
			const lineText = editor.getLine(foundHeadingLine);
			editor.setCursor({ line: foundHeadingLine, ch: lineText.length });
		} else {
			editor.setCursor({ line: 0, ch: 0 });
		}
	}

	//NOTE - Function of "Move to Next Heading" command (ALT + PAGE DOWN).
	moveCursorToNextHeading(editor: Editor) {
		const cursor = editor.getCursor();
		const foundHeadingLine = this.findHeadingLine(editor, cursor.line, 'next');
		if (foundHeadingLine !== -1) {
			const pos = { line: foundHeadingLine, ch: 0 };
			this.scrollToPosition(editor, pos);
		} else {
			const lineCount = editor.lineCount();
			const lastLine = lineCount - 1;
			const lastCh = editor.getLine(lastLine).length;
			const pos = { line: lastLine, ch: lastCh };
			this.scrollToPosition(editor, pos);
		}
	}

	//NOTE - Function of "Move to Previous Heading" command (ALT + PAGE UP).
	moveCursorToPreviousHeading(editor: Editor) {
		const cursor = editor.getCursor();
		const foundHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');

		if (foundHeadingLine !== -1) {
			editor.setCursor({ line: foundHeadingLine, ch: 0 });
		} else {
			editor.setCursor({ line: 0, ch: 0 });
		}
	}

	//!SECTION - Heading commands


	//NOTE - Function of "Select Link Display Text" command (CTRL + ALT + L).
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

			const beforeLink = lineText.substring(0, start);
			const afterLink = lineText.substring(end);
			const newLink = `[[${newLinkContent}]]`;
			editor.transaction({
				changes: [{
					from: { line: cursor.line, ch: 0 },
					to: { line: cursor.line, ch: lineText.length },
					text: beforeLink + newLink + afterLink
				}]
			});
			const newCursorPos = {
				line: cursor.line,
				ch: start + 2 + linkContent.length + 1
			};
			editor.setCursor(newCursorPos);
		}
	}

	//NOTE - Function of "Select Link Without Display Text" command (CTRL + \).
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

	//NOTE - Function of "Select Link Content" command (CTRL + ALT + \).
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

	//NOTE - Function of "Select Full Link" command (CTRL + SHIFT + ALT + \).
	selectFullLink(editor: Editor) {
		const result = this.findLinkUnderCursor(editor);
		if (!result) {
			new Notice('Cursor is not inside or near a link.');
			return;
		}

		const { start, end } = result;
		const cursor = editor.getCursor();

		const fromPos = {
			line: cursor.line,
			ch: start,
		};
		const toPos = {
			line: cursor.line,
			ch: end,
		};
		editor.setSelection(fromPos, toPos);
	}

	//NOTE - Function of "Paste as Code Block" command (CTRL + SHIFT + V).
	async pasteAsCodeBlock(editor: Editor) {
		try {
			const clipboardText = await navigator.clipboard.readText();
			if (clipboardText) {
				const cursor = editor.getCursor();

				const language = this.determineCodeLanguage();
				const codeBlock = '```' + (language || '') + '\n' + clipboardText + '\n```\n';

				editor.replaceRange(codeBlock, cursor);

				const newPos = {
					line: cursor.line + clipboardText.split('\n').length + 2,
					ch: 0
				};
				editor.setCursor(newPos);
			}
		} catch (err) {
			console.error('Failed to paste text: ', err);
		}
	}
}