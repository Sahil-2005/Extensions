export type SiteType = 'chatgpt' | 'claude' | 'gemini' | 'unknown';

export const getSiteType = (): SiteType => {
    const hostname = window.location.hostname;
    if (hostname.includes('chatgpt.com')) return 'chatgpt';
    if (hostname.includes('claude.ai')) return 'claude';
    if (hostname.includes('gemini.google.com')) return 'gemini';
    return 'unknown';
};

export const getInputField = (site: SiteType): HTMLElement | null => {
    switch (site) {
        case 'chatgpt':
            return document.querySelector('#prompt-textarea') || document.querySelector('textarea[data-id="prompt-textarea"]');
        case 'claude':
            // Claude uses a contenteditable div
            return document.querySelector('div[contenteditable="true"].ProseMirror');
        case 'gemini':
            return document.querySelector('div[contenteditable="true"].rich-textarea') || document.querySelector('div[role="textbox"]');
        default:
            return null;
    }
};

export const getInputContainer = (inputField: HTMLElement, site: SiteType): HTMLElement | null => {
    // We want to append our button relative to the input container
    // This requires some trial and error, usually the parent or grandparent
    if (!inputField) return null;

    if (site === 'chatgpt') {
        // ChatGPT: usually the wrapper around the textarea
        return inputField.parentElement || null;
    }
    if (site === 'claude') {
        // Claude: The fieldset or the wrapper div
        return inputField.closest('.fieldset') || inputField.parentElement?.parentElement || null;
    }
    if (site === 'gemini') {
        return inputField.parentElement?.parentElement || null;
    }
    return inputField.parentElement || null;
}
