export interface AppSettings {
    apiKey: string;
    enabledDomains: {
        chatgpt: boolean;
        claude: boolean;
        gemini: boolean;
    };
}

export const defaultSettings: AppSettings = {
    apiKey: '',
    enabledDomains: {
        chatgpt: true,
        claude: true,
        gemini: true,
    },
};

export const getSettings = async (): Promise<AppSettings> => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const result = await chrome.storage.local.get('settings');
        return result.settings || defaultSettings;
    }
    return defaultSettings;
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ settings });
    }
};
