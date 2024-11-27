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
    }
}