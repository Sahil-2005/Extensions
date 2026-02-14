# ✨ PromptTune

> **"Grammarly for Prompts"**

PromptTune is a powerful Chrome Extension that integrates directly into your favorite AI chat interfaces (ChatGPT, Claude, Gemini). With a single click, it uses the advanced Gemini 1.5 Flash model to rewrite your draft prompts into precise, detailed, and structured engineering masterpieces.

## 🚀 Features

-   **✨ One-Click Optimization**: Injects a native-looking "Tune" button directly into the chat input area.
-   **🧠 Intelligent Rewriting**: Uses Gemini 1.5 Flash to expand, structure, and clarify your prompts.
-   **🔒 Privacy-First**: Your API key is stored locally in your browser (`chrome.storage.local`) and never sent to our servers.
-   **🎨 Seamless Integration**: Uses Shadow DOM to ensure styles never conflict with the host website.
-   **⚡ Fast & Lightweight**: Built with Vite, React, and Tailwind CSS for instant performance.

## 🛠️ Supported Platforms

-   [ChatGPT](https://chatgpt.com)
-   [Claude](https://claude.ai)
-   [Google Gemini](https://gemini.google.com)

## 📦 Installation

Since this is a developer build, you'll need to load it manually:

1.  **Build the Project** (if you have the source):
    ```bash
    npm install
    npm run build
    ```
2.  **Load in Chrome**:
    -   Open `chrome://extensions`.
    -   Enable **Developer mode** (toggle in top right).
    -   Click **Load unpacked**.
    -   Select the `dist` folder inside the `PromptTune` directory.

## ⚙️ Configuration

1.  Click the **PromptTune icon** in your Chrome toolbar.
2.  Enter your **Gemini API Key**.
    -   *Don't have one? Get it free at [Google AI Studio](https://aistudio.google.com/app/apikey).*
3.  Toggle the platforms you want to enable/disable.
4.  Click **Save Settings**.

## 📝 Usage

1.  Go to ChatGPT, Claude, or Gemini.
2.  Type a rough draft of your prompt (e.g., *"help me write code"*).
3.  Click the **✨ Tune** button that appears floating in the input box.
4.  Watch as your prompt is magically rewritten into a detailed request!

## 🔧 Troubleshooting

-   **Button not showing?** Refresh the page. Ensure you are on a supported domain.
-   **"API Key Missing"?** Open the extension popup and save your key.
-   **Optimization failed?** Check your internet connection and verify your API key limits.

## 👨‍💻 Tech Stack

-   **Framework**: React 18 + TypeScript
-   **Build Tool**: Vite + @crxjs/vite-plugin
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **AI Model**: Gemini 1.5 Flash

---

*Built with ❤️ for the AI community.*
