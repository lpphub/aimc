import { Hand, MousePointer2 } from 'lucide-react'
import { useState } from 'react'

type Tool = 'select' | 'hand'

export function CanvasToolbar() {
  const [activeTool, setActiveTool] = useState<Tool>('select')

  return (
    <div className='absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 p-2 bg-card rounded-xl border border-border shadow-elevation'>
      <button
        type='button'
        onClick={() => setActiveTool('select')}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'select'
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-surface-container-high text-foreground'
        }`}
        title='选择工具'
      >
        <MousePointer2 className='w-5 h-5' />
      </button>

      <div className='w-5 h-px bg-border' />

      <button
        type='button'
        onClick={() => setActiveTool('hand')}
        className={`p-3 rounded-lg transition-colors ${
          activeTool === 'hand'
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-surface-container-high text-foreground'
        }`}
        title='拖拽画布'
      >
        <Hand className='w-5 h-5' />
      </button>
    </div>
  )
}
