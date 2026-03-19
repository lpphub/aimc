import { CheckCircle, FileImage, FileVideo } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Material } from '../../types'

interface MaterialCardProps {
  material: Material
  isSelected: boolean
  onSelect: (id: string) => void
}

const MAX_VISIBLE_TAGS = 3

function MaterialContent({ material }: { material: Material }) {
  return material.type === 'video' ? (
    <video src={material.url} className='w-full h-full object-cover' muted />
  ) : (
    <img src={material.url} alt={material.filename} className='w-full h-full object-cover' />
  )
}

function TagsList({ tags }: { tags: string[] }) {
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS)
  const remainingCount = tags.length - MAX_VISIBLE_TAGS

  return (
    <div className='flex flex-wrap gap-0.5 mt-1'>
      {visibleTags.map(tag => (
        <span key={tag} className='px-1 py-0.5 text-[10px] bg-muted text-muted-foreground rounded'>
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className='px-1 py-0.5 text-[10px] text-muted-foreground/50'>+{remainingCount}</span>
      )}
    </div>
  )
}

export function MaterialCard({ material, isSelected, onSelect }: MaterialCardProps) {
  const isVideo = material.type === 'video'
  const Icon = isVideo ? FileVideo : FileImage
  const iconColor = isVideo ? 'text-purple-500' : 'text-blue-500'

  return (
    <div
      className={cn(
        'relative group rounded-md overflow-hidden transition-all duration-200',
        isSelected && 'ring-1 ring-primary border border-primary'
      )}
    >
      <div className='aspect-square bg-card/50'>
        <MaterialContent material={material} />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />

        <button
          type='button'
          onClick={e => {
            e.stopPropagation()
            onSelect(material.id)
          }}
          className='absolute top-1.5 left-1.5 p-0.5 rounded-full cursor-pointer hover:bg-accent/50 transition-colors'
          aria-label={isSelected ? '取消选择' : '选择'}
        >
          {isSelected ? (
            <CheckCircle className='w-5 h-5 text-primary fill-primary/20' />
          ) : (
            <div className='w-5 h-5 rounded-full border border-border bg-card/50 opacity-0 group-hover:opacity-100 transition-opacity' />
          )}
        </button>
      </div>

      <div className='p-3'>
        <div className='flex items-center gap-1.5'>
          <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
          <p className='text-sm text-foreground truncate'>{material.filename}</p>
        </div>
        {material.tags.length > 0 && <TagsList tags={material.tags} />}
      </div>
    </div>
  )
}
