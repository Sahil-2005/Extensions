import { useEffect, useState } from 'react'
import { promptStorage } from '../lib/storage'
import { TriggerPrompt } from '../types'
import { FloatingButton } from './components/FloatingButton'
import { PopoverMenu } from './components/PopoverMenu'
import { AutocompleteMenu } from './components/AutocompleteMenu'

export default function ContentApp() {
  const [prompts, setPrompts] = useState<TriggerPrompt[]>([])
  const [activeInput, setActiveInput] = useState<HTMLElement | null>(null)
  
  useEffect(() => {
    console.log('[PromptVault] ContentApp Mounted')
  }, [])
  
  // Popover state
  const [menuOpen, setMenuOpen] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 })

  // Autocomplete state
  const [autocompleteOpen, setAutocompleteOpen] = useState(false)
  const [autocompleteQuery, setAutocompleteQuery] = useState('')
  const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0 })
  const [filteredPrompts, setFilteredPrompts] = useState<TriggerPrompt[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    loadPrompts()
    
    // Listen for storage changes
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
      if (area === 'sync' && changes.promptVault_prompts) {
        loadPrompts()
      }
    }
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.onChanged.addListener(handleStorageChange)
    }

    return () => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.onChanged.removeListener(handleStorageChange)
      }
    }
  }, [])

  const loadPrompts = async () => {
    const data = await promptStorage.getAll()
    console.log('[PromptVault] Loaded prompts:', data.length)
    setPrompts(data)
  }

  // Detect active input
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      // console.log('[PromptVault] Focus:', target.tagName, target.isContentEditable)
      if (isValidInput(target)) {
        console.log('[PromptVault] Valid input detected:', target)
        setActiveInput(target)
        updateButtonPosition(target)
      }
    }

    // Use specific selectors for AI platforms
    document.addEventListener('focusin', handleFocus)
    
    // Also check current active element on load
    if (document.activeElement && isValidInput(document.activeElement as HTMLElement)) {
      setActiveInput(document.activeElement as HTMLElement)
      updateButtonPosition(document.activeElement as HTMLElement)
    }

    // Observe resize of the input to update position
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === activeInput) {
          updateButtonPosition(entry.target as HTMLElement)
        }
      }
    })

    if (activeInput) {
      resizeObserver.observe(activeInput)
    }

    return () => {
      document.removeEventListener('focusin', handleFocus)
      resizeObserver.disconnect()
    }
  }, [activeInput])

  // Autocomplete Logic
  useEffect(() => {
    if (!activeInput) return

    const handleInput = (e: Event) => {
      // console.log('[PromptVault] Input event')
      const target = e.target as HTMLElement
      checkTrigger(target)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // console.log('[PromptVault] Keydown:', e.key)
      if (!autocompleteOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredPrompts.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredPrompts.length) % filteredPrompts.length)
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        if (filteredPrompts[selectedIndex]) {
          replaceTrigger(filteredPrompts[selectedIndex])
        }
      } else if (e.key === 'Escape') {
        setAutocompleteOpen(false)
      }
    }

    activeInput.addEventListener('input', handleInput)
    activeInput.addEventListener('keydown', handleKeyDown)

    return () => {
      activeInput.removeEventListener('input', handleInput)
      activeInput.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeInput, autocompleteOpen, filteredPrompts, selectedIndex])

  // Filter prompts when query changes
  useEffect(() => {
    if (autocompleteOpen) {
      const filtered = prompts.filter(p => 
        p.trigger.toLowerCase().startsWith(autocompleteQuery.toLowerCase())
      )
      setFilteredPrompts(filtered)
      setSelectedIndex(0)

      if (filtered.length === 0) {
        setAutocompleteOpen(false)
      }
    }
  }, [autocompleteQuery, autocompleteOpen, prompts])


  const isValidInput = (el: HTMLElement) => {
    return (
      el.tagName === 'TEXTAREA' ||
      el.tagName === 'INPUT' ||
      el.isContentEditable ||
      el.getAttribute('contenteditable') === 'true'
    )
  }

  const updateButtonPosition = (target: HTMLElement) => {
    const rect = target.getBoundingClientRect()
    setButtonPosition({
      top: rect.bottom + window.scrollY - 40, 
      left: rect.right + window.scrollX - 40
    })
  }

  const getCaretCoordinates = () => {
    let x = 0, y = 0
    const selection = window.getSelection()
    if (selection && selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange()
      range.collapse(true)
      const rect = range.getClientRects()[0]
      if (rect) {
        x = rect.left + window.scrollX
        y = rect.top + window.scrollY
      }
    }
    return { x, y }
  }

  const checkTrigger = (target: HTMLElement) => {
    let text = ''
    let cursorPosition = 0

    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
      const input = target as HTMLInputElement
      text = input.value
      cursorPosition = input.selectionStart || 0
    } else {
      // ContentEditable
      text = target.innerText || target.textContent || ''
      const selection = window.getSelection()
      if (selection) {
        // Approximate cursor position logic for contenteditable is complex
        // Simplification: just check the last word for now or full text
        // For MVP: Detect slash at the end or near cursor
        const range = selection.getRangeAt(0)
        const preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(target)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        cursorPosition = preCaretRange.toString().length
      }
    }

    // Find the last '/' before cursor
    const lastSlash = text.lastIndexOf('/', cursorPosition - 1)
    if (lastSlash !== -1) {
      // Extract logic: query is text between slash and cursor
      const query = text.substring(lastSlash, cursorPosition)
      console.log('[PromptVault] Potential trigger:', query)
      
      // Basic validation: no spaces allowed in trigger key
      if (!query.includes(' ')) {
        console.log('[PromptVault] Trigger matched:', query)
        setAutocompleteQuery(query) // e.g., "/re"
        setAutocompleteOpen(true)
        
        const coords = getCaretCoordinates()
        // If coords valid (sometimes 0,0 if hidden), use them, else fallback to button pos
        if (coords.x !== 0 && coords.y !== 0) {
            setAutocompletePosition({ top: coords.y - 10, left: coords.x }) // Show slightly above
        } else {
             // Fallback to active element rect
             const rect = target.getBoundingClientRect()
             setAutocompletePosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX })
        }
        return
      }
    }
    
    setAutocompleteOpen(false)
  }

  const injectPrompt = (content: string) => {
    if (!activeInput) return
    insertTextAtCursor(activeInput, content)
    setMenuOpen(false)
  }

  const replaceTrigger = (prompt: TriggerPrompt) => {
    if (!activeInput) return

    // We need to delete the trigger text first, then insert content
    // Length to delete = autocompleteQuery.length
    
    // 1. Delete trigger
    if (activeInput.tagName === 'TEXTAREA' || activeInput.tagName === 'INPUT') {
        const input = activeInput as HTMLInputElement
        const start = (input.selectionStart || 0) - autocompleteQuery.length
        const end = input.selectionEnd || 0
        const text = input.value
        const before = text.substring(0, start)
        const after = text.substring(end)
        
        const newText = before + prompt.content + after
        input.value = newText
        input.selectionStart = input.selectionEnd = start + prompt.content.length
        input.dispatchEvent(new Event('input', { bubbles: true }))
    } else {
        // ContentEditable: tricky to delete exact range
        // MVP Strategy: Select generic backwards X characters then replace
        const selection = window.getSelection()
        if (selection) {
            for (let i = 0; i < autocompleteQuery.length; i++) {
                document.execCommand('delete', false)
            }
            document.execCommand('insertText', false, prompt.content)
        }
    }

    setAutocompleteOpen(false)
    setAutocompleteQuery('')
  }

  const insertTextAtCursor = (target: HTMLElement, text: string) => {
    target.focus()
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        const input = target as HTMLInputElement
        const start = input.selectionStart || 0
        const end = input.selectionEnd || 0
        const val = input.value
        const before = val.substring(0, start)
        const after = val.substring(end)
        input.value = before + text + after
        input.selectionStart = input.selectionEnd = start + text.length
        input.dispatchEvent(new Event('input', { bubbles: true }))
    } else {
        document.execCommand('insertText', false, text)
    }
  }

  if (!activeInput) return null

  return (
    <div style={{ pointerEvents: 'auto' }}>
      <FloatingButton 
        position={buttonPosition}
        onClick={() => setMenuOpen(!menuOpen)}
        isOpen={menuOpen}
      />
      {menuOpen && (
        <PopoverMenu 
          prompts={prompts} 
          position={{ top: buttonPosition.top - 10, left: buttonPosition.left }}
          onSelect={injectPrompt}
          onClose={() => setMenuOpen(false)}
        />
      )}
      
      {autocompleteOpen && (
        <AutocompleteMenu 
          prompts={filteredPrompts}
          selectedIndex={selectedIndex}
          position={{ top: autocompletePosition.top - 10, left: autocompletePosition.left }} // Up 10px from cursor
          onSelect={replaceTrigger}
          onClose={() => setAutocompleteOpen(false)}
        />
      )}
    </div>
  )
}
