/* eslint-disable @typescript-eslint/no-empty-interface */
import { Editor, Notice, Plugin } from 'obsidian';
import { registerCommands } from './hotkeys';
import { keymap } from '@codemirror/view';
import { Prec } from '@codemirror/state';
//Imports of other files of the plugin
import { JustAnotherHotkeyPluginSettingTab } from './settings';
import { CopyContentFeature } from './features/copyContentFeature';
import { TagSuggestModal } from './ui/modals/tagSuggestModal';

//ANCHOR - Settings Interface - We use it to use values from the settings tab in code.
interface JustAnotherHotkeyPluginSettings {
	/** When enabled, pressing TAB key will not indent the current line */
	disableTabIndentation: boolean;
	/** When enabled, double-clicking on inline code blocks will copy their content */
	copyInlineCodeOnDoubleClick: boolean;
	/** Automatically determine code block language based on context */
	useContextualCodeBlockLanguage: boolean;
	/** Determines where to search for language code: note name, parent folder, nearest ancestor folder, or tags */
	languageSearchLocation: 'noteName' | 'parentFolder' | 'nearestToRootAncestorFolder' | 'tags';
	/** Custom list of programming languages with priority order */
	codeBoxLanguages: string[];
	/** When enabled, adds a button to copy content from the editor */
	copyContentFeature: boolean;
}

//ANCHOR - Default Settings - Write the default values for the settings here.
const DEFAULT_SETTINGS: JustAnotherHotkeyPluginSettings = {
	disableTabIndentation: false,
	copyInlineCodeOnDoubleClick: false,
	useContextualCodeBlockLanguage: false,
	languageSearchLocation: 'noteName',
	codeBoxLanguages: [],
	copyContentFeature: true,
}


export default class JustAnotherHotkeyPlugin extends Plugin {

	settings: JustAnotherHotkeyPluginSettings;
	copyContentFeature: CopyContentFeature | null = null;

	/**
	 * Loads the settings and registers commands.
	 */
	async onload() {
		await this.loadSettings();
		console.log('Settings loaded:', this.settings);
		registerCommands(this); //! for hotkeys

		/**
		 * Registers a double-click event handler to copy inline code content.
		 * Uses the {@link handleInlineCodeDoubleClick} function.
		 */
		this.registerDomEvent(document, 'dblclick', this.handleInlineCodeDoubleClick.bind(this));

		/**
		 * Registers an editor extension to handle the Tab key if setting is enabled.
		 * Uses the {@link handleTabKey} function.
		 */
		const tabKeymap = Prec.highest(keymap.of([{
			key: 'Tab',
			run: this.handleTabKey.bind(this)
		}]));
		this.registerEditorExtension([tabKeymap]);

		/**
		 * Initializes the CopyContentFeature if the copyContentFeature setting is enabled.
		 * Creates a button to copy content from the editor.
		 */
		if (this.settings.copyContentFeature) {
			this.copyContentFeature = new CopyContentFeature(this.app, this);
			this.copyContentFeature.initialize();
		}

		this.addSettingTab(new JustAnotherHotkeyPluginSettingTab(this.app, this));

		//NOTE - Handles editor state changes to keep copy buttons visibility and position.  Without it, copy buttons would be static and misaligned with content.
		this.registerEvent(
			this.app.workspace.on('editor-change', () => {
				if (this.settings.copyContentFeature) {
					if (!this.copyContentFeature) {
						this.copyContentFeature = new CopyContentFeature(this.app, this);
					}
					this.copyContentFeature.initialize();
				} else {
					this.copyContentFeature = null; // Cleanup if feature is disabled
				}
			})
		);

		// Register command for copying notes by tag
		this.registerCopyNotesByTagCommand();
	}

	/**
	 * Unloads the plugin.
	 */
	onunload() {
		//Removes the copy content button
		if (this.copyContentFeature) {
			this.copyContentFeature.cleanup();
		}
	}

	/**
	 * Loads the settings from the storage.
	 */
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	/**
	 * Saves settings to the storage.
	 * Happens when the settings are changed in the settings tab.
	 */
	async saveSettings() {
		await this.saveData(this.settings);
	}

	//SECTION - Event Handlers
	/**
	 * NOTE - Handler for double-click event.
	 * Handles the double-click event on the document.
	 * If the target is inline code and the setting is enabled, copies the content.
	 */
	private handleInlineCodeDoubleClick(evt: MouseEvent): void {
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
	}

	/**
	 * NOTE - Handler for Tab key.
	 * Handles the Tab key press event.
	 * Disables default Tab indentation if the setting is enabled.
	 * @returns true (stops further processing) if disableTabIndentation is enabled
	 * @returns false (allows normal Tab behavior) if disableTabIndentation is disabled
	 */
	private handleTabKey(): boolean {
		if (this.settings?.disableTabIndentation) {
			return true; // Prevent default Tab behavior
		}
		return false; // Allow default Tab behavior
	}
	//!SECTION - Event Handlers

	//SECTION - Register commands
	/**
	 * NOTE - Registers command for copying notes by tag
	 * Creates a command that allows users to select a tag and copy content from all notes with that tag
	 * @private
	 */
	private registerCopyNotesByTagCommand(): void {
		this.addCommand({
			id: 'copy-notes-by-tag',
			name: '[Copy all notes with tag…]',
			checkCallback: (checking: boolean) => {
				// Command only available if feature is enabled
				if (!this.settings.copyContentFeature) return false;
				if (!checking) {
					// Collect all tags from all markdown files
					const files = this.app.vault.getMarkdownFiles();
					const tagSet = new Set<string>();

					for (const file of files) {
						const cache = this.app.metadataCache.getFileCache(file);
						if (!cache) continue;

						// Collect tags from note body (tags in metadataCache)
						if (cache.tags) {
							for (const tagObj of cache.tags) {
								tagSet.add(tagObj.tag);
							}
						}

						// Collect tags from frontmatter (properties)
						if (cache.frontmatter) {
							// Tags in frontmatter can be in 'tags' field (array) or 'tag' field (string)
							const frontmatterTags = cache.frontmatter.tags || cache.frontmatter.tag;

							if (frontmatterTags) {
								// Process array of tags
								if (Array.isArray(frontmatterTags)) {
									for (const tag of frontmatterTags) {
										// Add # if missing
										const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
										tagSet.add(formattedTag);
									}
								}
								// Process single tag (string)
								else if (typeof frontmatterTags === 'string') {
									const formattedTag = frontmatterTags.startsWith('#')
										? frontmatterTags
										: `#${frontmatterTags}`;
									tagSet.add(formattedTag);
								}
							}
						}
					}

					const tags = Array.from(tagSet).sort();
					console.log('Available tags:', tags);

					// Show tag selection modal
					if (tags.length > 0) {
						new TagSuggestModal(this.app, tags, async (selectedTag) => {
							// Find all related tags (parent tag and its subtags)
							const relatedTags = this.findRelatedTags(selectedTag, tags);
							console.log('Selected tag and related subtags:', relatedTags);

							// Get all files with the selected tag or any of its subtags
							const filesWithTag = files.filter(file => {
								const cache = this.app.metadataCache.getFileCache(file);
								if (!cache) return false;

								// Check if file has any of the related tags (selected tag or its subtags)
								for (const tagToFind of relatedTags) {
									// Check tags in note body
									if (cache.tags && cache.tags.some(tagObj => tagObj.tag === tagToFind)) {
										return true;
									}

									// Check tags in frontmatter (properties)
									if (cache.frontmatter) {
										const frontmatterTags = cache.frontmatter.tags || cache.frontmatter.tag;

										if (frontmatterTags) {
											// For array of tags
											if (Array.isArray(frontmatterTags)) {
												// Remove # from tag for comparison
												const plainTag = tagToFind.startsWith('#')
													? tagToFind.substring(1)
													: tagToFind;

												if (frontmatterTags.some(tag =>
													tag === plainTag || tag === tagToFind)) {
													return true;
												}
											}
											// For single tag (string)
											else if (typeof frontmatterTags === 'string') {
												const plainTag = tagToFind.startsWith('#')
													? tagToFind.substring(1)
													: tagToFind;

												if (frontmatterTags === plainTag || frontmatterTags === tagToFind) {
													return true;
												}
											}
										}
									}
								}

								return false;
							});

							if (filesWithTag.length > 0) {
								// Use CopyContentFeature to copy content
								if (this.copyContentFeature) {
									try {
										const content = await this.copyContentFeature.copyFiles(filesWithTag);
										if (content) {
											await navigator.clipboard.writeText(content);
											if (relatedTags.length > 1) {
												new Notice(`Content from ${filesWithTag.length} files with tag ${selectedTag} and its subtags copied to clipboard!`);
											} else {
												new Notice(`Content from ${filesWithTag.length} files with tag ${selectedTag} copied to clipboard!`);
											}
										} else {
											new Notice('No content to copy');
										}
									} catch (error) {
										console.error('Error copying content:', error);
										new Notice('Error copying content');
									}
								}
							} else {
								if (relatedTags.length > 1) {
									new Notice(`No files found with tag ${selectedTag} or its subtags`);
								} else {
									new Notice(`No files found with tag ${selectedTag}`);
								}
							}
						}).open();
					} else {
						new Notice('No tags found in any files');
					}
				}
				return true;
			}
		});
	}


	//!SECTION - Register commands

	//SECTION - Additional functions
	/**
	 * NOTE -Additional function for "Move to Next Heading" and "Move to Previous Heading" commands.
	 * Scrolls the editor (moves on the screen) to the position of the heading.
	 * @param editor - The editor to scroll.
	 * @param pos - The position to scroll to.
	 */
	private scrollToPosition(editor: Editor, pos: CodeMirror.Position) {
		editor.setCursor(pos);
		editor.scrollIntoView({ from: pos, to: pos }, true);
	}

	/**
	 * NOTE - Additional function for "Select to End of Current Heading" command.
	 * Used to get the level of the heading at the provided line number.
	 * @param editor - The editor to get the heading level from.
	 * @param line - The line number to get the heading level from.
	 * @returns The level of the heading at the provided line number.
	 */
	private getHeadingLevelAtLine(editor: Editor, line: number): number | null {
		const lineText = editor.getLine(line);
		const match = lineText.match(/^(#+)\s/);
		if (match) {
			return match[1].length;
		}
		return null;
	}

	/**
	 * NOTE - Additional function for "Move to Next Heading" and "Move to Previous Heading" commands.
	 * Finds the next heading line in the specified direction (next or previous).
	 * @param editor - The editor to find the heading line in.
	 * @param startLine - The line number to start the search from.
	 * @param direction - The direction to search in (next or previous).
	 * @param level - The level of the heading to search for.
	 * @returns The line number of the next heading line.
	 */
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

	/**
	 * NOTE - Additional function for Link commands. Finds the link under the cursor.
	 * @param editor - The editor to find the link under the cursor from.
	 * @returns The line text, match, start, and end of the link under the cursor.
	 */
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

	/**
	 * NOTE - Additional function for "Paste as Code Block" command. Finds the language of the code block based on the context (settings).
	 * @returns The language of the code block.
	 */
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
				// TODO - Implement this
				console.log('todo');
				break;
		}
		return foundLanguage;
	}

	/**
		 * NOTE - Additional function for "Copy all notes with tag..." command.
		 * Finds all related tags (the parent tag and all its subtags)
		 * @param parentTag - The selected parent tag
		 * @param allTags - All available tags in the vault
		 * @returns Array containing the parent tag and all its subtags
		 */
	private findRelatedTags(parentTag: string, allTags: string[]): string[] {
		// The base tag without the # symbol
		const cleanParentTag = parentTag.startsWith('#') ? parentTag.substring(1) : parentTag;

		// Always include the selected tag itself
		const result = [parentTag];

		// Find all subtags (tags that start with parent tag followed by /)
		for (const tag of allTags) {
			// Skip if it's the parent tag itself
			if (tag === parentTag) continue;

			const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag;

			// Check if this is a subtag of the parent tag
			if (cleanTag.startsWith(cleanParentTag + '/')) {
				result.push(tag);
			}
		}

		return result;
	}

	//!SECTION - Additional functions

	//SECTION - Heading commands
	/**
	 * NOTE - Function of "Select to the End of Current Heading" command (CTRL + S).
	 * @summary Selects text from the current position to the end of the current heading (to the next heading).
	 * Uses the {@link findHeadingLine} function to find the next heading.
	 * @see {@link registerCommands} id: 'select-to-end-of-heading'
	 * @param editor - The editor to make changes in.
	 */
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

	/**
	 * NOTE - Function of "Select to the Beginning of Current Heading" command (CTRL + SHIFT + S).
	 * @summary Selects text from the current position to the beginning of the current heading (to the previous heading).
	 * Uses the {@link findHeadingLine} function to find the previous heading.
	 * @see {@link registerCommands} id: 'select-to-beginning-of-heading'
	 * @param editor - The editor to make changes in.
	 */
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

	/**
	 * NOTE - Function of "Select Current Heading" command (CTRL + ALT + S).
	 * @summary Selects the entire current heading section.
	 * Uses the {@link findHeadingLine} function to find the current heading.
	 * Uses the {@link getHeadingLevelAtLine} function to get the heading level.
	 * @see {@link registerCommands} id: 'select-current-heading'
	 * @param editor - The editor to make changes in.
	 */
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

	/**
	 * NOTE - Function of "Select Current and Child Headings" command (CTRL + ALT + SHIFT + S).
	 * @summary Selects the current heading and all its child headings.
	 * Uses the {@link findHeadingLine} function to find the current heading.
	 * Uses the {@link getHeadingLevelAtLine} function to get the heading level.
	 * @see {@link registerCommands} id: 'select-current-and-child-headings'
	 * @param editor - The editor to make changes in.
	 */
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

	/**
	 * NOTE - Function of "Select All Current Level Headings" command (CTRL + ALT + PAGE DOWN).
	 * @summary Selects all headings of the current level.
	 * Uses the {@link getHeadingLevelAtLine} function to get the heading level.
	 * @see {@link registerCommands} id: 'select-all-current-level-headings'
	 * @param editor - The editor to make changes in.
	 */
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


	/**
	 * NOTE - Function of "Move to Next Heading Level 1-6" commands (CTRL + 1, CTRL + 2 ... CTRL + 6).
	 * @summary Moves the cursor to the next heading of the specified level.
	 * Uses the {@link findHeadingLine} function to find the next heading of the specified level.
	 * Uses the {@link scrollToPosition} function to scroll to the position of the heading.
	 * @see {@link registerCommands} id: 'move-to-next-heading-level-1-6'
	 * @param editor - The editor to make changes in.
	 * @param level - The level of the heading to move to.
	 */
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

	/**
	 * NOTE - Function of "Move to Previous Heading Level 1-6" commands (CTRL + SHIFT + 1, CTRL + SHIFT + 2 ... CTRL + SHIFT + 6).
	 * @summary Moves the cursor to the previous heading of the specified level.
	 * Uses the {@link findHeadingLine} function to find the previous heading of the specified level.
	 * Uses the {@link scrollToPosition} function to scroll to the position of the heading.
	 * @see {@link registerCommands} id: 'move-to-previous-heading-level-1-6'
	 * @param editor - The editor to make changes in.
	 * @param level - The level of the heading to move to.
	 */
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

	/**
	 * NOTE - Function of "Move to Next Heading" command (ALT + PAGE DOWN).
	 * @summary Moves the cursor to the next heading.
	 * Uses the {@link findHeadingLine} function to find the next heading.
	 * Uses the {@link scrollToPosition} function to scroll to the position of the heading.
	 * @see {@link registerCommands} id: 'move-cursor-to-next-heading'
	 * @param editor - The editor to make changes in.
	 */
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

	/**
	 * NOTE - Function of "Move to Previous Heading" command (ALT + PAGE UP).
	 * @summary Moves the cursor to the previous heading.
	 * Uses the {@link findHeadingLine} function to find the previous heading.
	 * Uses the {@link scrollToPosition} function to scroll to the position of the heading.
	 * @see {@link registerCommands} id: 'move-cursor-to-previous-heading'
	 * @param editor - The editor to make changes in.
	 */
	moveCursorToPreviousHeading(editor: Editor) {
		const cursor = editor.getCursor();
		const foundHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');

		if (foundHeadingLine !== -1) {
			editor.setCursor({ line: foundHeadingLine, ch: 0 });
		} else {
			editor.setCursor({ line: 0, ch: 0 });
		}
	}

	/**
	 * NOTE - Function of "Move Heading (with content) Up" command (Alt + PageUp).
	 * @summary Moves entire heading section (including content) up, swapping with the heading above.
	 * Uses the {@link findHeadingLine} function to find the current heading.
	 * Uses the {@link getHeadingLevelAtLine} function to get the level of the current heading.
	 * Uses the {@link scrollToPosition} function to scroll to the position of the heading.
	 * @see {@link registerCommands} id: 'move-heading-up'
	 * @param editor - The editor to make changes in.
	 * @since 1.0.11
	 */
	moveHeadingUp(editor: Editor) {
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();

		// Find current heading and its level
		let currentHeadingLine = cursor.line;
		let currentHeadingLevel = this.getHeadingLevelAtLine(editor, currentHeadingLine);
		const originalCursorLine = cursor.line;

		// If cursor is not on a heading, find the previous heading
		if (currentHeadingLevel === null) {
			currentHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');
			if (currentHeadingLine === -1) {
				new Notice('No heading found above cursor');
				return;
			}
			currentHeadingLevel = this.getHeadingLevelAtLine(editor, currentHeadingLine);
		}

		// Find the end of current heading's content (including subheadings)
		let currentBlockEnd = currentHeadingLine + 1;
		if (currentHeadingLevel !== null) {
			while (currentBlockEnd < lineCount) {
				const level = this.getHeadingLevelAtLine(editor, currentBlockEnd);
				if (level !== null && level <= currentHeadingLevel) {
					break;
				}
				currentBlockEnd++;
			}
		}

		// Find the target (previous) heading to swap with
		let targetHeadingLine = currentHeadingLine - 1;
		while (targetHeadingLine >= 0) {
			const level = this.getHeadingLevelAtLine(editor, targetHeadingLine);
			if (level !== null) {
				break;
			}
			targetHeadingLine--;
		}

		if (targetHeadingLine < 0) {
			new Notice('Already at the top');
			return;
		}

		// Find the end of target heading's content
		const targetHeadingLevel = this.getHeadingLevelAtLine(editor, targetHeadingLine);
		if (targetHeadingLevel === null) {
			return;
		}
		let targetBlockEnd = targetHeadingLine + 1;
		while (targetBlockEnd < currentHeadingLine) {
			const level = this.getHeadingLevelAtLine(editor, targetBlockEnd);
			if (level !== null && level <= targetHeadingLevel) {
				break;
			}
			targetBlockEnd++;
		}

		// Find the heading above target for notice
		let aboveHeadingLine = targetHeadingLine - 1;
		while (aboveHeadingLine >= 0) {
			const level = this.getHeadingLevelAtLine(editor, aboveHeadingLine);
			if (level !== null) {
				break;
			}
			aboveHeadingLine--;
		}

		// Prepare heading texts for notice
		const currentHeadingText = editor.getLine(currentHeadingLine).replace(/^#+\s+/, '');
		const targetHeadingText = editor.getLine(targetHeadingLine).replace(/^#+\s+/, '');
		const aboveHeadingText = aboveHeadingLine >= 0 ?
			editor.getLine(aboveHeadingLine).replace(/^#+\s+/, '') : 'document start';

		// Calculate cursor offset from the start of the current block
		const cursorOffset = {
			lines: originalCursorLine - currentHeadingLine,
			ch: cursor.ch
		};

		// Get content blocks with proper line endings
		const currentBlock = editor.getRange(
			{ line: currentHeadingLine, ch: 0 },
			{ line: currentBlockEnd - 1, ch: editor.getLine(currentBlockEnd - 1).length }
		);

		const targetBlock = editor.getRange(
			{ line: targetHeadingLine, ch: 0 },
			{ line: targetBlockEnd - 1, ch: editor.getLine(targetBlockEnd - 1).length }
		);

		// Ensure proper line endings
		const currentBlockWithEnding = currentBlock.endsWith('\n') ? currentBlock : currentBlock + '\n';
		const targetBlockWithEnding = targetBlock.endsWith('\n') ? targetBlock : targetBlock + '\n';

		// Store the current block's line count
		const currentBlockLines = currentBlockWithEnding.split('\n').length - 1;

		// Perform the swap
		editor.replaceRange(
			'',
			{ line: targetHeadingLine, ch: 0 },
			{ line: currentBlockEnd, ch: 0 }
		);

		editor.replaceRange(
			currentBlockWithEnding + targetBlockWithEnding,
			{ line: targetHeadingLine, ch: 0 }
		);

		// Calculate new cursor position
		const newLine = targetHeadingLine + cursorOffset.lines;
		const newPosition = {
			line: Math.min(newLine, targetHeadingLine + currentBlockLines - 1),
			ch: cursorOffset.ch
		};

		// Restore cursor position
		editor.setCursor(newPosition);
		editor.scrollIntoView({ from: newPosition, to: newPosition }, true);

		// Show detailed notice
		new Notice(`Heading "${currentHeadingText}" moved above. Now located below "${aboveHeadingText}" and above "${targetHeadingText}"`);
	}

	/**
	 * NOTE - Function of "Move Heading (with content) Down" command (Alt + PageDown).
	 * @summary Moves entire heading section (including content) down, swapping with the heading below.
	 * Uses the {@link findHeadingLine} function to find the current heading.
	 * Uses the {@link getHeadingLevelAtLine} function to get the level of the current heading.
	 * Uses the {@link scrollToPosition} function to scroll to the position of the heading.
	 * @see {@link registerCommands} id: 'move-heading-down'
	 * @param editor - The editor to make changes in.
	 * @since 1.0.11
	 */
	moveHeadingDown(editor: Editor) {
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();

		// Find current heading and its level
		let currentHeadingLine = cursor.line;
		let currentHeadingLevel = this.getHeadingLevelAtLine(editor, currentHeadingLine);
		const originalCursorLine = cursor.line;

		// If cursor is not on a heading, find the previous heading
		if (currentHeadingLevel === null) {
			currentHeadingLine = this.findHeadingLine(editor, cursor.line, 'previous');
			if (currentHeadingLine === -1) {
				new Notice('No heading found above cursor');
				return;
			}
			currentHeadingLevel = this.getHeadingLevelAtLine(editor, currentHeadingLine);
		}

		// Find the end of current heading's content (including subheadings)
		let currentBlockEnd = currentHeadingLine + 1;
		if (currentHeadingLevel !== null) {
			while (currentBlockEnd < lineCount) {
				const level = this.getHeadingLevelAtLine(editor, currentBlockEnd);
				if (level !== null && level <= currentHeadingLevel) {
					break;
				}
				currentBlockEnd++;
			}
		}

		// Find the target (next) heading to swap with
		const targetHeadingLine = currentBlockEnd;
		if (targetHeadingLine >= lineCount) {
			new Notice('Already at the bottom');
			return;
		}

		// Find the end of target heading's content
		const targetHeadingLevel = this.getHeadingLevelAtLine(editor, targetHeadingLine);
		if (targetHeadingLevel === null) {
			return;
		}
		let targetBlockEnd = targetHeadingLine + 1;
		while (targetBlockEnd < lineCount) {
			const level = this.getHeadingLevelAtLine(editor, targetBlockEnd);
			if (level !== null && level <= targetHeadingLevel) {
				break;
			}
			targetBlockEnd++;
		}

		// Find the heading below target for notice
		let belowHeadingLine = targetBlockEnd;
		while (belowHeadingLine < lineCount) {
			const level = this.getHeadingLevelAtLine(editor, belowHeadingLine);
			if (level !== null) {
				break;
			}
			belowHeadingLine++;
		}

		// Prepare heading texts for notice
		const currentHeadingText = editor.getLine(currentHeadingLine).replace(/^#+\s+/, '');
		const targetHeadingText = editor.getLine(targetHeadingLine).replace(/^#+\s+/, '');
		const belowHeadingText = belowHeadingLine < lineCount ?
			editor.getLine(belowHeadingLine).replace(/^#+\s+/, '') : 'document end';

		// Calculate cursor offset from the start of the current block
		const cursorOffset = {
			lines: originalCursorLine - currentHeadingLine,
			ch: cursor.ch
		};

		// Get content blocks with proper line endings
		const currentBlock = editor.getRange(
			{ line: currentHeadingLine, ch: 0 },
			{ line: currentBlockEnd - 1, ch: editor.getLine(currentBlockEnd - 1).length }
		);

		const targetBlock = editor.getRange(
			{ line: targetHeadingLine, ch: 0 },
			{ line: targetBlockEnd - 1, ch: editor.getLine(targetBlockEnd - 1).length }
		);

		// Ensure proper line endings
		const currentBlockWithEnding = currentBlock.endsWith('\n') ? currentBlock : currentBlock + '\n';
		const targetBlockWithEnding = targetBlock.endsWith('\n') ? targetBlock : targetBlock + '\n';

		// Store blocks' line counts
		const targetBlockLines = targetBlockWithEnding.split('\n').length - 1;
		const currentBlockLines = currentBlockWithEnding.split('\n').length - 1;

		// Perform the swap
		editor.replaceRange(
			'',
			{ line: currentHeadingLine, ch: 0 },
			{ line: targetBlockEnd, ch: 0 }
		);

		editor.replaceRange(
			targetBlockWithEnding + currentBlockWithEnding,
			{ line: currentHeadingLine, ch: 0 }
		);

		// Calculate new cursor position
		const newLine = currentHeadingLine + targetBlockLines + cursorOffset.lines;
		const newPosition = {
			line: Math.min(newLine, currentHeadingLine + targetBlockLines + currentBlockLines - 1),
			ch: cursorOffset.ch
		};

		// Restore cursor position
		editor.setCursor(newPosition);
		editor.scrollIntoView({ from: newPosition, to: newPosition }, true);

		// Show detailed notice
		new Notice(`Heading "${currentHeadingText}" moved below. Now located below "${targetHeadingText}" and above "${belowHeadingText}"`);
	}

	//!SECTION - Heading commands

	//SECTION - Link commands
	/**
	 * NOTE - Function of "Select Link Display Text" command (Mod + \).
	 * @summary Selects the display text of an internal link (the text after `|`), if present. If not present, adds `|` and places the cursor after it for typing
	 * Uses the {@link findLinkUnderCursor} function to find the link under the cursor.
	 * @see {@link registerCommands} id: 'select-link-display-text'
	 * @param editor - The editor to make changes in.
	 */
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

	/**
	 * NOTE - Function of "Select Link Without Display Text" command (CTRL + \).
	 * @summary Selects the text before `|` in an internal link, or the entire internal link if `|` is absent.
	 * Uses the {@link findLinkUnderCursor} function to find the link under the cursor.
	 * @see {@link registerCommands} id: 'select-link-without-display-text'
	 * @param editor - The editor to make changes in.
	 */
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

	/**
	 * NOTE - Function of "Select Link Content" command (CTRL + ALT + \).
	 * @summary Selects the content of the internal link, excluding the surrounding brackets.
	 * Uses the {@link findLinkUnderCursor} function to find the link under the cursor.
	 * @see {@link registerCommands} id: 'select-link-content'
	 * @param editor - The editor to make changes in.
	 */
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

	/**
	 * NOTE - Function of "Select Full Link" command (CTRL + SHIFT + ALT + \).
	 * @summary Selects the entire internal link, including the surrounding brackets.
	 * @see {@link registerCommands} id: 'select-full-link'
	 * @param editor - The editor to make changes in.
	 */
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

	//!SECTION - Link commands

	/**
	 * NOTE - Function of "Paste as Code Block" command (CTRL + ALT + V).
	 * @summary Pastes clipboard content as a code block, automatically determining the language based on settings.
	 * Uses the {@link determineCodeLanguage} function to determine the language.
	 * @see {@link registerCommands} id: 'paste-as-code-block'
	 * @param editor - The editor to make changes in.
	 * @since 1.0.9
	 */
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

	/**
	 * NOTE - Function of "Select Current Line" command (CTRL + L).
	 * @summary Selects the entire logical line of text. Can be repeated for selecting next lines.
	 * @see {@link registerCommands} id: 'select-current-line'
	 * @param editor - The editor to make changes in.
	 * @since 1.0.10
	 */
	selectCurrentLine(editor: Editor) {
		const selection = editor.getSelection();
		const cursor = editor.getCursor();
		const lineCount = editor.lineCount();

		// Check if there is a selection
		if (selection.length > 0) {
			const currentSelection = editor.listSelections()[0];
			const lastSelectedLine = currentSelection.head.line;

			// If the last selected line is not the last line of the editor
			if (lastSelectedLine < lineCount - 1) {
				const fromPos = currentSelection.anchor;
				const nextLine = lastSelectedLine + 1;
				const nextLineLength = editor.getLine(nextLine).length;
				const toPos = { line: nextLine, ch: nextLineLength };

				editor.setSelection(fromPos, toPos);
				editor.scrollIntoView({ from: toPos, to: toPos }, true);
			}
		} else {
			// If there is no selection, select the current line
			const lineText = editor.getLine(cursor.line);
			const fromPos = { line: cursor.line, ch: 0 };
			const toPos = { line: cursor.line, ch: lineText.length };
			editor.setSelection(fromPos, toPos);
		}
	}

	/**
	 * NOTE - Function of "Select Previous Line" command (CTRL + SHIFT + L).
	 * @summary Selects previous line of text. Can be repeated for previous lines.
	 * @see {@link registerCommands} id: 'select-previous-line'
	 * @param editor - The editor to make changes in.
	 * @since 1.0.11
	 */
	selectPreviousLine(editor: Editor) {
		const selection = editor.getSelection();
		const cursor = editor.getCursor();

		// Check if there is a selection
		if (selection.length > 0) {
			const currentSelection = editor.listSelections()[0];
			const firstSelectedLine = currentSelection.anchor.line;

			// If the first selected line is not the first line of the editor
			if (firstSelectedLine > 0) {
				const toPos = currentSelection.head;
				const prevLine = firstSelectedLine - 1;
				const fromPos = { line: prevLine, ch: 0 };

				editor.setSelection(fromPos, toPos);
			}
		} else {
			// If there is no selection and not on the first line
			if (cursor.line > 0) {
				const prevLine = cursor.line - 1;
				const lineText = editor.getLine(prevLine);
				const fromPos = { line: prevLine, ch: 0 };
				const toPos = { line: prevLine, ch: lineText.length };

				editor.setSelection(fromPos, toPos);
			}
		}
	}

	/**
	 * NOTE - Function of "Clear Selection from Current Line" command (CTRL + ALT + L).
	 * @summary Clears selection from the current logical line of text.
	 * @see {@link registerCommands} id: 'clear-selection-from-current-line'
	 * @param editor - The editor to make changes in.
	 * @since 1.0.10
	 */
	clearSelectionFromCurrentLine(editor: Editor) {
		const selection = editor.getSelection();

		// If there's no selection, do nothing
		if (selection.length === 0) {
			return;
		}

		const currentSelection = editor.listSelections()[0];
		const startLine = currentSelection.anchor.line;
		const endLine = currentSelection.head.line;

		// If selection spans multiple lines
		if (startLine !== endLine) {
			// Get the start of the current logical line
			const currentLineStart = {
				line: startLine,
				ch: 0
			};

			// Set selection to exclude the current logical line
			editor.setSelection(
				currentLineStart,
				{ line: endLine - 1, ch: editor.getLine(endLine - 1).length }
			);
		} else {
			// If only one line is selected, clear selection
			editor.setCursor({ line: startLine, ch: 0 });
		}
	}

	/**
	 * NOTE - Function of "Select to Line Start" command (CTRL + SHIFT + <).
	 * @summary Selects text from cursor position to the start of line. Ignores list markers.
	 * @see {@link registerCommands} id: 'select-to-line-start'
	 * @param editor - The editor to make changes in.
	 * @since 1.0.10
	 */
	selectToLineStart(editor: Editor) {
		const cursor = editor.getCursor();
		const lineText = editor.getLine(cursor.line);

		// Check for list markers using regex
		const listMatch = lineText.match(/^[\s]*([-+*]|\d+\.)[\s]+(\[[\s|x]\][\s]+)?/);

		// If list marker is found, select from the marker
		const fromPos = {
			line: cursor.line,
			ch: listMatch ? listMatch[0].length : 0
		};

		editor.setSelection(fromPos, cursor);
	}

	/**
	 * NOTE - Function of "Select to Line End" command (CTRL + SHIFT + >).
	 * @summary Selects text from cursor position to the end of line.
	 * @see {@link registerCommands} id: 'select-to-line-end'
	 * @param editor - The editor to make changes in.
	 * @since 1.0.10
	 */
	selectToLineEnd(editor: Editor) {
		const cursor = editor.getCursor();
		const lineLength = editor.getLine(cursor.line).length;
		const toPos = { line: cursor.line, ch: lineLength };
		editor.setSelection(cursor, toPos);
		editor.scrollIntoView({ from: toPos, to: toPos }, true);
	}

}