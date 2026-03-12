// Use an IIFE to avoid polluting the global namespace
(function () {
  const isChatGPT = window.location.hostname.includes('chatgpt.com');
  const isGemini = window.location.hostname.includes('gemini.google.com');

  let currentChatId: string | null = null;

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

  function saveCheckpoint(title: string, scrollTop?: number) {
    if (!currentChatId) return;

    const id = Date.now().toString();
    const checkpoint = {
        id,
        title,
        scrollTop: scrollTop || window.scrollY || document.documentElement.scrollTop,
        timestamp: Date.now()
    };

    const storageKey = `chatpoints_${currentChatId}`;
    chrome.storage.local.get([storageKey], (result: { [key: string]: any[] }) => {
        const existing = result[storageKey] || [];
        existing.push(checkpoint);
        chrome.storage.local.set({ [storageKey]: existing }, () => {
            // Optional: Show a brief "Saved!" toast logic here
            console.log("Checkpoint saved:", checkpoint);
        });
    });
  }

  function createCheckpointButton(): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = 'chatpoint-add-btn';
    
    // SVG for a bookmark/pin icon
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>Checkpoint</span>
    `;

    // Modern inline styling for the button
    Object.assign(btn.style, {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 10px',
      backgroundColor: 'rgba(99, 102, 241, 0.1)', // indigo-500/10
      color: '#818cf8', // indigo-400
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      backdropFilter: 'blur(4px)',
      transition: 'all 0.2s ease',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    });

    btn.onmouseover = () => {
        btn.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
        btn.style.boxShadow = '0 0 8px rgba(99, 102, 241, 0.3)';
    };
    btn.onmouseout = () => {
        btn.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        btn.style.boxShadow = 'none';
    };

    return btn;
  }

  function injectIntoChatGPT() {
    // Strategy for ChatGPT: We can observe messages being added or 
    // we can create a nice floating action button at the bottom right
    injectFloatingButton();
  }

  function injectIntoGemini() {
    // Strategy for Gemini: the scrollable container is different. 
    injectFloatingButton();
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
     btn.style.backgroundColor = '#4f46e5'; // solid indigo-600
     btn.style.color = '#fff';
     btn.style.boxShadow = '0 4px 14px 0 rgba(79, 70, 229, 0.39)';

     btn.onmouseover = () => {
         btn.style.transform = 'translateY(-2px)';
         btn.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.5)';
     };
     btn.onmouseout = () => {
         btn.style.transform = 'translateY(0)';
         btn.style.boxShadow = '0 4px 14px 0 rgba(79, 70, 229, 0.39)';
     };

     btn.onclick = () => {
         const title = prompt("Enter a brief name for this checkpoint:");
         if (title) {
            // Determine scroll container
            let scrollTop = window.scrollY;
            if (isChatGPT) {
                // Find main scroll container in ChatGPT
                const scrollArea = document.querySelector('main > div:first-child > div > div > div');
                if (scrollArea) scrollTop = scrollArea.scrollTop;
            } else if (isGemini) {
                // Find main scroll container in Gemini
                const scrollArea = Object.values(document.querySelectorAll('div, main')).find(el => el.scrollHeight > window.innerHeight && el.clientHeight > 0);
                if (scrollArea) scrollTop = scrollArea.scrollTop;
            }
            saveCheckpoint(title, scrollTop);
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
     
     if (isChatGPT) injectIntoChatGPT();
     else if (isGemini) injectIntoGemini();
  }

  // Set up listeners for messages from the popup
  chrome.runtime.onMessage.addListener((request: any, _sender: chrome.runtime.MessageSender, _sendResponse: (response?: any) => void) => {
    if (request.action === 'JUMP_TO_CHECKPOINT') {
      const { checkpoint } = request;
      if (checkpoint && checkpoint.scrollTop !== undefined) {
         if (isChatGPT) {
             const scrollArea = document.querySelector('main > div:first-child > div > div > div');
             if (scrollArea) {
                 scrollArea.scrollTo({ top: checkpoint.scrollTop, behavior: 'smooth' });
             } else {
                 window.scrollTo({ top: checkpoint.scrollTop, behavior: 'smooth' });
             }
         } else if (isGemini) {
             // Find the element that's actually scrollable
             const elements = document.querySelectorAll('*');
             let scrollArea = null;
             let maxScroll = 0;
             for (let i = 0; i < elements.length; i++) {
                 if (elements[i].scrollHeight > maxScroll && elements[i].clientHeight > 0 && elements[i].scrollHeight > elements[i].clientHeight) {
                     maxScroll = elements[i].scrollHeight;
                     scrollArea = elements[i];
                 }
             }
             if (scrollArea) {
                 scrollArea.scrollTo({ top: checkpoint.scrollTop, behavior: 'smooth' });
             } else {
                 window.scrollTo({ top: checkpoint.scrollTop, behavior: 'smooth' });
             }
         }
      }
    }
  });

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
