import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Material } from '../../types'

interface MaterialCardProps {
  material: Material
  isSelected: boolean
  onSelect: (id: string) => void
}

export function MaterialCard({ material, isSelected, onSelect }: MaterialCardProps) {
  const displayTags = material.tags.slice(0, 3)
  const remainingCount = material.tags.length - 3

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-surface-container-low border transition-all duration-300 group',
        'aspect-2/3',
        isSelected
          ? 'border-primary-container shadow-[0_0_20px_rgba(0,242,255,0.15)]'
          : 'border-outline-variant/50 hover:border-primary-container hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:-translate-y-1'
      )}
    >
      <div className='absolute inset-0'>
        <div className='w-full h-full group-hover:scale-110 transition-transform duration-700 overflow-hidden'>
          {material.type === 'video' ? (
            <video src={material.url} className='w-full h-full object-cover' muted />
          ) : (
            <img
              src={material.url}
              alt={material.filename}
              className='w-full h-full object-cover'
            />
          )}
        </div>
      </div>

      <div className='absolute inset-0 bg-linear-to-t from-surface via-surface/20 to-transparent' />

      <button
        type='button'
        className={cn(
          'absolute top-3 left-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
          isSelected
            ? 'bg-primary-container border-primary-container'
            : 'border-on-surface/30 bg-surface/20 opacity-0 group-hover:opacity-100'
        )}
        onClick={e => {
          e.stopPropagation()
          onSelect(material.id)
        }}
      >
        {isSelected && <Check className='w-3 h-3 text-on-primary' />}
      </button>

      <div className='absolute bottom-0 p-3 w-full'>
        <h3 className='font-medium text-sm text-on-surface truncate'>{material.filename}</h3>
        <div className='flex flex-wrap gap-1.5 mt-2'>
          {displayTags.map(tag => (
            <span
              key={tag}
              className='text-[10px] font-bold px-2 py-1 rounded uppercase bg-primary-container/20 backdrop-blur-md text-primary-container border border-primary-container/30'
            >
              {tag}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className='text-[10px] font-bold px-2 py-1 rounded uppercase bg-secondary-container/20 backdrop-blur-md text-secondary border border-secondary-container/30'>
              +{remainingCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
