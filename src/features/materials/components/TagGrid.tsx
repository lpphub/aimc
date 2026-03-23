import { Check, Circle, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Tag } from '../types'

interface TagGridProps {
  tags: Tag[]
  selectedTagIds: number[]
  isLoading: boolean
  onTagToggle: (tagId: number) => void
  onNewTagClick: () => void
  onDeleteTag: (tagId: number) => void
  onEditTag: (tagId: number, name: string) => void
}

export function TagGrid({
  tags,
  selectedTagIds,
  isLoading,
  onTagToggle,
  onNewTagClick,
  onDeleteTag,
  onEditTag,
}: TagGridProps) {
  const [menuOpenTagId, setMenuOpenTagId] = useState<number | null>(null)

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <span className='text-on-surface-variant text-sm'>加载中...</span>
      </div>
    )
  }

  const handleDeleteTag = (tagId: number) => {
    setMenuOpenTagId(null)
    onDeleteTag(tagId)
  }

  const handleEditTag = (tagId: number, name: string) => {
    setMenuOpenTagId(null)
    onEditTag(tagId, name)
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
      {tags.map(tag => {
        const isSelected = selectedTagIds.includes(tag.id)

        return (
          <div key={tag.id} className='relative group/tag'>
            <button
              type='button'
              onClick={() => onTagToggle(tag.id)}
              className={cn(
                'group flex flex-col items-start p-3 rounded-xl relative overflow-hidden transition-all w-full',
                isSelected
                  ? 'bg-primary-container/10 border border-primary-container/40 ring-1 ring-primary-container/20'
                  : 'bg-surface-container-high/40 border border-outline-variant/10 hover:bg-surface-container-high/80 hover:border-outline-variant/30'
              )}
            >
              <div className='flex justify-between w-full mb-2'>
                {isSelected ? (
                  <Check className='w-4 h-4 text-primary-container' />
                ) : (
                  <Circle className='w-4 h-4 text-on-surface-variant/40 group-hover:text-on-surface-variant transition-colors' />
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  isSelected
                    ? 'text-primary-container'
                    : 'text-on-surface-variant group-hover:text-on-surface'
                )}
              >
                {tag.name}
              </span>
              <button
                type='button'
                onClick={e => {
                  e.stopPropagation()
                  setMenuOpenTagId(menuOpenTagId === tag.id ? null : tag.id)
                }}
                className='absolute bottom-2 right-2 p-1 hover:bg-surface-container-highest rounded transition-colors opacity-0 group-hover/tag:opacity-100'
                aria-label='更多操作'
              >
                <MoreHorizontal className='w-4 h-4' />
              </button>
            </button>

            {menuOpenTagId === tag.id && (
              <>
                <button
                  type='button'
                  className='fixed inset-0 z-10 cursor-default'
                  onClick={() => setMenuOpenTagId(null)}
                  aria-label='关闭菜单'
                />
                <div className='absolute right-0 top-full mt-1 z-20 bg-surface-container-low border border-outline-variant/20 rounded-lg shadow-lg py-1 min-w-32'>
                  <button
                    type='button'
                    onClick={() => handleEditTag(tag.id, tag.name)}
                    className='w-full px-3 py-2 text-sm text-left text-on-surface hover:bg-surface-container-high flex items-center gap-2'
                  >
                    <Pencil className='w-4 h-4' />
                    编辑
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDeleteTag(tag.id)}
                    className='w-full px-3 py-2 text-sm text-left text-error hover:bg-error-container/10 flex items-center gap-2'
                  >
                    <Trash2 className='w-4 h-4' />
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        )
      })}

      <button
        type='button'
        onClick={onNewTagClick}
        className='group flex flex-col items-center justify-center p-3 border border-dashed border-primary-container/30 bg-primary-container/5 rounded-xl transition-all hover:bg-primary-container/10 hover:border-primary-container/60'
      >
        <Plus className='w-5 h-5 text-primary-container mb-2 group-hover:scale-110 transition-transform' />
        <span className='text-xs font-bold text-primary-container uppercase tracking-widest'>
          创建新标签
        </span>
      </button>
    </div>
  )
}
