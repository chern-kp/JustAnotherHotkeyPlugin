import { App, PluginSettingTab, Setting } from 'obsidian';
import JustAnotherHotkeyPlugin from './main';
import { CopyContentFeature } from './features/copyContentFeature';

export class JustAnotherHotkeyPluginSettingTab extends PluginSettingTab {
    plugin: JustAnotherHotkeyPlugin;


    constructor(app: App, plugin: JustAnotherHotkeyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        //NOTE - New Settings Added Here

        new Setting(containerEl)
            .setName('Turn off TAB key indentation')
            .setDesc('When enabled, pressing the TAB key will not indent the current line. Useful if TAB is used for navigation or other hotkeys.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.disableTabIndentation)
                .onChange(async (value) => {
                    this.plugin.settings.disableTabIndentation = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Copy inline code on double click')
            .setDesc('Double-click any inline code (e.g., `code`) to instantly copy its text to the clipboard.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.copyInlineCodeOnDoubleClick)
                .onChange(async (value) => {
                    this.plugin.settings.copyInlineCodeOnDoubleClick = value;
                    await this.plugin.saveSettings();
                }));


        //SECTION - Copy Content Feature
        new Setting(containerEl).setHeading().setName('Copy Content Feature');

        new Setting(containerEl)
            .setName('Turn on "Copy content of files in folder/tag" feature')
            .setDesc('Adds "Copy content" to the right-click menu on files and folders in the file explorer, and enables the "Copy all notes with tag…" command via the command palette.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.copyContentFeature)
                .onChange(async (value) => {
                    this.plugin.settings.copyContentFeature = value;
                    await this.plugin.saveSettings();

                    // Initialize or clean up CopyContentFeature when the setting toggles.
                    // It adds/removes the "Copy content" buttons.
                    if (value) {
                        if (!this.plugin.copyContentFeature) {
                            this.plugin.copyContentFeature = new CopyContentFeature(this.app, this.plugin);
                        }
                        this.plugin.copyContentFeature.initialize();
                    } else {
                        if (this.plugin.copyContentFeature) {
                            this.plugin.copyContentFeature.cleanup();
                            this.plugin.copyContentFeature = null;
                        }
                    }
                }));

        //!SECTION - Copy Content Feature

        //SECTION - Contextual Code Block Language
        new Setting(containerEl).setHeading().setName('Contextual Code Block Language');

        new Setting(containerEl)
            .setName('Use contextual code block language')
            .setDesc('When pasting text as a code block (Mod+Alt+V), the plugin will try to auto-detect the language based on the selected context below.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.useContextualCodeBlockLanguage)
                .onChange(async (value) => {
                    this.plugin.settings.useContextualCodeBlockLanguage = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        new Setting(containerEl)
            .setName('Search language code in…')
            .setDesc('Where to look for the language name (e.g., note name, parent folder). If the language is found in multiple places, the one higher in the custom language list takes priority.')
            .addDropdown(dropdown => dropdown
                .addOption('noteName', 'Note name')
                .addOption('parentFolder', 'Parent folder name')
                .addOption('nearestToRootAncestorFolder', 'Nearest to root ancestor folder name')
                .addOption('tags', 'Tags')
                .setValue(this.plugin.settings.languageSearchLocation)
                .setDisabled(!this.plugin.settings.useContextualCodeBlockLanguage)
                .onChange(async (value) => {
                    this.plugin.settings.languageSearchLocation = value as 'noteName' | 'parentFolder' | 'nearestToRootAncestorFolder' | 'tags';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Custom language list')
            .setDesc('Enter programming languages, one per line. Languages higher in the list have higher priority when auto-detection matches several candidates at once. Ignores case.')
            .addExtraButton(btn => {
                let confirmMode = false;
                let resetTimer: ReturnType<typeof setTimeout> | null = null;

                const cancelConfirm = () => {
                    confirmMode = false;
                    if (resetTimer) clearTimeout(resetTimer);
                    resetTimer = null;
                    btn.extraSettingsEl.style.backgroundColor = '';
                    btn.extraSettingsEl.style.color = '';
                    btn.setIcon('trash');
                    btn.setTooltip('Clear all');
                };

                btn.setIcon('trash');
                btn.setTooltip('Clear all');
                btn.onClick(async () => {
                    if (!confirmMode) {
                        confirmMode = true;
                        btn.extraSettingsEl.style.backgroundColor = 'var(--color-red, #e93147)';
                        btn.extraSettingsEl.style.color = '#fff';
                        btn.setIcon('trash');
                        btn.setTooltip('Click again to confirm clear');
                        resetTimer = setTimeout(() => cancelConfirm(), 4000);
                        return;
                    }
                    cancelConfirm();
                    this.plugin.settings.codeBoxLanguages = [];
                    await this.plugin.saveSettings();
                    this.display();
                });
            })
            .addExtraButton(btn => {
                let confirmMode = false;
                let resetTimer: ReturnType<typeof setTimeout> | null = null;

                const cancelConfirm = () => {
                    confirmMode = false;
                    if (resetTimer) clearTimeout(resetTimer);
                    resetTimer = null;
                    btn.extraSettingsEl.style.backgroundColor = '';
                    btn.extraSettingsEl.style.color = '';
                    btn.setIcon('reset');
                    btn.setTooltip('Reset to default');
                };

                btn.setIcon('reset');
                btn.setTooltip('Reset to default');
                btn.onClick(async () => {
                    if (!confirmMode) {
                        confirmMode = true;
                        btn.extraSettingsEl.style.backgroundColor = 'var(--color-red, #e93147)';
                        btn.extraSettingsEl.style.color = '#fff';
                        btn.setIcon('reset');
                        btn.setTooltip('Click again to confirm reset');
                        resetTimer = setTimeout(() => cancelConfirm(), 4000);
                        return;
                    }
                    cancelConfirm();
                    this.plugin.settings.codeBoxLanguages = ['python', 'javascript', 'typescript', 'markdown', 'html'];
                    await this.plugin.saveSettings();
                    this.display();
                });
            })
            .addTextArea(text => {
                text
                    .setValue(this.plugin.settings.codeBoxLanguages.join('\n'))
                    .setDisabled(!this.plugin.settings.useContextualCodeBlockLanguage)
                    .onChange(async (value) => {
                        this.plugin.settings.codeBoxLanguages = value
                            .split('\n')
                            .map(lang => lang.trim())
                            .filter(lang => lang.length > 0);
                        await this.plugin.saveSettings();
                    });
                text.inputEl.rows = 6;
            });
        //!SECTION - Contextual Code Block Language
    }
}