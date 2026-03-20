import { Check } from 'lucide-react'
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
  const tagLabel = material.tags[0] || (isVideo ? '无背景' : '成品海报')
  const tagColorClass = isVideo
    ? 'bg-secondary-container/30 backdrop-blur-md text-secondary'
    : 'bg-primary-container/20 backdrop-blur-md text-primary-container'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-surface-container-low border transition-all duration-300 group cursor-pointer',
        'aspect-[3/4]',
        isSelected
          ? 'border-primary-container shadow-[0_0_20px_rgba(0,242,255,0.15)]'
          : 'border-outline-variant/50 hover:border-primary-container hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:-translate-y-1'
      )}
      onClick={() => onSelect(material.id)}
    >
      <div className='absolute inset-0'>
        <div className='w-full h-full group-hover:scale-110 transition-transform duration-700 overflow-hidden'>
          <MaterialContent material={material} />
        </div>
      </div>

      <div className='absolute inset-0 bg-linear-to-t from-surface via-surface/20 to-transparent' />

      <div className='absolute top-3 left-3'>
        <span className={cn('text-[10px] font-bold px-2 py-1 rounded uppercase', tagColorClass)}>
          {tagLabel}
        </span>
      </div>

      <div
        className={cn(
          'absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
          isSelected
            ? 'bg-primary-container border-primary-container'
            : 'border-on-surface/30 bg-surface/20 opacity-0 group-hover:opacity-100'
        )}
      >
        {isSelected && <Check className='w-3 h-3 text-on-primary' />}
      </div>

      <div className='absolute bottom-0 p-3 w-full'>
        <h3 className='font-medium text-sm text-on-surface truncate'>{material.filename}</h3>
        <p className='text-on-surface-variant text-xs mt-0.5'>
          {isVideo ? 'PNG • 透明背景' : '4K • 2小时前生成'}
        </p>
      </div>
    </div>
  )
}
