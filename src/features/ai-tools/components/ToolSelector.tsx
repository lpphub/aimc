'use client'

import { ArrowLeft, Image, Type, Video } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'

type ToolType = 'text' | 'image' | 'video'

interface ToolCard {
  id: ToolType
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
}

const tools: ToolCard[] = [
  {
    id: 'text',
    title: '营销文案',
    description: 'AI 智能生成各类营销文案，包括产品介绍、推广语、社交媒体内容等',
    icon: Type,
    gradient: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  },
  {
    id: 'image',
    title: '海报创作',
    description: '输入创意描述，AI 生成精美海报图片，支持多种画幅比例',
    icon: Image,
    gradient: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  },
  {
    id: 'video',
    title: 'AI 视频',
    description: '文字描述转化为动态视频，支持首尾帧拼接，生成专业级影片',
    icon: Video,
    gradient: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
  },
]

interface ToolSelectorProps {
  onSelect: (tool: ToolType) => void
}

export function ToolSelector({ onSelect }: ToolSelectorProps) {
  return (
    <div className='flex justify-center px-8'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl'>
        {tools.map(tool => {
          const Icon = tool.icon
          return (
            <Card
              key={tool.id}
              className={`group relative bg-gradient-to-br ${tool.gradient} backdrop-blur-sm border-border/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden w-60`}
              onClick={() => onSelect(tool.id)}
            >
              <div className='p-5'>
                <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                  <Icon className='w-6 h-6 text-foreground' />
                </div>
                <h3 className='text-lg font-semibold text-foreground mb-2'>{tool.title}</h3>
                <p className='text-xs text-muted-foreground leading-relaxed'>{tool.description}</p>
              </div>
              <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
            </Card>
          )
        })}
      </div>
    </div>
  )
}

interface ToolHeaderProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  onBack: () => void
}

export function ToolHeader({ title, icon: Icon, onBack }: ToolHeaderProps) {
  return (
    <div className='flex items-center gap-4 mb-6'>
      <Button
        variant='ghost'
        size='icon'
        onClick={onBack}
        className='w-10 h-10 rounded-lg bg-background/50 border border-border/30 hover:bg-accent'
      >
        <ArrowLeft className='w-5 h-5' />
      </Button>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center'>
          <Icon className='w-5 h-5 text-primary' />
        </div>
        <h1 className='text-2xl font-bold text-foreground tracking-tight'>{title}</h1>
      </div>
    </div>
  )
}

export { tools }
export type { ToolType }
