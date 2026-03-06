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

