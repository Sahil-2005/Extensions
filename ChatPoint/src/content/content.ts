// Use an IIFE to avoid polluting the global namespace
(function () {
  const isChatGPT = window.location.hostname.includes('chatgpt.com');
  const isGemini = window.location.hostname.includes('gemini.google.com');

  let currentChatId: string | null = null;
  let selectionTooltip: HTMLButtonElement | null = null;
  let popupFrame: HTMLIFrameElement | null = null;

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
      // Close popup frame on chat change to avoid stale state
      if (popupFrame) {
        popupFrame.remove();
        popupFrame = null;
      }
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
          showNamingModal(selectedText, (title) => {
            saveCheckpoint(title, selectedText);
          });
          hideTooltip();
        };
      }
    } else {
      hideTooltip();
    }
  }

  function showNamingModal(description: string | undefined, onSave: (title: string) => void) {
    // This is now ONLY for selection checkpoints
    // ... code remains same as before ...
    // Remove if already exists
    document.getElementById('chatpoint-naming-modal-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'chatpoint-naming-modal-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '20000',
      opacity: '0',
      transition: 'opacity 0.2s ease'
    });

    const modal = document.createElement('div');
    modal.id = 'chatpoint-naming-modal';
    Object.assign(modal.style, {
      width: '320px',
      backgroundColor: '#0f172a',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    });

    const title = document.createElement('h3');
    title.textContent = 'Name this Checkpoint';
    Object.assign(title.style, {
      margin: '0',
      fontSize: '18px',
      fontWeight: '600',
      background: 'linear-gradient(to bottom right, #818cf8, #c084fc)',
      webkitBackgroundClip: 'text',
      webkitTextFillColor: 'transparent'
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'e.g. Key Concept, Code Block...';
    Object.assign(input.style, {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '10px 12px',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box'
    });

    if (description) {
        const desc = document.createElement('p');
        desc.textContent = `"${description.length > 60 ? description.substring(0, 60) + '...' : description}"`;
        Object.assign(desc.style, {
            fontSize: '12px',
            color: '#94a3b8',
            margin: '0',
            fontStyle: 'italic',
            borderLeft: '2px solid rgba(129, 140, 248, 0.3)',
            paddingLeft: '8px'
        });
        modal.appendChild(desc);
    }

    const actions = document.createElement('div');
    Object.assign(actions.style, {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '8px'
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    Object.assign(cancelBtn.style, {
      padding: '8px 16px',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      color: '#94a3b8',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    });

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    Object.assign(saveBtn.style, {
      padding: '8px 20px',
      borderRadius: '8px',
      backgroundColor: '#4f46e5',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)'
    });

    actions.appendChild(cancelBtn);
    actions.appendChild(saveBtn);

    modal.appendChild(title);
    modal.appendChild(input);
    modal.appendChild(actions);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Fade in
    setTimeout(() => overlay.style.opacity = '1', 10);
    input.focus();

    const closeModal = () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 200);
    };

    const handleSave = () => {
        const value = input.value.trim();
        if (value) {
            onSave(value);
            closeModal();
        } else {
            input.style.borderColor = '#ef4444';
        }
    };

    saveBtn.onclick = handleSave;

    cancelBtn.onclick = closeModal;
    overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
    input.onkeydown = (e) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') closeModal();
    };
  }

  function hideTooltip() {
    if (selectionTooltip) {
      selectionTooltip.style.display = 'none';
    }
  }

  function togglePopupFrame() {
    if (popupFrame) {
      popupFrame.style.transform = 'translateX(100%)';
      popupFrame.style.opacity = '0';
      setTimeout(() => {
        popupFrame?.remove();
        popupFrame = null;
      }, 300);
      return;
    }

    if (!currentChatId) return;

    popupFrame = document.createElement('iframe');
    popupFrame.src = chrome.runtime.getURL(`index.html?chatId=${currentChatId}`);
    
    Object.assign(popupFrame.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '350px',
      height: 'calc(100vh - 120px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      zIndex: '2147483647',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      backgroundColor: '#020617',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'translateX(100%)',
      opacity: '0'
    });

    document.body.appendChild(popupFrame);
    
    // Force reflow for transition
    popupFrame.offsetHeight;
    popupFrame.style.transform = 'translateX(0)';
    popupFrame.style.opacity = '1';
  }

  function injectFloatingButton() {
     // Remove existing if any
     document.getElementById('chatpoint-floating-widget')?.remove();

     const widget = document.createElement('div');
     widget.id = 'chatpoint-floating-widget';
     
     Object.assign(widget.style, {
        position: 'fixed',
        bottom: '30px',
        right: '25px',
        zIndex: '9999',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
     });

     const btn = createCheckpointButton();
     btn.style.padding = '12px 18px';
     btn.style.borderRadius = '9999px';
     btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg><span>Checkpoints</span>`;

     btn.onclick = () => {
         togglePopupFrame();
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
  chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (request.action === 'GET_SCROLL_INFO') {
      const container = getScrollContainer();
      sendResponse({
        scrollTop: container ? container.scrollTop : window.scrollY
      });
      return true; // Keep channel open for async response
    }

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
