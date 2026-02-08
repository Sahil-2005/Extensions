# 🛡️ LLM Sanitizer - Chrome Extension

## Overview
A privacy-focused Chrome extension that automatically detects and redacts sensitive information before you paste it into AI chatbots like ChatGPT, Claude, and Gemini.

## Features

### 🔒 Comprehensive Protection
Automatically detects and redacts 14 types of sensitive data:
- 📧 **Email addresses**
- 🔑 **API Keys** (OpenAI, AWS, Google, Generic)
- 💳 **Credit card numbers** (Visa, Mastercard, Amex, Discover)
- 🔐 **Private keys** (RSA, EC, OpenSSH)
- 🎫 **JWT tokens**
- 🐙 **GitHub tokens**
- 🌐 **IPv4 addresses** (with proper validation)
- 📱 **US phone numbers**
- 🆔 **Social Security Numbers**
- 🗄️ **Database connection strings**
- 🔑 **AWS Secret Access Keys**

### ✨ Smart Features
- **Local Processing**: All scanning happens locally in your browser - no data leaves your machine
- **Real-time Detection**: Intercepts paste events before sensitive data reaches the AI
- **Visual Feedback**: Shows which types of data were redacted
- **Non-intrusive**: Only activates on supported AI platforms
- **Fallback Support**: Multiple text insertion methods for maximum compatibility

### 🎯 Supported Platforms
- ChatGPT (chatgpt.com)
- Claude (claude.ai)
- Gemini (gemini.google.com)

## Installation

### From Source
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `llm-sanitizer` folder

### Verify Installation
- The extension icon should appear in your toolbar
- Click the icon to see the status popup
- Visit any supported AI platform and try pasting sensitive data

## How It Works

1. **Paste Detection**: Listens for paste events on supported AI platforms
2. **Pattern Matching**: Scans clipboard content using regex patterns
3. **Redaction**: Replaces sensitive data with placeholders (e.g., `[EMAIL_REDACTED]`)
4. **Safe Insertion**: Inserts sanitized text using multiple fallback methods
5. **Notification**: Shows which patterns were detected and redacted

## Usage

Simply use the extension as normal:
1. Copy any text containing sensitive information
2. Navigate to ChatGPT, Claude, or Gemini
3. Paste into the chat input
4. The extension automatically redacts sensitive data
5. A notification appears showing what was protected

## Development

### Project Structure
```
llm-sanitizer/
├── manifest.json          # Extension configuration
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── src/
    ├── patterns.js        # Regex patterns for detection
    ├── content.js         # Main paste interception logic
    └── popup/
        ├── popup.html     # Extension popup UI
        ├── popup.css      # Popup styling
        └── popup.js       # Popup functionality
```

### Adding New Patterns
Edit `src/patterns.js` and add a new pattern object:
```javascript
{
  name: "Pattern Name",
  regex: /your-regex-here/g,
  replacement: "[YOUR_PLACEHOLDER]"
}
```

### Testing
1. Create test data with various sensitive patterns
2. Copy the test data
3. Open a supported AI platform
4. Paste and verify redaction works
5. Check browser console for any errors

## Privacy & Security

- ✅ **100% Local Processing**: No data is sent to external servers
- ✅ **No Analytics**: We don't track your usage
- ✅ **No Permissions Abuse**: Only requests necessary permissions
- ✅ **Open Source**: Code is fully auditable

## Known Limitations

- Pattern detection is regex-based and may have false positives/negatives
- Some complex input fields may not support text insertion
- AWS Secret Access Key pattern is broad and may catch other 40-char base64 strings
- Only works on explicitly listed domains

## Future Enhancements

- [ ] User-configurable patterns
- [ ] Enable/disable specific pattern types
- [ ] Statistics tracking (items redacted)
- [ ] Whitelist for trusted sites
- [ ] Custom replacement text
- [ ] Support for more AI platforms
- [ ] Export/import pattern configurations

## Contributing

Contributions are welcome! Areas for improvement:
- More accurate regex patterns
- Support for additional AI platforms
- Better text insertion compatibility
- UI/UX enhancements
- Performance optimizations

## License

MIT License - Feel free to use and modify as needed.

## Disclaimer

This extension provides a best-effort approach to detecting sensitive data. It should not be considered 100% foolproof. Always review what you're pasting into AI chatbots, especially in professional contexts.

---

**Version**: 1.0  
**Last Updated**: February 2026
