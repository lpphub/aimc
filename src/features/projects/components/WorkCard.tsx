import { FileText, Image, ScanText, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import type { Work } from '../types'

interface WorkCardProps {
  work: Work
  onDelete?: (id: string) => void
}

const typeConfig = {
  text: { icon: FileText, label: '文本', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  image: {
    icon: Image,
    label: '图片',
    color: 'text-green-400 bg-green-500/10 border-green-500/30',
  },
  ocr: {
    icon: ScanText,
    label: 'OCR',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
}

export function WorkCard({ work, onDelete }: WorkCardProps) {
  const config = typeConfig[work.type]
  const Icon = config.icon

  return (
    <Card className='group relative bg-card border-border backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-border/50 hover:shadow-lg hover:shadow-primary/5'>
      <div className='aspect-square relative'>
        {work.type === 'image' && work.content ? (
          <img src={work.content} alt={work.prompt} className='w-full h-full object-cover' />
        ) : work.type === 'ocr' && work.content ? (
          <div className='w-full h-full flex items-center justify-center bg-muted/50 p-4'>
            <p className='text-xs text-muted-foreground line-clamp-6'>{work.content}</p>
          </div>
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-muted/50'>
            <Icon className='w-12 h-12 text-muted-foreground' />
          </div>
        )}

        <div className='absolute top-2 left-2'>
          <Badge className={cn(config.color, 'border')}>
            <Icon className='w-3 h-3 mr-1' />
            {config.label}
          </Badge>
        </div>

        <div className='absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => onDelete?.(work.id)}
            className='text-destructive hover:text-destructive hover:bg-destructive/20'
          >
            <Trash2 className='w-5 h-5' />
          </Button>
        </div>
      </div>

      <div className='p-3'>
        {work.projectName && (
          <p className='text-xs text-muted-foreground mb-1'>来自: {work.projectName}</p>
        )}
        <p className='text-sm text-on-surface-variant line-clamp-2'>{work.prompt}</p>
        <p className='text-xs text-on-surface-variant/60 mt-2'>
          {new Date(work.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Card>
  )
}
