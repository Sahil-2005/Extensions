export interface TriggerPrompt {
    id: string
    title: string
    trigger: string
    content: string
    updatedAt: number
}

export type CreateTriggerPrompt = Omit<TriggerPrompt, 'id' | 'updatedAt'>
export type UpdateTriggerPrompt = Partial<CreateTriggerPrompt>
