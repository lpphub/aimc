import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Material } from '../../types'

interface MaterialCardProps {
  material: Material
  isSelected: boolean
  onSelect: (id: string) => void
}

function MaterialContent({ material }: { material: Material }) {
  return material.type === 'video' ? (
    <video src={material.url} className='w-full h-full object-cover' muted />
  ) : (
    <img src={material.url} alt={material.filename} className='w-full h-full object-cover' />
  )
}

export function MaterialCard({ material, isSelected, onSelect }: MaterialCardProps) {
  const isVideo = material.type === 'video'
  const tagLabel = material.tags[0] || (isVideo ? '无标签' : '成品渲染')
  const tagColor = isVideo ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'

  return (
    <div
      className={cn(
        'relative group rounded-lg overflow-hidden transition-all duration-200 bg-[#1a1f2e] border border-white/10',
        isSelected && 'ring-2 ring-cyan-400 border-cyan-400'
      )}
    >
      <div className='aspect-square bg-[#0f1419] relative'>
        <MaterialContent material={material} />

        <div className='absolute top-2 left-2'>
          <span className={cn('px-2 py-1 text-[10px] rounded-md font-medium', tagColor)}>
            {tagLabel}
          </span>
        </div>

        <button
          type='button'
          onClick={e => {
            e.stopPropagation()
            onSelect(material.id)
          }}
          className='absolute top-2 right-2 p-0.5 rounded-full cursor-pointer transition-all'
          aria-label={isSelected ? '取消选择' : '选择'}
        >
          {isSelected ? (
            <CheckCircle className='w-5 h-5 text-cyan-400 fill-cyan-400' />
          ) : (
            <div className='w-5 h-5 rounded-full border-2 border-white/30 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity' />
          )}
        </button>

        <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
      </div>

      <div className='p-3'>
        <p className='text-sm text-white font-medium truncate mb-1'>{material.filename}</p>
        <p className='text-xs text-gray-500'>
          {isVideo ? 'PNG' : '4K'} · {isVideo ? '已上传' : '2小时前生成'}
        </p>
      </div>
    </div>
  )
}
