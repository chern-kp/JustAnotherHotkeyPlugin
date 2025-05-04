//Modal for selecting a tag from list, used in "Copy all notes with tag..." command
import { App, FuzzySuggestModal } from 'obsidian';

export class TagSuggestModal extends FuzzySuggestModal<string> {
    private tags: string[];
    private onChoose: (tag: string) => void;

    // Pass tags and callback to modal
    constructor(app: App, tags: string[], onChoose: (tag: string) => void) {
        super(app);

        // Sort tags to group subtags under parent tags
        this.tags = this.sortTagsWithSubtags(tags);
        this.onChoose = onChoose;
    }

    // Sort tags to group parent tags and their subtags together
    private sortTagsWithSubtags(tags: string[]): string[] {
        // Object to store tag hierarchy
        const tagHierarchy: Record<string, string[]> = {};

        // Store root tags (not subtags)
        const rootTags: string[] = [];

        // First identify root tags and subtags
        for (const tag of tags) {
            const parts = tag.split('/');

            if (parts.length === 1) {
                // This is a root tag (no slash)
                rootTags.push(tag);
                // Create empty array for its subtags
                if (!tagHierarchy[tag]) {
                    tagHierarchy[tag] = [];
                }
            } else {
                // This is a subtag - get parent tag
                const parentTag = parts[0];

                // Add parent tag to root tags if not already there
                if (!rootTags.includes(parentTag)) {
                    rootTags.push(parentTag);
                }

                // Initialize array for parent tag if needed
                if (!tagHierarchy[parentTag]) {
                    tagHierarchy[parentTag] = [];
                }

                // Add current subtag to its parent
                tagHierarchy[parentTag].push(tag);
            }
        }

        // Sort root tags alphabetically
        rootTags.sort();

        // Build final sorted list
        const sortedTags: string[] = [];

        for (const rootTag of rootTags) {
            // Add root tag
            sortedTags.push(rootTag);

            // Sort and add its subtags
            if (tagHierarchy[rootTag].length > 0) {
                tagHierarchy[rootTag].sort();
                sortedTags.push(...tagHierarchy[rootTag]);
            }
        }

        return sortedTags;
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