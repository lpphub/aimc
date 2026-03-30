import { ArrowLeft, ArrowRight, ScanText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToolType } from '../types'

interface ToolCardDef {
  id: string
  type: ToolType
  title: string
  description: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  accent: 'primary' | 'secondary'
}

const tools: ToolCardDef[] = [
  {
    id: 'ocr',
    type: 'ocr',
    title: '图片文字提取',
    description: '精准识别并提取素材文字',
    label: 'Data Perception',
    icon: ScanText,
    accent: 'secondary',
  },
]

const accentColors = {
  primary: {
    iconBg: 'bg-primary/20 group-hover:bg-primary',
    iconText: 'text-primary group-hover:text-primary-foreground',
    accent: 'text-primary',
    border: 'border-primary/20',
    decor: 'text-primary',
  },
  secondary: {
    iconBg: 'bg-secondary-container/20 group-hover:bg-secondary-container',
    iconText: 'text-secondary group-hover:text-secondary-foreground',
    accent: 'text-secondary',
    border: 'border-secondary-container/20',
    decor: 'text-secondary-container',
  },
} as const

function ToolCardItem({ tool, onSelect }: { tool: ToolCardDef; onSelect: (t: ToolType) => void }) {
  const Icon = tool.icon
  const c = accentColors[tool.accent]

  return (
    <button
      type='button'
      onClick={() => onSelect(tool.type)}
      className={cn(
        'group relative h-80 p-8 rounded-xl cursor-pointer overflow-hidden',
        'flex flex-col justify-between text-left',
        'backdrop-blur-xl border-t border-transparent',
        'transition-all duration-500',
        'bg-surface-container-high/60 hover:shadow-glow-primary-sm',
        c.border
      )}
    >
      <div className='relative z-10'>
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center mb-6',
            'transition-colors duration-500',
            c.iconBg
          )}
        >
          <Icon className={cn('transition-colors duration-500', c.iconText)} />
        </div>

        <h3 className='text-2xl font-sans font-semibold text-foreground mb-3 tracking-tight'>
          {tool.title}
        </h3>
        <p className='text-muted-foreground text-sm leading-relaxed'>{tool.description}</p>
      </div>

      <div className='flex items-center justify-between mt-auto relative z-10'>
        <span className={cn('text-[10px] uppercase tracking-widest', c.accent)}>{tool.label}</span>
        <ArrowRight className={cn('w-5 h-5 transition-all group-hover:translate-x-2', c.accent)} />
      </div>

      <div
        className={cn(
          'absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10',
          'transition-opacity pointer-events-none',
          c.decor
        )}
      >
        <Icon className='w-40 h-40' />
      </div>
    </button>
  )
}

export function ToolGrid({ onSelect }: { onSelect: (tool: ToolType) => void }) {
  return (
    <div className='w-full px-6 py-10'>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
        {tools.map(tool => (
          <ToolCardItem key={tool.id} tool={tool} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

export function ToolHeader({
  title,
  icon: Icon,
  onBack,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  onBack: () => void
}) {
  return (
    <div className='flex items-center gap-4 mb-8'>
      <button
        type='button'
        onClick={onBack}
        className='w-10 h-10 rounded-xl flex items-center justify-center border border-border/40 bg-background/50 backdrop-blur hover:bg-muted transition-colors'
      >
        <ArrowLeft className='w-5 h-5' />
      </button>

      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-xl flex items-center justify-center bg-primary/20'>
          <Icon className='w-5 h-5 text-primary' />
        </div>
        <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
      </div>
    </div>
  )
}

export { tools }
