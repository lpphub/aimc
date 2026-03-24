import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { TagGroup } from '../types'
import { ALL_TAGS_GROUP_ID } from '../types'

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
      'flex items-center gap-3 px-4 py-3 transition-all text-sm w-full',
      activeGroupId === groupId
        ? 'bg-surface-container-high text-primary-container border-r-2 border-primary-container'
        : 'text-muted-foreground hover:bg-surface-container-high/50 hover:text-primary-container'
    )

  const handleDeleteGroup = (groupId: number) => {
    setMenuOpenGroupId(null)
    onDeleteGroup(groupId)
  }

  const handleEditGroup = (groupId: number, name: string) => {
    setMenuOpenGroupId(null)
    onEditGroup(groupId, name)
  }

  return (
    <aside className='w-64 bg-background/40 flex flex-col border-r border-border/10'>
      <div className='px-6 py-4 flex items-center justify-between border-b border-border/10'>
        <span className='text-sm font-bold text-muted-foreground uppercase tracking-wider'>
          标签组
        </span>
        <button
          type='button'
          onClick={onNewGroupClick}
          className='text-primary-container hover:text-foreground transition-colors'
        >
          <Plus className='w-4 h-4' />
        </button>
      </div>

      <nav className='flex-1 px-3 py-2 space-y-1 overflow-y-auto'>
        <button
          type='button'
          onClick={() => onGroupSelect(ALL_TAGS_GROUP_ID)}
          className={getButtonClassName(ALL_TAGS_GROUP_ID)}
        >
          <span className='font-medium flex-1 text-left'>全部</span>
        </button>

        {groups.length > 0 && (
          <>
            <button
              type='button'
              onClick={() => onGroupSelect(String(groups[0].id))}
              className={getButtonClassName(String(groups[0].id))}
            >
              <span className='font-medium flex-1 text-left'>{groups[0].name}</span>
            </button>

            {groups.length > 1 && <div className='h-px bg-outline-variant/10 my-2' />}

            {groups.slice(1).map(group => (
              <div key={group.id} className='relative group/item'>
                <button
                  type='button'
                  onClick={() => onGroupSelect(String(group.id))}
                  className={getButtonClassName(String(group.id))}
                >
                  <span className='font-medium flex-1 text-left'>{group.name}</span>
                  <button
                    type='button'
                    onClick={e => {
                      e.stopPropagation()
                      setMenuOpenGroupId(menuOpenGroupId === group.id ? null : group.id)
                    }}
                    className='p-1 hover:bg-muted rounded transition-colors opacity-0 group-hover/item:opacity-100'
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
                    <div className='absolute right-4 top-full mt-1 z-20 bg-card border border-border/20 rounded-lg shadow-lg py-1 min-w-32'>
                      <button
                        type='button'
                        onClick={() => handleEditGroup(group.id, group.name)}
                        className='w-full px-3 py-2 text-sm text-left text-foreground hover:bg-surface-container-high flex items-center gap-2'
                      >
                        <Pencil className='w-4 h-4' />
                        编辑
                      </button>
                      <button
                        type='button'
                        onClick={() => handleDeleteGroup(group.id)}
                        className='w-full px-3 py-2 text-sm text-left text-destructive hover:bg-destructive-container/10 flex items-center gap-2'
                      >
                        <Trash2 className='w-4 h-4' />
                        删除
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </nav>
    </aside>
  )
}
