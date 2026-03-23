import { ArrowLeft, Image, Type, Video } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import type { ToolType } from '../types'

interface ToolCard {
  id: string
  type: ToolType
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const tools: ToolCard[] = [
  {
    id: 'text',
    type: 'text',
    title: '营销文案',
    description: 'AI 生成商品文案、广告语、种草内容等',
    icon: Type,
  },
  {
    id: 'image',
    type: 'image',
    title: '海报创作',
    description: '输入描述生成精美图片，支持多比例',
    icon: Image,
  },
  {
    id: 'video',
    type: 'video',
    title: 'AI 视频',
    description: '文本转视频，支持首尾帧与镜头控制',
    icon: Video,
  },
]

function ToolItem({ tool, onSelect }: { tool: ToolCard; onSelect: (t: ToolType) => void }) {
  const Icon = tool.icon

  return (
    <Card
      onClick={() => onSelect(tool.type)}
      className='group relative w-full h-65 p-7 cursor-pointer transition-all duration-300
                 bg-background/40 backdrop-blur-xl border border-border/40
                 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10
                 hover:-translate-y-1 rounded-2xl overflow-hidden'
    >
      <div
        className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                      bg-linear-to-br from-primary/10 via-transparent to-transparent'
      />

      <div className='relative z-10 flex flex-col h-full items-center text-left'>
        <div
          className='w-20 h-20 rounded-2xl flex items-center justify-center
                        bg-primary/10 mb-8 mt-2 group-hover:scale-110 transition-transform'
        >
          <Icon className='w-10 h-10 text-primary' />
        </div>

        <div className='mt-auto w-full'>
          <h3 className='text-lg font-semibold text-foreground mb-2'>{tool.title}</h3>

          <p className='text-sm text-muted-foreground leading-relaxed line-clamp-2'>
            {tool.description}
          </p>
        </div>

        <div className='w-full pt-6 opacity-0 group-hover:opacity-100 transition-opacity'>
          <div className='h-0.5 w-full bg-linear-to-br from-transparent via-primary/40 to-transparent' />
        </div>
      </div>
    </Card>
  )
}

export function ToolSelector({ onSelect }: { onSelect: (tool: ToolType) => void }) {
  return (
    <div className='w-full max-w-7xl mx-auto px-6 py-10'>
      <div
        className='grid gap-8
                   grid-cols-1
                   sm:grid-cols-2
                   md:grid-cols-3
                   lg:grid-cols-4
                   xl:grid-cols-5'
      >
        {tools.map(tool => (
          <ToolItem key={tool.id} tool={tool} onSelect={onSelect} />
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
      <Button
        variant='ghost'
        size='icon'
        onClick={onBack}
        className='w-10 h-10 rounded-xl border border-border/40 bg-background/50 backdrop-blur hover:bg-accent'
      >
        <ArrowLeft className='w-5 h-5' />
      </Button>

      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10'>
          <Icon className='w-5 h-5 text-primary' />
        </div>
        <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
      </div>
    </div>
  )
}

export { tools }
