import { TriggerPrompt } from '../../types'
import { Zap } from 'lucide-react'

interface PopoverMenuProps {
  prompts: TriggerPrompt[]
  position: { top: number; left: number }
  onSelect: (content: string) => void
  onClose: () => void
}

export function PopoverMenu({ prompts, position, onSelect, onClose }: PopoverMenuProps) {
  return (
    <>
      {/* Backdrop to close on click outside */}
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={onClose}
      />
      
      <div 
        className="fixed z-50 w-64 max-h-80 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-xl animate-in slide-in-from-bottom-2 duration-200"
        style={{
          top: position.top,
          left: position.left,
          transform: 'translate(-100%, -100%)'
        }}
      >
        {prompts.length === 0 ? (
          <div className="p-3 text-center text-xs text-zinc-500">
            No prompts found. <br/> Add one in the extension popup.
          </div>
        ) : (
          <div className="space-y-0.5">
            {prompts.map(prompt => (
              <button
                key={prompt.id}
                className="w-full flex items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                onClick={() => onSelect(prompt.content)}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-zinc-900 border border-zinc-800">
                  <Zap className="h-3 w-3 text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{prompt.title}</div>
                  <div className="text-xs text-zinc-500 font-mono truncate">{prompt.trigger}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
