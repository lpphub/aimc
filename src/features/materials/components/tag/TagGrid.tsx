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
        <span className='text-gray-400 text-sm'>加载中...</span>
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

  const tagColors = [
    'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    'bg-purple-500/10 border-purple-500/30 text-purple-400',
    'bg-teal-500/10 border-teal-500/30 text-teal-400',
  ]

  return (
    <div className='flex-1 overflow-auto mb-4'>
      <div className='grid grid-cols-3 gap-3'>
        <button
          type='button'
          onClick={onNewTagClick}
          className='aspect-square border-2 border-dashed border-white/20 rounded-xl text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2 text-sm'
        >
          <Plus className='w-4 h-4' />
          创建新标签
        </button>

        {tags.map((tag, index) => {
          const isSelected = selectedTagIds.includes(tag.id)
          const colorClass = isSelected
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
            : tagColors[index % tagColors.length]

          return (
            <div key={tag.id} className='relative group/tag'>
              <button
                type='button'
                onClick={() => onTagToggle(tag.id)}
                className={cn(
                  'w-full aspect-square rounded-xl border transition-all text-sm font-medium flex items-center justify-center relative',
                  colorClass
                )}
              >
                {isSelected && (
                  <div className='absolute top-2 right-2'>
                    <Check className='w-4 h-4' />
                  </div>
                )}
                <span className='truncate px-4'>{tag.name}</span>
                <button
                  type='button'
                  onClick={e => {
                    e.stopPropagation()
                    setMenuOpenTagId(menuOpenTagId === tag.id ? null : tag.id)
                  }}
                  className='absolute bottom-2 right-2 p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover/tag:opacity-100'
                  aria-label='更多操作'
                >
                  <MoreHorizontal className='w-3 h-3' />
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
                  <div className='absolute right-0 top-full mt-1 z-20 bg-[#1a1f2e] border border-white/10 rounded-lg shadow-lg py-1 min-w-32'>
                    <button
                      type='button'
                      onClick={() => handleEditTag(tag.id, tag.name)}
                      className='w-full px-3 py-2 text-sm text-left text-white hover:bg-white/5 flex items-center gap-2'
                    >
                      <Pencil className='w-4 h-4' />
                      编辑
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDeleteTag(tag.id)}
                      className='w-full px-3 py-2 text-sm text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2'
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
