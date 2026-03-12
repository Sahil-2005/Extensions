import { useState, useEffect } from 'react';
import { Bookmark, MapPin, Trash2, MessageCircle } from 'lucide-react';

interface Checkpoint {
  id: string;
  title: string;
  elementSelector?: string;
  scrollTop?: number;
  timestamp: number;
}

function App() {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    // Determine the current chat ID
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url;
      if (url) {
        let currentChatId = null;
        if (url.includes('chatgpt.com/c/')) {
          currentChatId = url.split('chatgpt.com/c/')[1].split(/[?#]/)[0];
        } else if (url.includes('gemini.google.com/app/')) {
          currentChatId = url.split('gemini.google.com/app/')[1].split(/[?#]/)[0];
        }
        
        if (currentChatId) {
          setChatId(currentChatId);
          loadCheckpoints(currentChatId);
        }
      }
    });

    // Listen for storage changes in case content script adds one while popup is open
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (chatId && changes[`chatpoints_${chatId}`]) {
        setCheckpoints(changes[`chatpoints_${chatId}`].newValue || []);
      }
    };
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, [chatId]);

  const loadCheckpoints = (id: string) => {
    chrome.storage.local.get([`chatpoints_${id}`], (result: { [key: string]: Checkpoint[] }) => {
      setCheckpoints(result[`chatpoints_${id}`] || []);
    });
  };

  const jumpToCheckpoint = (checkpoint: Checkpoint) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const tabId = tabs[0]?.id;
      if (tabId) {
        chrome.tabs.sendMessage(tabId, { action: 'JUMP_TO_CHECKPOINT', checkpoint });
      }
    });
  };

  const removeCheckpoint = (idToRemove: string) => {
    if (!chatId) return;
    const updated = checkpoints.filter((cp) => cp.id !== idToRemove);
    setCheckpoints(updated);
    chrome.storage.local.set({ [`chatpoints_${chatId}`]: updated });
  };

  return (
    <div className="w-80 min-h-[400px] bg-slate-950 text-slate-200 font-sans p-4 flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <MapPin size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-lg leading-none tracking-tight">ChatPoint</h1>
          <p className="text-xs text-slate-400 mt-1">AI Context Anchors</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10 flex flex-col">
        {!chatId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
            <MessageCircle className="w-12 h-12 mb-3 text-slate-500 stroke-[1.5]" />
            <p className="text-sm">Navigate to a ChatGPT or Gemini chat to manage checkpoints.</p>
          </div>
        ) : checkpoints.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
            <Bookmark className="w-10 h-10 mb-3 text-slate-500 stroke-[1.5]" />
            <p className="text-sm">No checkpoints yet.</p>
            <p className="text-xs text-slate-400 mt-2">Use the <span className="text-indigo-400">Add Checkpoint</span> button in the chat to create one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
            {checkpoints.map((cp) => (
              <div 
                key={cp.id}
                className="group flex flex-col p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-md cursor-pointer relative overflow-hidden"
                onClick={() => jumpToCheckpoint(cp)}
              >
                {/* Accent line on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start gap-2">
                  <span className="font-medium text-sm text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-relaxed">
                    {cp.title}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeCheckpoint(cp.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all shrink-0"
                    title="Remove Checkpoint"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2 opacity-50 text-[10px] uppercase font-semibold tracking-wider">
                  <span>{new Date(cp.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
