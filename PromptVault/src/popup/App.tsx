import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { promptStorage } from '../lib/storage'
import { TriggerPrompt, CreateTriggerPrompt } from '../types'
import { PromptList } from '../components/PromptList'
import { PromptEditor } from '../components/PromptEditor'
import { Button } from '../components/ui/Button'

function App() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
  const [prompts, setPrompts] = useState<TriggerPrompt[]>([])
  const [editingPrompt, setEditingPrompt] = useState<TriggerPrompt | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrompts()
  }, [])

  const loadPrompts = async () => {
    try {
      const data = await promptStorage.getAll()
      setPrompts(data)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data: CreateTriggerPrompt) => {
    if (view === 'edit' && editingPrompt) {
      await promptStorage.update(editingPrompt.id, data)
    } else {
      await promptStorage.add(data)
    }
    await loadPrompts()
    setView('list')
    setEditingPrompt(undefined)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      await promptStorage.delete(id)
      await loadPrompts()
    }
  }

  const handleEdit = (prompt: TriggerPrompt) => {
    setEditingPrompt(prompt)
    setView('edit')
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-500">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 font-sans selection:bg-zinc-800 selection:text-zinc-100">
      {view === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">PromptVault</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Your prompt library</p>
            </div>
            <Button 
              size="sm" 
              className="bg-zinc-100 text-zinc-900 hover:bg-white"
              onClick={() => {
                setEditingPrompt(undefined)
                setView('create')
              }}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              New
            </Button>
          </div>

          <PromptList 
            prompts={prompts} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>
      )}

      {(view === 'create' || view === 'edit') && (
        <div className="h-[calc(100vh-2rem)]">
          <PromptEditor 
            initialData={editingPrompt} 
            onSave={handleSave} 
            onCancel={() => {
              setView('list')
              setEditingPrompt(undefined)
            }} 
          />
        </div>
      )}
    </div>
  )
}

export default App
