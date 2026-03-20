import { BarChart3, Grid3x3, MoreHorizontal, Palette, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { TagGroup } from '../../types'
import { ALL_TAGS_GROUP_ID } from '../../types'

interface TagGroupSidebarProps {
  groups: TagGroup[]
  allTagsCount: number
  activeGroupId: string
  onGroupSelect: (id: string) => void
  onNewGroupClick: () => void
  onDeleteGroup: (groupId: number) => void
  onEditGroup: (groupId: number, name: string) => void
}

export function TagGroupSidebar({
  groups,
  allTagsCount,
  activeGroupId,
  onGroupSelect,
  onNewGroupClick,
  onDeleteGroup,
  onEditGroup,
}: TagGroupSidebarProps) {
  const [menuOpenGroupId, setMenuOpenGroupId] = useState<number | null>(null)

  const getButtonClassName = (groupId: string) =>
    cn(
      'w-full px-4 py-3 flex items-center gap-3 text-left transition-colors text-sm rounded-lg',
      activeGroupId === groupId
        ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    )

  const handleDeleteGroup = (groupId: number) => {
    setMenuOpenGroupId(null)
    onDeleteGroup(groupId)
  }

  const handleEditGroup = (groupId: number, name: string) => {
    setMenuOpenGroupId(null)
    onEditGroup(groupId, name)
  }

  const categoryIcons = [Star, Palette, BarChart3]

  return (
    <div className='w-64 bg-[#0f1419] flex flex-col'>
      <div className='p-4 border-b border-white/5'>
        <span className='text-xs text-gray-500 uppercase tracking-wider'>标签组</span>
      </div>

      <div className='flex-1 overflow-auto p-3 space-y-1'>
        <button
          type='button'
          onClick={() => onGroupSelect(ALL_TAGS_GROUP_ID)}
          className={getButtonClassName(ALL_TAGS_GROUP_ID)}
        >
          <Grid3x3 className='w-4 h-4' />
          <span className='flex-1'>全部标签</span>
          <span className='text-xs text-gray-500'>{allTagsCount}</span>
        </button>

        {groups.map((group, index) => {
          const Icon = categoryIcons[index % categoryIcons.length]
          return (
            <div key={group.id} className='relative group/item'>
              <button
                type='button'
                onClick={() => onGroupSelect(String(group.id))}
                className={getButtonClassName(String(group.id))}
              >
                <Icon className='w-4 h-4' />
                <span className='flex-1'>{group.name}</span>
                <span className='text-xs text-gray-500'>{group.tags.length}</span>
                <button
                  type='button'
                  onClick={e => {
                    e.stopPropagation()
                    setMenuOpenGroupId(menuOpenGroupId === group.id ? null : group.id)
                  }}
                  className='p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover/item:opacity-100'
                  aria-label='更多操作'
                >
                  <MoreHorizontal className='w-3 h-3' />
                </button>
              </button>

              {menuOpenGroupId === group.id && (
                <>
                  <button
                    type='button'
                    className='fixed inset-0 z-10 cursor-default'
                    onClick={() => setMenuOpenGroupId(null)}
                    aria-label='关闭菜单'
                  />
                  <div className='absolute right-4 top-full mt-1 z-20 bg-[#1a1f2e] border border-white/10 rounded-lg shadow-lg py-1 min-w-32'>
                    <button
                      type='button'
                      onClick={() => handleEditGroup(group.id, group.name)}
                      className='w-full px-3 py-2 text-sm text-left text-white hover:bg-white/5 flex items-center gap-2'
                    >
                      <Pencil className='w-4 h-4' />
                      编辑
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDeleteGroup(group.id)}
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

      <div className='p-3 border-t border-white/5'>
        <button
          type='button'
          onClick={onNewGroupClick}
          className='w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2'
        >
          <Plus className='w-4 h-4' />
          新建分组
        </button>
      </div>
    </div>
  )
}
