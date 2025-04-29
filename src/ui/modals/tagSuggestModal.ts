//Modal for selecting a tag from list, used in "Copy all notes with tag..." command
import { App, FuzzySuggestModal } from 'obsidian';

export class TagSuggestModal extends FuzzySuggestModal<string> {
    private tags: string[];
    private onChoose: (tag: string) => void;

    // Pass tags and callback to modal
    constructor(app: App, tags: string[], onChoose: (tag: string) => void) {
        super(app);
        this.tags = tags;
        this.onChoose = onChoose;
    }

    // Return all tags for modal
    getItems(): string[] {
        return this.tags;
    }

    // Show tag as text
    getItemText(tag: string): string {
        return tag;
    }

    // Handle tag selection
    onChooseItem(tag: string, evt: MouseEvent | KeyboardEvent) {
        this.onChoose(tag);
    }
}