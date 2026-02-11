import { Zap, X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface FloatingButtonProps {
  position: { top: number; left: number }
  onClick: () => void
  isOpen: boolean
}

export function FloatingButton({ position, onClick, isOpen }: FloatingButtonProps) {
  return (
    <button
      className={cn(
        "fixed z-50 flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-all duration-200 ease-in-out",
        isOpen 
          ? "bg-zinc-800 text-zinc-100 rotate-90" 
          : "bg-background/80 backdrop-blur-sm text-primary border border-primary/20 hover:bg-primary/10 hover:scale-110"
      )}
      style={{
        top: position.top,
        left: position.left,
        transform: `translate(-100%, -100%) ${isOpen ? 'rotate(90deg)' : ''}` 
      }}
      onClick={onClick}
    >
      {isOpen ? <X className="h-4 w-4" /> : <Zap className="h-4 w-4 fill-current" />}
    </button>
  )
}
