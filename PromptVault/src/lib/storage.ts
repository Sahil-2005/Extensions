import { TriggerPrompt, CreateTriggerPrompt, UpdateTriggerPrompt } from '../types'

const STORAGE_KEY = 'promptVault_prompts'

const generateId = () => Math.random().toString(36).substring(2, 9)

class PromptStorage {
    async getAll(): Promise<TriggerPrompt[]> {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
                chrome.storage.sync.get([STORAGE_KEY], (result) => {
                    resolve(result[STORAGE_KEY] || [])
                })
            } else {
                // Fallback for local dev
                const data = localStorage.getItem(STORAGE_KEY)
                resolve(data ? JSON.parse(data) : [])
            }
        })
    }

    async add(prompt: CreateTriggerPrompt): Promise<TriggerPrompt> {
        const newPrompt: TriggerPrompt = {
            ...prompt,
            id: generateId(),
            updatedAt: Date.now(),
        }
        const current = await this.getAll()
        const updated = [newPrompt, ...current]
        await this.save(updated)
        return newPrompt
    }

    async update(id: string, updates: UpdateTriggerPrompt): Promise<TriggerPrompt | null> {
        const current = await this.getAll()
        const index = current.findIndex(p => p.id === id)
        if (index === -1) return null

        const updatedPrompt = {
            ...current[index],
            ...updates,
            updatedAt: Date.now(),
        }
        current[index] = updatedPrompt
        await this.save(current)
        return updatedPrompt
    }

    async delete(id: string): Promise<void> {
        const current = await this.getAll()
        const updated = current.filter(p => p.id !== id)
        await this.save(updated)
    }

    private async save(prompts: TriggerPrompt[]): Promise<void> {
        return new Promise((resolve) => {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
                chrome.storage.sync.set({ [STORAGE_KEY]: prompts }, resolve)
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
                resolve()
            }
        })
    }
}

export const promptStorage = new PromptStorage()
