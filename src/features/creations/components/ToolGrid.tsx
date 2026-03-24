import { ArrowLeft, ArrowRight, Image, ScanText, Type } from 'lucide-react'
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
    id: 'text',
    type: 'text',
    title: '营销文案',
    description: 'AI 生成商品文案、广告语、种草内容等',
    label: 'Ecommerce Insight',
    icon: Type,
    accent: 'primary',
  },
  {
    id: 'image',
    type: 'image',
    title: '海报创作',
    description: '输入描述生成精美图片，支持多比例',
    label: 'Visual Core',
    icon: Image,
    accent: 'primary',
  },
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

const accentStyles = {
  primary: {
    cardBg: 'bg-[rgba(53,52,54,0.6)]',
    iconBg: 'bg-primary-container/20 group-hover:bg-primary-container',
    iconText: 'text-primary-container group-hover:text-on-primary',
    labelText: 'text-primary-fixed-dim',
    arrowText: 'text-primary',
    borderT: 'border-primary-container/20',
    hoverShadow: 'hover:shadow-[0_0_20px_rgba(0,242,255,0.15)]',
    decorText: 'text-primary-container',
  },
  secondary: {
    cardBg: 'bg-[rgba(53,52,54,0.6)]',
    iconBg: 'bg-secondary-container/20 group-hover:bg-secondary-container',
    iconText: 'text-secondary group-hover:text-white',
    labelText: 'text-secondary',
    arrowText: 'text-secondary',
    borderT: 'border-secondary-container/20',
    hoverShadow: 'hover:shadow-[0_0_20px_rgba(208,188,255,0.15)]',
    decorText: 'text-secondary-container',
  },
}

function ToolCardItem({ tool, onSelect }: { tool: ToolCardDef; onSelect: (t: ToolType) => void }) {
  const Icon = tool.icon
  const s = accentStyles[tool.accent]

  return (
    <button
      type='button'
      onClick={() => onSelect(tool.type)}
      className={cn(
        'group relative h-80 p-8 rounded-xl cursor-pointer overflow-hidden',
        'flex flex-col justify-between text-left',
        'backdrop-blur-xl border-t border-transparent',
        'transition-all duration-500',
        s.cardBg,
        s.borderT,
        s.hoverShadow
      )}
    >
      <div className='relative z-10'>
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center mb-6',
            'transition-colors duration-500',
            s.iconBg
          )}
        >
          <Icon className={cn('transition-colors duration-500', s.iconText)} />
        </div>

        <h3 className='text-2xl font-headline font-semibold text-white mb-3 tracking-tight'>
          {tool.title}
        </h3>
        <p className='text-on-surface-variant text-sm leading-relaxed'>{tool.description}</p>
      </div>

      <div className='flex items-center justify-between mt-auto relative z-10'>
        <span className={cn('text-[10px] uppercase tracking-widest', s.labelText)}>
          {tool.label}
        </span>
        <ArrowRight
          className={cn('w-5 h-5 transition-all group-hover:translate-x-2', s.arrowText)}
        />
      </div>

      <div
        className={cn(
          'absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10',
          'transition-opacity pointer-events-none',
          s.decorText
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
        className='w-10 h-10 rounded-xl flex items-center justify-center border border-border/40 bg-background/50 backdrop-blur hover:bg-accent transition-colors'
      >
        <ArrowLeft className='w-5 h-5' />
      </button>

      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-xl flex items-center justify-center bg-primary-container/20'>
          <Icon className='w-5 h-5 text-primary-container' />
        </div>
        <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
      </div>
    </div>
  )
}

export { tools }
