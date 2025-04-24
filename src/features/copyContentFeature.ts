import { App, Menu, TFile, TFolder, Notice } from 'obsidian';
import JustAnotherHotkeyPlugin from '../main';

export class CopyContentFeature {
    // Reference to Obsidian app instance, we use it to access obsidian vault API
    private app: App;
    // Reference to the main plugin instance, we use it to access plugin settings and methods
    private plugin: JustAnotherHotkeyPlugin;
    // Handler for file explorer context menu, we use it to register the context menu item
    private fileMenuHandler: ((menu: Menu, file: TFile | TFolder) => void) | null = null;
    // Handler for multiple files selection menu
    private filesMenuHandler: ((menu: Menu, files: (TFile | TFolder)[]) => void) | null = null;
    // Flag to track if menu is already registered
    private isMenuRegistered = false;

    constructor(app: App, plugin: JustAnotherHotkeyPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    public initialize(): void {
        // Only register menu if it's not already registered
        if (!this.isMenuRegistered) {
            this.registerFileExplorerContextMenu();
            this.registerFilesExplorerContextMenu();
            this.isMenuRegistered = true;
        }
    }

    public cleanup(): void {
        if (this.fileMenuHandler) {
            this.app.workspace.off('file-menu', this.fileMenuHandler);
            this.fileMenuHandler = null;
        }
        if (this.filesMenuHandler) {
            this.app.workspace.off('files-menu', this.filesMenuHandler);
            this.filesMenuHandler = null;
        }
        this.isMenuRegistered = false;
    }

    //Reads and formats content of a single file
    //NOTE - Changing formatting is done here.
    private async copyFileContent(file: TFile): Promise<string> {
        try {
            // Read file content using Obsidian vault API
            const content = await this.app.vault.read(file);
            // Add file path as header and separate content with newlines
            return `=== ${file.path} ===\n${content}\n\n`;
        } catch (error) {
            console.error(`Error reading file ${file.path}:`, error);
            return `Error reading file ${file.path}\n`;
        }
    }

    //Processes multiple selected items (files and/or folders)
    private async copyMultipleItems(items: (TFile | TFolder)[]): Promise<string> {
        let result = '';

        // Get all files in the vault once
        const allFiles = this.app.vault.getFiles();

        // First process all files that are not inside selected folders
        const selectedFolders = items.filter(item => item instanceof TFolder) as TFolder[];
        for (const item of items) {
            if (item instanceof TFile) {
                // Check if this file is inside any selected folder
                const isInsideSelectedFolder = selectedFolders.some(folder =>
                    item.path.startsWith(folder.path + '/')
                );

                if (!isInsideSelectedFolder) {
                    result += await this.copyFileContent(item);
                }
            }
        }

        // Then process all folders
        for (const folder of selectedFolders) {
            // Get all files in the folder
            const files = allFiles
                .filter(file => file.path.startsWith(folder.path))
                .sort((a, b) => a.path.localeCompare(b.path));

            // Process all files in the folder
            for (const file of files) {
                result += await this.copyFileContent(file);
            }
        }

        return result;
    }

    //Registers context menu item in file explorer when current file is selected
    private registerFileExplorerContextMenu(): void {
        this.fileMenuHandler = (menu: Menu, file: TFile | TFolder) => {
            menu.addItem((item) => {
                item
                    .setTitle('Copy content')
                    .setIcon('copy')
                    .onClick(async () => {
                        try {
                            // Use the clicked file/folder
                            const selectedItems = [file];

                            // Get combined content of all selected items by calling copyMultipleItems()
                            const content = await this.copyMultipleItems(selectedItems);

                            if (content) {
                                // Copy to clipboard using browser API
                                await navigator.clipboard.writeText(content);
                                new Notice('Content copied to clipboard!');
                            } else {
                                new Notice('No content to copy');
                            }
                        } catch (error) {
                            console.error('Error copying content:', error);
                            new Notice('Error copying content');
                        }
                    });
            });
        };
        this.app.workspace.on('file-menu', this.fileMenuHandler);
    }

    //Registers context menu item in multiple files selection menu
    private registerFilesExplorerContextMenu(): void {
        this.filesMenuHandler = (menu: Menu, files: (TFile | TFolder)[]) => {
            menu.addItem((item) => {
                item
                    .setTitle('Copy content')
                    .setIcon('copy')
                    .onClick(async () => {
                        try {
                            // Use all selected files/folders
                            const content = await this.copyMultipleItems(files);

                            if (content) {
                                // Copy to clipboard using browser API
                                await navigator.clipboard.writeText(content);
                                new Notice('Content copied to clipboard!');
                            } else {
                                new Notice('No content to copy');
                            }
                        } catch (error) {
                            console.error('Error copying content:', error);
                            new Notice('Error copying content');
                        }
                    });
            });
        };
        this.app.workspace.on('files-menu', this.filesMenuHandler);
    }
}