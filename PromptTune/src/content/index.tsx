// In order to inject Tailwind styles into the Shadow DOM, 
// we need to import the CSS as a raw string or URL.
// Vite provides ?inline for raw string.

import React from 'react';
import { createRoot } from 'react-dom/client';
import { getInputContainer, getInputField, getSiteType } from './utils/dom';
import { TuneButton } from './components/TuneButton';
// @ts-ignore
import cssContent from '@/styles/index.css?inline';

console.log('PromptTune: Content script loaded');

const INJECT_CLASS = 'prompt-tune-injected';

const injectButton = () => {
  const site = getSiteType();
  if (site === 'unknown') return;

  const inputField = getInputField(site);
  if (!inputField) return;

  const container = getInputContainer(inputField, site);
  if (!container) return;

  if (container.classList.contains(INJECT_CLASS) || container.querySelector('.' + INJECT_CLASS)) return;

  container.classList.add(INJECT_CLASS);

  const host = document.createElement('div');
  host.className = 'prompt-tune-host';
  
  // Ensure container has relative positioning for absolute child
  const style = window.getComputedStyle(container);
  if (style.position === 'static') {
    container.style.position = 'relative';
  }

  container.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });
  
  // Inject Tailwind CSS
  const styleTag = document.createElement('style');
  styleTag.textContent = cssContent;
  shadow.appendChild(styleTag);
  
  // Custom styles for positioning
  const customStyle = document.createElement('style');
  customStyle.textContent = `
    :host {
        position: absolute;
        bottom: 12px;
        right: 48px; /* Default offset to avoid send button */
        z-index: 999;
        font-family: sans-serif;
    }
    /* Specific adjustments per site based on 'site' prop if needed, 
       but we can handle that via React props or JS logic */
  `;
  shadow.appendChild(customStyle);
  
  const root = createRoot(shadow);
  root.render(<TuneButton inputElement={inputField} site={site} />);
};

const observer = new MutationObserver(() => {
    // Simple throttle could be added if performance issues arise
    injectButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

setTimeout(injectButton, 1000);
