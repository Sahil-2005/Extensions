# 📍 ChatPoint

> **"AI Context Anchors"**

ChatPoint is a smart browser extension designed to help you navigate long AI conversations with ease. Whether you're debugging code, brainstorming ideas, or writing long-form content on ChatGPT or Gemini, ChatPoint lets you drop "anchors" (checkpoints) at any point in the chat and jump back to them instantly.

## 🚀 Features

-   **📍 One-Click Anchors**: Instantly mark any point in your conversation as a checkpoint.
-   **⚡ Seamless Navigation**: Jump back to specific messages or context blocks in a single click.
-   **✏️ Custom Labeling**: Rename and organize your checkpoints for better context management.
-   **🔒 Privacy-First**: All checkpoints are stored locally in your browser (`chrome.storage.local`) and never leave your machine.
-   **🎨 Premium UI**: A sleek, dark-themed dashboard that stays out of your way until you need it.
-   **🧩 Content Integration**: Side-panel and floating button support for quick access directly on the page.

## 🛠️ Supported Platforms

-   [ChatGPT](https://chatgpt.com)
-   [Google Gemini](https://gemini.google.com)

## 📦 Installation

Since this is a developer build, you'll need to load it manually:

1.  **Build the Project**:
    ```bash
    npm install
    npm run build
    ```
2.  **Load in Chrome**:
    -   Open `chrome://extensions`.
    -   Enable **Developer mode** (toggle in top right).
    -   Click **Load unpacked**.
    -   Select the `dist` folder inside the `ChatPoint` directory.

## 📝 Usage

1.  Go to ChatGPT or Gemini.
2.  Find a message or point in the conversation you want to save.
3.  Click the **📍 Add** button in the ChatPoint dashboard.
4.  Optionally rename the checkpoint to describe the context.
5.  Click any saved checkpoint in the list to scroll back to that exact spot!

## 🔧 Troubleshooting

-   **Dashboard not updating?** Refresh the page to ensure the content script is active.
-   **Scroll jump slightly off?** Sometimes dynamic content loading can affect the scroll position. Try re-clicking the checkpoint.
-   **Button missing?** Ensure you are on a supported domain (`chatgpt.com` or `gemini.google.com`).

## 👨‍💻 Tech Stack

-   **Framework**: React 18 + TypeScript
-   **Build Tool**: Vite + @crxjs/vite-plugin
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Storage**: Chrome Storage API

---

<div align="center">
  <h3>Star this repo if you found it helpful! ⭐</h3>
  <p>Made with ❤️ by <a href="https://sahil-gawade.vercel.app/">Sahil Gawade</a></p>

  <a href="https://github.com/Sahil-2005"><img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=github&logoColor=white" alt="Github" /></a>
  <a href="https://github.com/Sahil-2005"><img src="https://img.shields.io/badge/FOLLOW-181717?style=for-the-badge&logo=github&logoColor=white" alt="Follow" /></a>
  <a href="https://www.linkedin.com/in/sahil-gawade-920a0a242/"><img src="https://img.shields.io/badge/LINKEDIN-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://www.linkedin.com/in/sahil-gawade-920a0a242/"><img src="https://img.shields.io/badge/CONNECT-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Connect" /></a>
  <a href="https://sahil-gawade.vercel.app/"><img src="https://img.shields.io/badge/PORTFOLIO-606060?style=for-the-badge&logo=hyper&logoColor=white" alt="Portfolio" /></a>
  <a href="https://sahil-gawade.vercel.app/"><img src="https://img.shields.io/badge/VISIT-000000?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Visit" /></a>
  <a href="mailto:gawadesahil.dev@gmail.com"><img src="https://img.shields.io/badge/MAIL-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Mail" /></a>
  <a href="mailto:gawadesahil.dev@gmail.com"><img src="https://img.shields.io/badge/CONTACT-E4405F?style=for-the-badge&logo=gmail&logoColor=white" alt="Contact" /></a>
</div>

*Built with ❤️ for the AI community.*
