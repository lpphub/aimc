import { Check, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Tag } from '../../types'

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
        <span className='text-muted-foreground text-sm'>加载中...</span>
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
    <div className='flex-1 overflow-auto'>
      <div className='grid grid-cols-5 gap-3'>
        <button
          type='button'
          onClick={onNewTagClick}
          className='px-4 py-1.5 border border-dashed border-border rounded-lg text-muted-foreground hover:border-foreground hover:text-foreground transition-colors text-left text-sm'
        >
          <Plus className='w-4 h-4 inline mr-1' />
          新建标签
        </button>

        {tags.map(tag => {
          const isSelected = selectedTagIds.includes(tag.id)
          return (
            <div key={tag.id} className='relative group'>
              <button
                type='button'
                onClick={() => onTagToggle(tag.id)}
                className={cn(
                  'w-full px-4 py-1.5 rounded-lg transition-colors text-left flex items-center justify-between text-sm',
                  isSelected
                    ? 'bg-primary/20 border border-primary/50 text-primary'
                    : 'bg-muted border border-border text-foreground hover:border-border/70'
                )}
              >
                <span className='truncate flex-1'>{tag.name}</span>
                <div className='flex items-center gap-1 shrink-0'>
                  {isSelected && <Check className='w-4 h-4' />}
                  <button
                    type='button'
                    onClick={e => {
                      e.stopPropagation()
                      setMenuOpenTagId(menuOpenTagId === tag.id ? null : tag.id)
                    }}
                    className='p-0.5 hover:bg-accent/50 rounded transition-colors opacity-0 group-hover:opacity-100'
                    aria-label='更多操作'
                  >
                    <MoreHorizontal className='w-4 h-4 text-muted-foreground' />
                  </button>
                </div>
              </button>

              {menuOpenTagId === tag.id && (
                <>
                  <button
                    type='button'
                    className='fixed inset-0 z-10 cursor-default'
                    onClick={() => setMenuOpenTagId(null)}
                    aria-label='关闭菜单'
                  />
                  <div className='absolute right-0 top-full mt-1 z-20 bg-popover border border-border rounded-md shadow-lg py-1 min-w-25'>
                    <button
                      type='button'
                      onClick={() => handleEditTag(tag.id, tag.name)}
                      className='w-full px-3 py-1.5 text-sm text-left text-foreground hover:bg-accent flex items-center gap-2'
                    >
                      <Pencil className='w-4 h-4' />
                      编辑
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDeleteTag(tag.id)}
                      className='w-full px-3 py-1.5 text-sm text-left text-destructive hover:bg-destructive/10 flex items-center gap-2'
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
      </div>
    </div>
  )
}
