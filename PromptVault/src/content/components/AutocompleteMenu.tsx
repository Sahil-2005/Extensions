import { useEffect, useRef } from 'react'
import { TriggerPrompt } from '../../types'
import { cn } from '../../lib/utils'

interface AutocompleteMenuProps {
  prompts: TriggerPrompt[]
  selectedIndex: number
  position: { top: number; left: number }
  onSelect: (prompt: TriggerPrompt) => void
  onClose: () => void
}

export function AutocompleteMenu({ prompts, selectedIndex, position, onSelect, onClose }: AutocompleteMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Scroll active item into view
  useEffect(() => {
    const activeItem = menuRef.current?.children[selectedIndex] as HTMLElement
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  if (prompts.length === 0) return null

  return (
    <div
      ref={menuRef}
      className="fixed z-[2147483647] w-64 max-h-60 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-100"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {prompts.map((prompt, index) => (
        <button
          key={prompt.id}
          className={cn(
            "w-full flex items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors",
            index === selectedIndex
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
          )}
          onClick={() => onSelect(prompt)}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-500">
            /
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium truncate">{prompt.trigger.replace(/^\//, '')}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-50">{prompt.title}</span>
            </div>
            <div className="text-xs text-zinc-500 truncate opacity-75">{prompt.content}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
