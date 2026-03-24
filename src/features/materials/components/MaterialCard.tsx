import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Material } from '../types'

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
        'relative overflow-hidden rounded-md bg-card border transition-all duration-300 group',
        'aspect-4/5',
        isSelected
          ? 'border-primary shadow-[0_0_15px_rgba(0,242,255,0.12)]'
          : 'border-border/50 hover:border-primary hover:shadow-[0_0_15px_rgba(0,242,255,0.12)]'
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
          'absolute top-1.5 left-1.5 w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-all',
          isSelected
            ? 'bg-primary border-primary'
            : 'border-foreground/30 bg-surface/20 opacity-0 group-hover:opacity-100'
        )}
        onClick={e => {
          e.stopPropagation()
          onSelect(material.id)
        }}
      >
        {isSelected && <Check className='w-2 h-2 text-primary-foreground' />}
      </button>

      <div className='absolute bottom-0 p-1.5 w-full'>
        <h3 className='font-medium text-[11px] text-foreground truncate'>{material.filename}</h3>
        <div className='flex flex-wrap gap-0.5 mt-0.5'>
          {displayTags.map(tag => (
            <span
              key={tag}
              className='text-[8px] font-bold px-1 py-px rounded-sm uppercase bg-primary/20 backdrop-blur-md text-primary border border-primary/30'
            >
              {tag}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className='text-[8px] font-bold px-1 py-px rounded-sm uppercase bg-secondary-container/20 backdrop-blur-md text-secondary border border-secondary-container/30'>
              +{remainingCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
