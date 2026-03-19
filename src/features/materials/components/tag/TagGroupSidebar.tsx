import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
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
      'w-full px-4 py-2 flex items-center justify-between text-left transition-colors text-sm',
      activeGroupId === groupId ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-accent'
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
    <div className='w-65 border-r border-border flex flex-col'>
      <div className='h-12 px-4 flex items-center justify-between border-b border-border/50'>
        <span className='text-base font-medium text-foreground'>标签组</span>
        <button
          type='button'
          onClick={onNewGroupClick}
          className='p-1 hover:bg-accent rounded transition-colors'
          aria-label='新建标签组'
        >
          <Plus className='w-4 h-4 text-muted-foreground' />
        </button>
      </div>

      <div className='flex-1 overflow-auto'>
        <button
          type='button'
          onClick={() => onGroupSelect(ALL_TAGS_GROUP_ID)}
          className={getButtonClassName(ALL_TAGS_GROUP_ID)}
        >
          <span>全部</span>
          <span className='text-xs text-muted-foreground'>{allTagsCount}</span>
        </button>

        {groups.length > 0 && (
          <button
            type='button'
            onClick={() => onGroupSelect(String(groups[0].id))}
            className={getButtonClassName(String(groups[0].id))}
          >
            <span>{groups[0].name}</span>
            <span className='text-xs text-muted-foreground'>{groups[0].tags.length}</span>
          </button>
        )}

        {groups.length > 1 && <div className='h-px bg-border mx-2 my-1' />}

        {groups.slice(1).map(group => (
          <div key={group.id} className='relative group'>
            <button
              type='button'
              onClick={() => onGroupSelect(String(group.id))}
              className={getButtonClassName(String(group.id))}
            >
              <span>{group.name}</span>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-muted-foreground'>{group.tags.length}</span>
                <button
                  type='button'
                  onClick={e => {
                    e.stopPropagation()
                    setMenuOpenGroupId(menuOpenGroupId === group.id ? null : group.id)
                  }}
                  className='p-0.5 hover:bg-accent/50 rounded transition-colors opacity-0 group-hover:opacity-100'
                  aria-label='更多操作'
                >
                  <MoreHorizontal className='w-4 h-4 text-muted-foreground' />
                </button>
              </div>
            </button>

            {menuOpenGroupId === group.id && (
              <>
                <button
                  type='button'
                  className='fixed inset-0 z-10 cursor-default'
                  onClick={() => setMenuOpenGroupId(null)}
                  aria-label='关闭菜单'
                />
                <div className='absolute right-4 top-full mt-1 z-20 bg-popover border border-border rounded-md shadow-lg py-1 min-w-25'>
                  <button
                    type='button'
                    onClick={() => handleEditGroup(group.id, group.name)}
                    className='w-full px-3 py-1.5 text-sm text-left text-foreground hover:bg-accent flex items-center gap-2'
                  >
                    <Pencil className='w-4 h-4' />
                    编辑
                  </button>
                  <button
                    type='button'
                    onClick={() => handleDeleteGroup(group.id)}
                    className='w-full px-3 py-1.5 text-sm text-left text-destructive hover:bg-destructive/10 flex items-center gap-2'
                  >
                    <Trash2 className='w-4 h-4' />
                    删除
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
