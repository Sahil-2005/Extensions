import React, { useState } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { optimizePrompt } from '@/utils/gemini';
import { getSettings } from '@/utils/storage';

interface TuneButtonProps {
  inputElement: HTMLElement;
  site: string; // 'chatgpt' | 'claude' | 'gemini'
}

export const TuneButton: React.FC<TuneButtonProps> = ({ inputElement, site }) => {
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInputValue = (): string => {
    if (inputElement.tagName === 'TEXTAREA') {
        return (inputElement as HTMLTextAreaElement).value;
    }
    return inputElement.innerText || inputElement.textContent || '';
  };

  const setInputValue = (newValue: string) => {
    if (inputElement.tagName === 'TEXTAREA') {
        const textarea = inputElement as HTMLTextAreaElement;
        
        // React 16+ hack to trigger onChange
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(textarea, newValue);
        } else {
            textarea.value = newValue;
        }
        
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
        // ContentEditable
        inputElement.textContent = newValue; 
        // Some sites need focus/blur or specific input events
        inputElement.focus();
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        
        // For complex editors like ProseMirror, sometimes a simple sticking might fail, 
        // but often textContent + input event is enough for basic text.
        // If it fails, we might need to simulate typing or use clipboard paste.
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    
    // 1. Get Settings
    const settings = await getSettings();
    const apiKey = settings.apiKey;
    
    // Check if domain is enabled
    // Note: 'site' prop is 'chatgpt', 'claude', 'gemini'
    // Settings keys match these.
    // @ts-ignore
    if (settings.enabledDomains[site] === false) {
        return; // Or show disabled state
    }

    if (!apiKey) {
        setError('API Key missing');
        setTimeout(() => setError(null), 3000);
        return;
    }

    setLoading(true);
    
    try {
        // 2. Get Text
        const currentText = getInputValue();
        if (!currentText || currentText.trim().length < 3) {
            throw new Error('Prompt too short');
        }

        // 3. Optimize
        const optimizedText = await optimizePrompt(apiKey, currentText);
        
        // 4. Update
        setInputValue(optimizedText);

    } catch (err) {
        console.error('PromptTune Failed:', err);
        setError('Failed to tune');
        setTimeout(() => setError(null), 3000);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div 
        className="absolute bottom-2 right-2 z-50 flex items-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
    >
        {(showTooltip || error) && (
            <div className={cn(
                "absolute bottom-full right-0 mb-2 px-2 py-1 text-xs rounded shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-1",
                error ? "bg-red-600 text-white" : "bg-slate-800 text-white"
            )}>
                {error || "Refine Prompt"}
            </div>
        )}
      <button
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-sm transition-all duration-200 border",
          "bg-white hover:bg-slate-50 border-slate-200 text-slate-700",
          "hover:shadow-md hover:border-slate-300 active:scale-95",
          loading && "opacity-75 cursor-wait",
          error && "border-red-300 bg-red-50 text-red-600"
        )}
        style={{ fontFamily: 'sans-serif' }}
      >
        {error ? <AlertTriangle size={14} /> : <Sparkles 
          size={14} 
          className={cn(
            "text-blue-600",
            loading && "animate-spin"
          )} 
          fill="currentColor"
        />}
        <span className="text-xs font-semibold tracking-wide">
          {loading ? 'Tuning...' : 'Tune'}
        </span>
      </button>
    </div>
  );
};
