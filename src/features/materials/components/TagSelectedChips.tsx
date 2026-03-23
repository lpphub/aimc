import { X } from 'lucide-react'
import { useMemo } from 'react'
import type { Tag, TagGroup } from '../types'

interface TagSelectedChipsProps {
  selectedTags: Tag[]
  groups: TagGroup[]
  onRemoveTag: (tagId: number) => void
}

export function TagSelectedChips({ selectedTags, groups, onRemoveTag }: TagSelectedChipsProps) {
  const tagToGroupMap = useMemo(() => {
    const map = new Map<number, TagGroup>()
    for (const group of groups) {
      for (const tag of group.tags) {
        map.set(tag.id, group)
      }
    }
    return map
  }, [groups])

  if (selectedTags.length === 0) return null

  return (
    <div className='mt-4 pt-4 border-t border-outline-variant/10'>
      <div className='flex flex-wrap gap-2'>
        {selectedTags.map(tag => {
          const group = tagToGroupMap.get(tag.id)
          return (
            <span
              key={tag.id}
              className='inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container-high rounded-full text-sm text-on-surface'
            >
              {group?.name}: {tag.name}
              <button
                type='button'
                onClick={() => onRemoveTag(tag.id)}
                className='p-0.5 hover:bg-surface-container-highest rounded-full'
                aria-label={`移除标签 ${tag.name}`}
              >
                <X className='w-3 h-3' />
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}
