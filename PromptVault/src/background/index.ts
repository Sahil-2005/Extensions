console.log('PromptVault background service worker loaded');

chrome.runtime.onInstalled.addListener(() => {
    console.log('PromptVault installed');
});
