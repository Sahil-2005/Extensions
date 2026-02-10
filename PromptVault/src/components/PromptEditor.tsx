import { useState, useEffect } from 'react'
import { TriggerPrompt, CreateTriggerPrompt } from '../types'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { ArrowLeft } from 'lucide-react'

interface PromptEditorProps {
  initialData?: TriggerPrompt
  onSave: (data: CreateTriggerPrompt) => Promise<void>
  onCancel: () => void
}

export function PromptEditor({ initialData, onSave, onCancel }: PromptEditorProps) {
  const [formData, setFormData] = useState<CreateTriggerPrompt>({
    title: '',
    trigger: '/',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        trigger: initialData.trigger,
        content: initialData.content
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) return

    setIsSubmitting(true)
    try {
      await onSave(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof CreateTriggerPrompt, value: string) => {
    setFormData((prev: CreateTriggerPrompt) => ({ ...prev, [field]: value }))
  }

  // Auto-prefix trigger with / if missing
  const handleTriggerBlur = () => {
    if (formData.trigger && !formData.trigger.startsWith('/')) {
      handleChange('trigger', '/' + formData.trigger)
    }
  }

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={onCancel} className="-ml-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-zinc-100">
          {initialData ? 'Edit Prompt' : 'New Prompt'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Title</label>
          <Input
            placeholder="e.g. Code Review"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="bg-zinc-900 border-zinc-800 focus:border-zinc-700"
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400">Trigger</label>
          <Input
            placeholder="/review"
            value={formData.trigger}
            onChange={(e) => handleChange('trigger', e.target.value)}
            onBlur={handleTriggerBlur}
            className="bg-zinc-900 border-zinc-800 focus:border-zinc-700 font-mono"
          />
        </div>

        <div className="space-y-1.5 flex-1 flex flex-col">
          <label className="text-xs font-medium text-zinc-400">Content</label>
          <textarea
            className="flex-1 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 text-zinc-200 resize-none"
            placeholder="Enter the prompt content here..."
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-white"
            isLoading={isSubmitting}
          >
            {initialData ? 'Save Changes' : 'Create Prompt'}
          </Button>
        </div>
      </form>
    </div>
  )
}
