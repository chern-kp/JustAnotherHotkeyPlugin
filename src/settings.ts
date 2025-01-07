import { App, PluginSettingTab, Setting } from 'obsidian';
import JustAnotherHotkeyPlugin from './main';

export class JustAnotherHotkeyPluginSettingTab extends PluginSettingTab {
    plugin: JustAnotherHotkeyPlugin;

    constructor(app: App, plugin: JustAnotherHotkeyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('Turn off TAB key indentation')
            .setDesc('When enabled, pressing TAB key will not indent the current line')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.disableTabIndentation)
                .onChange(async (value) => {
                    this.plugin.settings.disableTabIndentation = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Copy inline code on double click')
            .setDesc('When enabled, double-clicking on inline code blocks will copy their content')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.copyInlineCodeOnDoubleClick)
                .onChange(async (value) => {
                    this.plugin.settings.copyInlineCodeOnDoubleClick = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Use contextual code block language')
            .setDesc('Automatically determine code block language based on context')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.useContextualCodeBlockLanguage)
                .onChange(async (value) => {
                    this.plugin.settings.useContextualCodeBlockLanguage = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        new Setting(containerEl)
            .setName('Search language code in...')
            .setDesc('If multiple language names are found, the one with higher priority in the custom language list will be selected')
            .addDropdown(dropdown => dropdown
                .addOption('noteName', 'Note name')
                .addOption('parentFolder', 'Parent folder name')
                .addOption('nearestToRootAncestorFolder', 'Nearest to root ancestor folder name')
                .addOption('tags', 'Tags')
                .setValue(this.plugin.settings.languageSearchLocation)
                .setDisabled(!this.plugin.settings.useContextualCodeBlockLanguage)
                .onChange(async (value: 'noteName' | 'parentFolder' | 'nearestToRootAncestorFolder' | 'tags') => {
                    this.plugin.settings.languageSearchLocation = value;
                    await this.plugin.saveSettings();
                }));

                new Setting(containerEl)
            .setName('Custom language list')
            .setDesc('Enter programming languages (one per line). Languages higher in the list have higher priority.')
            .addTextArea(text => text
                .setValue(this.plugin.settings.codeBoxLanguages.join('\n'))
                .setDisabled(!this.plugin.settings.useContextualCodeBlockLanguage)
                .onChange(async (value) => {
                    this.plugin.settings.codeBoxLanguages = value
                        .split('\n')
                        .map(lang => lang.trim())
                        .filter(lang => lang.length > 0);
                    await this.plugin.saveSettings();
                }));

    }
}