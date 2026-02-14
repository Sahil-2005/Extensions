# Chrome Extensions Collection

A curated collection of Chrome extensions I've developed to enhance productivity, privacy, and web browsing experience.

## 📦 Extensions

### 🛡️ [PasteGuard](./pasteguard)
**Status**: ✅ Active Development  
**Purpose**: Automatically protects your privacy by detecting and redacting sensitive information (API keys, emails, credit cards, etc.) before pasting into AI chatbots.

**Key Features**:
- 14+ sensitive data pattern detection types
- 100% local processing (privacy-first)
- Works on ChatGPT, Claude, Gemini
- Real-time paste interception
- Zero configuration required

[View Details →](./pasteguard/README.md)


### 🔐 [PromptVault](./PromptVault)
**Status**: 🚧 Initial Setup
**Purpose**: Manage and instantly inject complex prompts into AI tools like ChatGPT, Claude, and Gemini with a slash command or floating button.

**Key Features**:
- ⚡ Slash-command autocomplete (`/review`, `/fix`)
- 📂 Vault Dashboard for prompt management
- 👆 One-click injection via floating button
- ☁️ Syncs across devices

[View Details →](./PromptVault/README.md)

### ✨ [PromptTune](./PromptTune)
**Status**: ✅ Active Development
**Purpose**: "Grammarly for Prompts" - One-click prompt optimization directly inside ChatGPT, Claude, and Gemini using Gemini 1.5 Flash.

**Key Features**:
- ✨ Smart "Tune" button injected into chat inputs
- 🧠 Powered by Gemini 1.5 Flash
- ⚡ Instant rewrite for clarity and structure
- 🎨 Native UI integration (Shadow DOM)

[View Details →](./PromptTune/README.md)

---


## 🚀 Getting Started

Each extension has its own directory with:
- `README.md` - Detailed documentation
- `manifest.json` - Extension configuration
- Source code and assets

### Installation (General)
1. Clone this repository
2. Navigate to the specific extension folder
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extension folder

## 🛠️ Development

### Prerequisites
- Google Chrome (latest version)
- Basic knowledge of JavaScript, HTML, CSS
- Text editor or IDE

### Project Structure
```
Extensions/
├── README.md (this file)
├── pasteguard/
│   ├── README.md
│   ├── manifest.json
│   └── src/
├── PromptVault/
│   ├── README.md
│   ├── manifest.json
│   └── src/
├── PromptTune/
│   ├── README.md
│   ├── manifest.json
│   └── src/
└── [future-extension]/
    ├── README.md
    └── ...
```

## 📝 Contributing

These extensions are personal projects, but suggestions and feedback are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Propose new extension ideas

## 📄 License

Each extension may have its own license. Check individual extension directories for details.

## 🔗 Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Web Store](https://chrome.google.com/webstore/category/extensions)

---

**Last Updated**: February 2026
**Total Extensions**: 3
