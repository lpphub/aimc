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
      'flex items-center gap-3 px-4 py-3 transition-all text-sm',
      activeGroupId === groupId
        ? 'bg-[#2a2a2b] text-[#00f2ff] border-r-2 border-[#00f2ff]'
        : 'text-[#b9cacb] hover:bg-[#2a2a2b]/50 hover:text-[#00f2ff]'
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
    <aside className='w-64 bg-[#0e0e0f]/40 flex flex-col border-r border-[#3a494b]/10'>
      <div className='p-6'>
        <h2 className='font-bold text-xl tracking-tight text-[#00f2ff] mb-1'>标签管理</h2>
        <p className='text-[#b9cacb] text-[10px] uppercase tracking-[0.1em]'>Tag Navigator</p>
      </div>

      <div className='px-6 mb-4 flex items-center justify-between'>
        <span className='text-[10px] font-bold text-[#b9cacb] uppercase tracking-wider'>
          标签组
        </span>
        <button
          type='button'
          onClick={onNewGroupClick}
          className='flex items-center gap-1 text-[10px] text-[#00f2ff] hover:text-white transition-colors group'
        >
          <Plus className='w-3.5 h-3.5' />
          创建分组
        </button>
      </div>

      <nav className='flex-1 px-3 space-y-1 overflow-y-auto'>
        <button
          type='button'
          onClick={() => onGroupSelect(ALL_TAGS_GROUP_ID)}
          className={getButtonClassName(ALL_TAGS_GROUP_ID)}
        >
          <Grid3x3 className='w-5 h-5' />
          <span className='font-medium'>全部标签</span>
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
                <Icon className='w-5 h-5' />
                <span className='font-medium flex-1 text-left'>{group.name}</span>
                <button
                  type='button'
                  onClick={e => {
                    e.stopPropagation()
                    setMenuOpenGroupId(menuOpenGroupId === group.id ? null : group.id)
                  }}
                  className='p-1 hover:bg-[#353436] rounded transition-colors opacity-0 group-hover/item:opacity-100'
                  aria-label='更多操作'
                >
                  <MoreHorizontal className='w-4 h-4' />
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
                  <div className='absolute right-4 top-full mt-1 z-20 bg-[#1c1b1c] border border-[#3a494b]/20 rounded-lg shadow-lg py-1 min-w-32'>
                    <button
                      type='button'
                      onClick={() => handleEditGroup(group.id, group.name)}
                      className='w-full px-3 py-2 text-sm text-left text-[#e5e2e3] hover:bg-[#2a2a2b] flex items-center gap-2'
                    >
                      <Pencil className='w-4 h-4' />
                      编辑
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDeleteGroup(group.id)}
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
      </nav>

      <div className='p-6 mt-auto border-t border-[#3a494b]/5'>
        <div className='flex items-center gap-3 px-2 py-2 rounded-lg bg-[#2a2a2b]/30'>
          <div className='w-8 h-8 rounded bg-[#00f2ff]/20 flex items-center justify-center'>
            <span className='text-[#00f2ff] text-lg'>ℹ</span>
          </div>
          <div>
            <p className='text-[11px] font-medium text-[#e5e2e3]'>管理说明</p>
            <p className='text-[9px] text-[#b9cacb]'>拖拽可重新排序</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
