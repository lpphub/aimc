import { Check, Circle, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
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
        <span className='text-[#b9cacb] text-sm'>加载中...</span>
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

  const tagCategories = ['STYLE', 'TECH', 'ENV', 'TONE', 'IND']

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
      {tags.map((tag, index) => {
        const isSelected = selectedTagIds.includes(tag.id)
        const category = tagCategories[index % tagCategories.length]

        return (
          <div key={tag.id} className='relative group/tag'>
            <button
              type='button'
              onClick={() => onTagToggle(tag.id)}
              className={cn(
                'group flex flex-col items-start p-4 rounded-xl relative overflow-hidden transition-all w-full min-h-[110px]',
                isSelected
                  ? 'bg-[#00f2ff]/10 border border-[#00f2ff]/40 ring-1 ring-[#00f2ff]/20'
                  : 'bg-[#2a2a2b]/40 border border-[#3a494b]/10 hover:bg-[#2a2a2b]/80 hover:border-[#3a494b]/30'
              )}
            >
              <div className='flex justify-between w-full mb-2'>
                {isSelected ? (
                  <Check className='w-5 h-5 text-[#00f2ff]' />
                ) : (
                  <Circle className='w-5 h-5 text-[#b9cacb]/40 group-hover:text-[#b9cacb] transition-colors' />
                )}
                <span
                  className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded',
                    isSelected
                      ? 'text-[#00f2ff] bg-[#00f2ff]/10'
                      : 'text-[#b9cacb] bg-[#353436]'
                  )}
                >
                  {category}
                </span>
              </div>
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  isSelected ? 'text-[#00f2ff]' : 'text-[#b9cacb] group-hover:text-[#e5e2e3]'
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
                className='absolute bottom-2 right-2 p-1 hover:bg-[#353436] rounded transition-colors opacity-0 group-hover/tag:opacity-100'
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
                <div className='absolute right-0 top-full mt-1 z-20 bg-[#1c1b1c] border border-[#3a494b]/20 rounded-lg shadow-lg py-1 min-w-32'>
                  <button
                    type='button'
                    onClick={() => handleEditTag(tag.id, tag.name)}
                    className='w-full px-3 py-2 text-sm text-left text-[#e5e2e3] hover:bg-[#2a2a2b] flex items-center gap-2'
                  >
                    <Pencil className='w-4 h-4' />
                    编辑
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDeleteTag(tag.id)}
                    className='w-full px-3 py-2 text-sm text-left text-[#ffb4ab] hover:bg-[#93000a]/10 flex items-center gap-2'
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
        className='group flex flex-col items-center justify-center p-4 border border-dashed border-[#00f2ff]/30 bg-[#00f2ff]/5 rounded-xl transition-all hover:bg-[#00f2ff]/10 hover:border-[#00f2ff]/60 min-h-[110px]'
      >
        <Plus className='w-5 h-5 text-[#00f2ff] mb-2 group-hover:scale-110 transition-transform' />
        <span className='text-xs font-bold text-[#00f2ff] uppercase tracking-widest'>
          创建新标签
        </span>
      </button>
    </div>
  )
}
