import { X } from 'lucide-react'
import type { Tag } from '../types'

interface TagSelectedChipsProps {
  selectedTags: Tag[]
  onRemoveTag: (tagId: number) => void
}

export function TagSelectedChips({ selectedTags, onRemoveTag }: TagSelectedChipsProps) {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <span className='text-xs text-muted-foreground mr-2'>已选择:</span>
      {selectedTags.map(tag => (
        <div
          key={tag.id}
          className='flex items-center gap-1.5 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20'
        >
          {tag.name}
          <button
            type='button'
            onClick={() => onRemoveTag(tag.id)}
            className='hover:text-foreground transition-colors'
          >
            <X className='w-3 h-3' />
          </button>
        </div>
      ))}
    </div>
  )
}
