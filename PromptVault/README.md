# PromptVault 🔐

A premium, SaaS-quality Chrome Extension to manage and inject complex prompts into AI tools like ChatGPT, Claude, and Gemini.

## 🚀 Features
- **Vault Dashboard**: Manage your prompts with a sleek UI.
- **Inline Injector**: Floating "Spark" button on AI input boxes.
- **Slash Commands**: Type `/` to instantly insert prompts.
- **Sync**: Prompts sync across devices via Google Account.

## 🛠️ Tech Stack
- **React 18** + **Vite**
- **Tailwind CSS**
- **Chrome Manifest V3**

## 📦 Setup & Build

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development Build** (Watch mode):
   ```bash
   npm run dev
   ```

3. **Production Build**:
   ```bash
   npm run build
   ```

## 🔌 Installation in Chrome

1. Run `npm run build`.
2. Open Chrome and go to `chrome://extensions`.
3. Enable "Developer mode".
4. Click "Load unpacked".
5. Select the `dist` folder generated in this directory.

## 📂 Project Structure

- `src/popup`: Dashboard UI (React).
- `src/content`: Content scripts injected into AI sites.
- `src/background`: Service worker.
- `src/assets`: Static assets.
