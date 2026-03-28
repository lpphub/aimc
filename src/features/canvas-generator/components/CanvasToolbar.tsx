import { Hand, MousePointer2 } from 'lucide-react'
import { useState } from 'react'

type Tool = 'select' | 'hand'

export function CanvasToolbar() {
  const [activeTool, setActiveTool] = useState<Tool>('select')

  return (
    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-1.5 bg-card rounded-lg border border-border shadow-elevation'>
      <button
        type='button'
        onClick={() => setActiveTool('select')}
        className={`p-2 rounded transition-colors ${
          activeTool === 'select'
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-surface-container-high text-foreground'
        }`}
        title='选择工具'
      >
        <MousePointer2 className='w-5 h-5' />
      </button>

      <div className='w-px h-5 bg-border mx-1' />

      <button
        type='button'
        onClick={() => setActiveTool('hand')}
        className={`p-2 rounded transition-colors ${
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
