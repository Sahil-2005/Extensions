import { TriggerPrompt } from '../types'
import { Button } from './ui/Button'
import { Edit2, Trash2, Zap } from 'lucide-react'

interface PromptListProps {
  prompts: TriggerPrompt[]
  onEdit: (prompt: TriggerPrompt) => void
  onDelete: (id: string) => void
}

export function PromptList({ prompts, onEdit, onDelete }: PromptListProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
          <Zap className="h-8 w-8 text-zinc-500" />
        </div>
        <h3 className="text-zinc-200 font-medium mb-1">No prompts saved yet</h3>
        <p className="text-zinc-500 text-sm">Create your first prompt to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 pb-20">
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="group relative flex flex-col gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-zinc-200">{prompt.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400 font-mono">
                  {prompt.trigger}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-zinc-100"
                onClick={() => onEdit(prompt)}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-red-400 hover:bg-red-950/30"
                onClick={() => onDelete(prompt.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {prompt.content}
          </p>
        </div>
      ))}
    </div>
  )
}
