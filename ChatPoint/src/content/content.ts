// Use an IIFE to avoid polluting the global namespace
(function () {
  const isChatGPT = window.location.hostname.includes('chatgpt.com');
  const isGemini = window.location.hostname.includes('gemini.google.com');

  let currentChatId: string | null = null;
  let selectionTooltip: HTMLButtonElement | null = null;

  function getChatIdFromURL(): string | null {
    const url = window.location.href;
    if (isChatGPT && url.includes('/c/')) {
        return url.split('/c/')[1].split(/[?#]/)[0];
    } else if (isGemini && url.includes('/app/')) {
        return url.split('/app/')[1].split(/[?#]/)[0];
    }
    return null;
  }

  function handleUrlChange() {
    const newChatId = getChatIdFromURL();
    if (newChatId !== currentChatId) {
      currentChatId = newChatId;
      initCheckpointsUI();
    }
  }

  function saveCheckpoint(title: string, description?: string, scrollTop?: number) {
    if (!currentChatId) return;

    const id = Date.now().toString();
    const checkpoint = {
        id,
        title,
        description,
        scrollTop: scrollTop || getScrollContainer()?.scrollTop || window.scrollY,
        timestamp: Date.now()
    };

    const storageKey = `chatpoints_${currentChatId}`;
    chrome.storage.local.get([storageKey], (result: { [key: string]: any[] }) => {
        const existing = result[storageKey] || [];
        existing.push(checkpoint);
        chrome.storage.local.set({ [storageKey]: existing }, () => {
            console.log("Checkpoint saved:", checkpoint);
        });
    });
  }

  function getScrollContainer(): HTMLElement | null {
    if (isChatGPT) {
        return document.querySelector('main > div:first-child > div > div > div');
    } else if (isGemini) {
        const elements = document.querySelectorAll('*');
        let scrollArea: HTMLElement | null = null;
        let maxScroll = 0;
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            if (el.scrollHeight > maxScroll && el.clientHeight > 0 && el.scrollHeight > el.clientHeight) {
                maxScroll = el.scrollHeight;
                scrollArea = el;
            }
        }
        return scrollArea;
    }
    return null;
  }

  function createCheckpointButton(isFloating: boolean = false): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = 'chatpoint-add-btn';
    
    const icon = isFloating ? 
      `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>` :
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;

    btn.innerHTML = `${icon}<span>${isFloating ? 'Add' : 'Checkpoint'}</span>`;

    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: isFloating ? '4px 8px' : '6px 10px',
      backgroundColor: '#4f46e5',
      color: '#fff',
      border: 'none',
      borderRadius: isFloating ? '6px' : '8px',
      fontSize: isFloating ? '11px' : '12px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      zIndex: '10000'
    };

    Object.assign(btn.style, baseStyle);

    btn.onmouseover = () => {
        btn.style.transform = 'translateY(-1px) scale(1.02)';
        btn.style.backgroundColor = '#4338ca';
        btn.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.5)';
    };
    btn.onmouseout = () => {
        btn.style.transform = 'translateY(0) scale(1)';
        btn.style.backgroundColor = '#4f46e5';
        btn.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
    };

    return btn;
  }

  function handleSelection() {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0) {
      if (!selectionTooltip) {
        selectionTooltip = createCheckpointButton(true);
        selectionTooltip.id = 'chatpoint-selection-tooltip';
        selectionTooltip.style.position = 'absolute';
        document.body.appendChild(selectionTooltip);
      }

      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();

      if (rect) {
        selectionTooltip.style.display = 'flex';
        selectionTooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 30}px`;
        selectionTooltip.style.top = `${rect.top + window.scrollY - 35}px`;

        selectionTooltip.onclick = (e) => {
          e.stopPropagation();
          const title = prompt("Enter checkpoint title:", "Highlight");
          if (title) {
            saveCheckpoint(title, selectedText);
          }
          hideTooltip();
        };
      }
    } else {
      hideTooltip();
    }
  }

  function hideTooltip() {
    if (selectionTooltip) {
      selectionTooltip.style.display = 'none';
    }
  }

  function injectFloatingButton() {
     // Remove existing if any
     document.getElementById('chatpoint-floating-widget')?.remove();

     const widget = document.createElement('div');
     widget.id = 'chatpoint-floating-widget';
     
     Object.assign(widget.style, {
        position: 'fixed',
        bottom: '80px',
        right: '25px',
        zIndex: '9999',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
     });

     const btn = createCheckpointButton();
     btn.style.padding = '10px 14px';
     btn.style.borderRadius = '9999px';

     btn.onclick = () => {
         const title = prompt("Enter a brief name for this checkpoint:");
         if (title) {
            saveCheckpoint(title);
         }
     };

     widget.appendChild(btn);
     document.body.appendChild(widget);
  }

  function initCheckpointsUI() {
     if (!currentChatId) {
         document.getElementById('chatpoint-floating-widget')?.remove();
         return;
     }
     
     injectFloatingButton();
  }

  // Set up listeners for messages from the popup
  chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, _sendResponse: (response?: any) => void) => {
    if (request.action === 'JUMP_TO_CHECKPOINT') {
      const { checkpoint } = request;
      const container = getScrollContainer();
      
      if (checkpoint) {
        // Try to find text first if description exists
        if (checkpoint.description) {
            const findTextAndScroll = () => {
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                let node;
                while (node = walker.nextNode()) {
                    if (node.textContent?.includes(checkpoint.description)) {
                        (node.parentElement as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Add temporary highlight
                        const parent = node.parentElement as HTMLElement;
                        const originalBg = parent.style.backgroundColor;
                        parent.style.backgroundColor = 'rgba(79, 70, 229, 0.2)';
                        setTimeout(() => {
                            parent.style.backgroundColor = originalBg;
                        }, 2000);
                        return true;
                    }
                }
                return false;
            };

            if (findTextAndScroll()) return;
        }

        // Fallback to scrollTop
        if (checkpoint.scrollTop !== undefined) {
             if (container) {
                 container.scrollTo({ top: checkpoint.scrollTop, behavior: 'smooth' });
             } else {
                 window.scrollTo({ top: checkpoint.scrollTop, behavior: 'smooth' });
             }
         }
      }
    }
  });

  // Track selection
  document.addEventListener('mouseup', handleSelection);
  document.addEventListener('keyup', handleSelection);

  // Track URL changes (SPAs like ChatGPT/Gemini push state)
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const url = window.location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      handleUrlChange();
    }
  }).observe(document, { subtree: true, childList: true });

  // Initial setup
  currentChatId = getChatIdFromURL();
  if (currentChatId) {
    initCheckpointsUI();
  }
})();
