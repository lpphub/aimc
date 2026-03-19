import { FileText, Image as ImageIcon, Video } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import type { Template } from '../types'

interface PresetMaterialsProps {
  templates: Template[]
}

const typeIcons = {
  copy: FileText,
  image: ImageIcon,
  video: Video,
}

const typeLabels = {
  copy: '文案',
  image: '图片',
  video: '视频',
}

export function PresetMaterials({ templates }: PresetMaterialsProps) {
  if (templates.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-full py-8'>
        <div className='w-12 h-12 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center mb-3'>
          <FileText className='w-6 h-6 text-muted-foreground' />
        </div>
        <p className='text-muted-foreground text-sm'>暂无预设素材</p>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {templates.map(template => {
        const Icon = typeIcons[template.type]
        return (
          <Card
            key={template.id}
            className='p-4 bg-muted/30 border-border/30 hover:border-primary/30 transition-colors cursor-pointer'
          >
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center'>
                <Icon className='w-5 h-5 text-cyan-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='text-foreground font-medium truncate'>{template.name}</h4>
                <Badge
                  variant='outline'
                  className='mt-1 text-xs text-muted-foreground border-border'
                >
                  {typeLabels[template.type]}
                </Badge>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
