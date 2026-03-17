import { Film, Image, Play, Plus, Trash2, Upload } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'

interface Material {
  id: string
  type: 'image' | 'video'
  name: string
  content: string
  createdAt: string
}

interface MaterialsTabProps {
  materials: Material[]
  onUpload: () => void
  onDelete: (id: string) => void
}

const typeConfig = {
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

export function MaterialsTab({ materials, onUpload, onDelete }: MaterialsTabProps) {
  return (
    <div className='h-full flex flex-col'>
      <div className='flex items-center justify-between mb-4'>
        <div></div>

        <Button
          onClick={onUpload}
          className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600'
        >
          <Upload className='w-4 h-4 mr-2' />
          上传素材
        </Button>
      </div>

      {materials.length > 0 ? (
        <div className='flex-1 overflow-auto'>
          <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3'>
            {materials.map(material => {
              const config = typeConfig[material.type as keyof typeof typeConfig]
              if (!config) return null
              const Icon = config.icon

              return (
                <Card
                  key={material.id}
                  className='group relative bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-700/30 backdrop-blur-md rounded-lg overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20'
                >
                  <div className='aspect-square relative'>
                    {material.type === 'image' && material.content ? (
                      <div className='relative w-full aspect-square'>
                        <img
                          src={material.content}
                          alt={material.name}
                          className='w-full h-full object-cover rounded-t-lg'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
                      </div>
                    ) : (
                      <div className='relative w-full aspect-square'>
                        <video
                          src={material.content}
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
                        onClick={() => onDelete(material.id)}
                        className='text-red-400 hover:text-red-300 hover:bg-red-500/20'
                      >
                        <Trash2 className='w-5 h-5' />
                      </Button>
                    </div>
                  </div>

                  <div className='p-3'>
                    <p className='text-sm text-gray-300 truncate'>{material.name}</p>
                    <p className='text-xs text-gray-600 mt-1'>
                      {new Date(material.createdAt).toLocaleDateString()}
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
            <p className='text-gray-500'>暂无素材</p>
            <p className='text-gray-600 text-sm mt-1'>点击上传添加素材</p>
          </div>
        </div>
      )}
    </div>
  )
}
