import { App, PluginSettingTab, Setting } from 'obsidian';
import JustAnotherHotkeyPlugin from './main';

export class JustAnotherHotkeyPluginSettingTab extends PluginSettingTab {
    plugin: JustAnotherHotkeyPlugin;

    constructor(app: App, plugin: JustAnotherHotkeyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        console.log("Settings tab display called");
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('Turn off TAB key indentation')
            .setDesc('When enabled, pressing TAB key will not indent the current line')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.disableTabIndentation)
                .onChange(async (value) => {
                    console.log("Toggle changed to:", value);
                    this.plugin.settings.disableTabIndentation = value;
                    await this.plugin.saveSettings();
                    console.log("Settings saved after toggle");
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
    }


}