import { Calendar, Download, Eye, FileText, Image as ImageIcon, Video } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import type { CreationRecord } from '../types'

interface CreationRecordsProps {
  records: CreationRecord[]
}

const typeIcons = {
  copy: FileText,
  image: ImageIcon,
  video: Video,
  mixed: FileText,
}

const typeLabels = {
  copy: '文案',
  image: '图片',
  video: '视频',
  mixed: '图文',
}

export function CreationRecords({ records }: CreationRecordsProps) {
  if (records.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-full py-8'>
        <div className='w-12 h-12 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center mb-3'>
          <FileText className='w-6 h-6 text-gray-600' />
        </div>
        <p className='text-gray-500 text-sm'>暂无创作记录</p>
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {records.map(record => {
        const Icon = typeIcons[record.type]
        return (
          <Card
            key={record.id}
            className='p-4 bg-gray-800/30 border-gray-700/30 hover:border-purple-500/30 transition-colors'
          >
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center'>
                <Icon className='w-5 h-5 text-purple-400' />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='text-white font-medium truncate'>{record.title || '未命名'}</h4>
                <div className='flex items-center gap-2 mt-1'>
                  <Badge variant='outline' className='text-xs text-gray-400 border-gray-700'>
                    {typeLabels[record.type]}
                  </Badge>
                  <span className='text-xs text-gray-500 flex items-center gap-1'>
                    <Calendar className='w-3 h-3' />
                    {record.createdAt}
                  </span>
                </div>
              </div>
              <div className='flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-gray-400 hover:text-white'
                >
                  <Eye className='w-4 h-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-gray-400 hover:text-white'
                >
                  <Download className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
