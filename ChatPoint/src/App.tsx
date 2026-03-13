import { useState, useEffect } from 'react';
import { Bookmark, MapPin, Trash2, MessageCircle } from 'lucide-react';

interface Checkpoint {
  id: string;
  title: string;
  description?: string;
  elementSelector?: string;
  scrollTop?: number;
  timestamp: number;
}

function App() {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

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
        setCheckpoints((changes[`chatpoints_${chatId}`].newValue as Checkpoint[]) || []);
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

  const startEditing = (cp: Checkpoint) => {
    setEditingId(cp.id);
    setEditValue(cp.title);
  };

  const saveEdit = () => {
    if (!chatId || !editingId) return;
    const updated = checkpoints.map((cp) => 
      cp.id === editingId ? { ...cp, title: editValue } : cp
    );
    setCheckpoints(updated);
    chrome.storage.local.set({ [`chatpoints_${chatId}`]: updated });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
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
                className={`group flex flex-col p-3 rounded-xl bg-white/5 border transition-all duration-300 backdrop-blur-md relative overflow-hidden ${
                  editingId === cp.id ? 'border-indigo-500 bg-white/10' : 'border-white/5 hover:border-indigo-500/30 hover:bg-white/10 cursor-pointer'
                }`}
                onClick={() => editingId !== cp.id && jumpToCheckpoint(cp)}
              >
                {/* Accent line on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start gap-2">
                  {editingId === cp.id ? (
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="w-full bg-slate-900 border border-indigo-500/50 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={saveEdit}
                          className="text-[10px] bg-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded font-bold text-white transition-colors"
                        >
                          SAVE
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded font-bold text-slate-300 transition-colors"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-sm text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1 leading-relaxed">
                        {cp.title}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={(e) => { e.stopPropagation(); startEditing(cp); }}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-md transition-all shrink-0"
                          title="Edit Name"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeCheckpoint(e.currentTarget.id); }}
                          id={cp.id}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all shrink-0"
                          title="Remove Checkpoint"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {cp.description && !editingId && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 italic border-l-2 border-indigo-500/20 pl-2">
                    "{cp.description}"
                  </p>
                )}
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
