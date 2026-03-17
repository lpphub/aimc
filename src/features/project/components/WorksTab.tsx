import { FileText, Film, Image, Play, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Work } from '@/features/portfolio/types'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'

interface WorksTabProps {
  works: Work[]
  onDelete: (id: string) => void
}

const typeConfig = {
  text: { icon: FileText, label: '文本', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  image: {
    icon: Image,
    label: '图片',
    color: 'text-green-400 bg-green-500/10 border-green-500/30',
  },
  video: {
    icon: Film,
    label: '视频',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
}

export function WorksTab({ works, onDelete }: WorksTabProps) {
  const navigate = useNavigate()

  return (
    <div className='h-full flex flex-col'>
      <div className='flex items-center justify-between mb-4'>
        <span className='text-sm text-gray-500'>{works.length} 个作品</span>
        <Button
          onClick={() => navigate('/tools')}
          className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600'
        >
          <Plus className='w-4 h-4 mr-2' />
          AI绘
        </Button>
      </div>

      {works.length > 0 ? (
        <div className='flex-1 overflow-auto'>
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3'>
            {works.map(work => {
              const config = typeConfig[work.type]
              const Icon = config.icon

              return (
                <Card
                  key={work.id}
                  className='group relative bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-700/30 backdrop-blur-md rounded-lg overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20'
                >
                  <div className='aspect-square relative'>
                    {work.type === 'image' && work.content ? (
                      <div className='relative w-full aspect-square'>
                        <img
                          src={work.content}
                          alt={work.prompt}
                          className='w-full h-full object-cover rounded-t-lg'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
                      </div>
                    ) : work.type === 'video' && work.content ? (
                      <div className='relative w-full aspect-square'>
                        <video
                          src={work.content}
                          className='w-full h-full object-cover rounded-t-lg'
                          muted
                        />
                        <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
                          <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                            <Play className='w-6 h-6 text-white ml-1' />
                          </div>
                        </div>
                        <div className='absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white'>
                          视频
                        </div>
                      </div>
                    ) : (
                      <div className='w-full aspect-square relative bg-gradient-to-br from-gray-800/50 to-gray-900/50'>
                        <div
                          className='absolute inset-0 opacity-10'
                          style={{
                            backgroundImage:
                              'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                            backgroundSize: '8px 8px',
                          }}
                        />
                        <div className='absolute inset-0 flex items-center justify-center p-4'>
                          <FileText className='w-12 h-12 text-blue-400/50' />
                        </div>
                      </div>
                    )}

                    <div className='absolute top-2 left-2'>
                      <Badge className={`${config.color} border`}>
                        <Icon className='w-3 h-3 mr-1' />
                        {config.label}
                      </Badge>
                    </div>

                    <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onDelete(work.id)}
                        className='text-red-400 hover:text-red-300 hover:bg-red-500/20'
                      >
                        <Trash2 className='w-5 h-5' />
                      </Button>
                    </div>
                  </div>

                  <div className='p-3'>
                    <p className='text-sm text-gray-400 line-clamp-2'>{work.prompt}</p>
                    <p className='text-xs text-gray-600 mt-2'>
                      {new Date(work.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ) : (
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4'>
              <Plus className='w-8 h-8 text-gray-600' />
            </div>
            <p className='text-gray-500'>暂无作品</p>
            <p className='text-gray-600 text-sm mt-1'>使用AI工具创作并收藏你的作品</p>
          </div>
        </div>
      )}
    </div>
  )
}
