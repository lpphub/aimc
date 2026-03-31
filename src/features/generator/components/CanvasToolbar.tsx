import { Hand, MousePointer2 } from 'lucide-react'
import { useState } from 'react'

type Tool = 'select' | 'hand'

interface CanvasToolbarProps {
  onToolChange?: (tool: Tool) => void
  zoom?: number
}

export function CanvasToolbar({ onToolChange, zoom = 1 }: CanvasToolbarProps) {
  const [activeTool, setActiveTool] = useState<Tool>('select')

  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool)
    onToolChange?.(tool)
  }

  const zoomPercentage = Math.round(zoom * 100)

  return (
    <div className='absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 p-2 bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-[0_0_40px_rgba(0,0,0,0.3)]'>
      <button
        type='button'
        onClick={() => handleToolChange('select')}
        className={`p-3 rounded-xl transition-all duration-200 ${
          activeTool === 'select'
            ? 'bg-primary/15 text-primary shadow-[0_0_20px_rgba(0,242,255,0.2)]'
            : 'hover:bg-surface-container-high text-muted-foreground hover:text-foreground'
        }`}
        title='选择工具'
      >
        <MousePointer2 className='w-5 h-5' />
      </button>

      <div className='w-5 h-px bg-border/50' />

      <button
        type='button'
        onClick={() => handleToolChange('hand')}
        className={`p-3 rounded-xl transition-all duration-200 ${
          activeTool === 'hand'
            ? 'bg-primary/15 text-primary shadow-[0_0_20px_rgba(0,242,255,0.2)]'
            : 'hover:bg-surface-container-high text-muted-foreground hover:text-foreground'
        }`}
        title='拖拽画布'
      >
        <Hand className='w-5 h-5' />
      </button>

      <div className='w-5 h-px bg-border/50' />

      <div className='text-xs text-muted-foreground font-mono'>{zoomPercentage}%</div>
    </div>
  )
}
