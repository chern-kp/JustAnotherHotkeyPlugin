import { App, Menu, TFile, TFolder, Notice } from 'obsidian';
import JustAnotherHotkeyPlugin from '../main';

export class CopyContentFeature {
    private app: App;
    private plugin: JustAnotherHotkeyPlugin;
    private fileMenuHandler: ((menu: Menu, file: TFile | TFolder) => void) | null = null;

    constructor(app: App, plugin: JustAnotherHotkeyPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    public initialize(): void {
        this.registerFileExplorerContextMenu();
    }

    public cleanup(): void {
        if (this.fileMenuHandler) {
            this.app.workspace.off('file-menu', this.fileMenuHandler);
            this.fileMenuHandler = null;
        }
    }

    //ANCHOR - Registers the file explorer context menu.
    private registerFileExplorerContextMenu(): void {
        this.fileMenuHandler = (menu: Menu, file: TFile | TFolder) => {
            menu.addItem((item) => {
                item
                    .setTitle('Copy content')
                    .setIcon('copy')
                    .onClick(async () => {
                        // TODO: Implement copy content function for: 1. Files; 2. Folders; 3. Multiple files and/or folders selected at once.
                        new Notice('Copy content feature clicked!');
                    });
            });
        };
        this.app.workspace.on('file-menu', this.fileMenuHandler);
    }
}