import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { getSettings, saveSettings, AppSettings, defaultSettings } from '@/utils/storage';
import { ExternalLink, Key, Zap } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedSettings = await getSettings();
      setSettings(storedSettings);
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleDomain = (domain: keyof AppSettings['enabledDomains']) => {
    setSettings(prev => ({
      ...prev,
      enabledDomains: {
        ...prev.enabledDomains,
        [domain]: !prev.enabledDomains[domain]
      }
    }));
  };

  if (loading) return <div className="p-4 flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="w-[350px] bg-white p-6 shadow-lg rounded-xl">
      <header className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Zap size={20} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">PromptTune</h1>
          <p className="text-xs text-slate-500">AI-Powered Prompt Optimizer</p>
        </div>
      </header>
      
      <div className="space-y-6">
        {/* API Key Section */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Key size={14} /> Gemini API Key
            </h2>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 hover:underline"
            >
              Get Key <ExternalLink size={10} />
            </a>
          </div>
          <Input 
            type="password" 
            placeholder="Enter your Gemini API Key" 
            value={settings.apiKey}
            onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
            className="font-mono text-xs"
          />
          <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
            Your key is stored locally in your browser and is never sent to our servers.
          </p>
        </section>

        {/* Enabled Domains Section */}
        <section>
          <h2 className="text-sm font-semibold text-slate-800 mb-3">Enabled Platforms</h2>
          <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <Switch 
              label="ChatGPT (chatgpt.com)" 
              checked={settings.enabledDomains.chatgpt}
              onChange={() => toggleDomain('chatgpt')}
            />
            <Switch 
              label="Claude (claude.ai)" 
              checked={settings.enabledDomains.claude}
              onChange={() => toggleDomain('claude')}
            />
            <Switch 
              label="Google Gemini (gemini.google.com)" 
              checked={settings.enabledDomains.gemini}
              onChange={() => toggleDomain('gemini')}
            />
          </div>
        </section>

        {/* Action Buttons */}
        <div className="pt-2">
          <Button 
            className="w-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]" 
            onClick={handleSave}
            disabled={!settings.apiKey}
          >
            {saved ? "Settings Saved! 🎉" : "Save Settings"}
          </Button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-[10px] text-slate-400">
           Version 1.0.0 • Built with ❤️
        </p>
      </div>
    </div>
  );
}
