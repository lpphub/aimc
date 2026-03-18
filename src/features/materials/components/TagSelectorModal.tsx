import { Check, Plus, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { useCreateTag, useCreateTagGroup, useTagGroups } from '../hooks'
import type { Tag } from '../types'
import { ALL_TAGS_GROUP_ID } from '../types'

interface TagSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTagIds: number[]
  onConfirm: (tagIds: number[]) => void
}

export function TagSelectorModal({
  open,
  onOpenChange,
  selectedTagIds: initialSelectedTagIds,
  onConfirm,
}: TagSelectorModalProps) {
  const [localSelectedTagIds, setLocalSelectedTagIds] = useState<number[]>(initialSelectedTagIds)
  const [activeGroupId, setActiveGroupId] = useState<string>(ALL_TAGS_GROUP_ID)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [showNewTagDialog, setShowNewTagDialog] = useState(false)
  const [newTagName, setNewTagName] = useState('')

  const { data: groups = [], isLoading } = useTagGroups()
  const createTag = useCreateTag()
  const createTagGroup = useCreateTagGroup()

  useEffect(() => {
    setLocalSelectedTagIds(initialSelectedTagIds)
  }, [initialSelectedTagIds])

  const allTags = useMemo(() => {
    const tags: Tag[] = []
    for (const group of groups) {
      for (const tag of group.tags) {
        tags.push(tag)
      }
    }
    return tags
  }, [groups])

  const filteredTags = useMemo(() => {
    let tags: Tag[]
    if (activeGroupId === ALL_TAGS_GROUP_ID) {
      tags = allTags
    } else {
      const group = groups.find(g => g.id === Number(activeGroupId))
      tags = group?.tags ?? []
    }
    if (searchKeyword) {
      tags = tags.filter(t => t.name.includes(searchKeyword))
    }
    return tags
  }, [activeGroupId, allTags, groups, searchKeyword])

  const selectedTags = useMemo(() => {
    return allTags.filter(t => localSelectedTagIds.includes(t.id))
  }, [allTags, localSelectedTagIds])

  const toggleTag = (tagId: number) => {
    setLocalSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  const removeTag = (tagId: number) => {
    setLocalSelectedTagIds(prev => prev.filter(id => id !== tagId))
  }

  const clearSelection = () => {
    setLocalSelectedTagIds([])
  }

  const handleConfirm = () => {
    onConfirm(localSelectedTagIds)
  }

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return
    createTagGroup.mutate(newGroupName.trim(), {
      onSuccess: () => {
        setNewGroupName('')
        setShowNewGroupDialog(false)
      },
    })
  }

  const handleCreateTag = () => {
    if (!newTagName.trim()) return
    const groupId = activeGroupId === ALL_TAGS_GROUP_ID ? undefined : Number(activeGroupId)
    createTag.mutate(
      { name: newTagName.trim(), groupId },
      {
        onSuccess: () => {
          setNewTagName('')
          setShowNewTagDialog(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[960px] h-[700px] p-0 flex flex-col bg-background border-0'>
        <DialogHeader className='h-12 px-4 flex flex-row items-center justify-between border-b border-gray-800'>
          <DialogTitle className='text-base font-semibold'>选择标签</DialogTitle>
        </DialogHeader>

        <div className='flex flex-1 overflow-hidden'>
          <div className='w-[260px] border-r border-gray-800 flex flex-col'>
            <div className='h-12 px-4 flex items-center justify-between border-b border-gray-800/50'>
              <span className='text-sm font-medium text-gray-300'>标签组</span>
              <button
                type='button'
                onClick={() => setShowNewGroupDialog(true)}
                className='p-1 hover:bg-gray-800 rounded transition-colors'
              >
                <Plus className='w-4 h-4 text-gray-400' />
              </button>
            </div>
            <div className='flex-1 overflow-auto'>
              <button
                type='button'
                onClick={() => setActiveGroupId(ALL_TAGS_GROUP_ID)}
                className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                  activeGroupId === ALL_TAGS_GROUP_ID
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span>全部</span>
                <span className='text-xs text-gray-500'>{allTags.length}</span>
              </button>
              {groups.map(group => (
                <button
                  key={group.id}
                  type='button'
                  onClick={() => setActiveGroupId(String(group.id))}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                    activeGroupId === String(group.id)
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span>{group.name}</span>
                  <span className='text-xs text-gray-500'>{group.tags.length}</span>
                </button>
              ))}
            </div>
          </div>

          <div className='flex-1 p-6 flex flex-col overflow-hidden'>
            {isLoading && (
              <div className='flex items-center justify-center h-full'>
                <span className='text-gray-500'>加载中...</span>
              </div>
            )}
            {!isLoading && (
              <>
                <div className='relative mb-4'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500' />
                  <Input
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                    placeholder='搜索标签...'
                    className='h-9 pl-9 bg-gray-800/50 border-gray-700'
                  />
                </div>

                <div className='flex-1 overflow-auto'>
                  <div className='flex flex-wrap gap-3'>
                    <button
                      type='button'
                      onClick={() => setShowNewTagDialog(true)}
                      className='px-4 py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors'
                    >
                      <Plus className='w-4 h-4 inline mr-1' />
                      新建标签
                    </button>
                    {filteredTags.map(tag => {
                      const isSelected = localSelectedTagIds.includes(tag.id)
                      return (
                        <button
                          key={tag.id}
                          type='button'
                          onClick={() => toggleTag(tag.id)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                              : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {tag.name}
                          {isSelected && <Check className='w-4 h-4 inline ml-2' />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {selectedTags.length > 0 && (
                  <div className='mt-4 pt-4 border-t border-gray-800'>
                    <div className='flex flex-wrap gap-2'>
                      {selectedTags.map(tag => {
                        const group = groups.find(g => g.tags.some(t => t.id === tag.id))
                        return (
                          <span
                            key={tag.id}
                            className='inline-flex items-center gap-1 px-2.5 py-1 bg-gray-800 rounded-full text-xs text-gray-300'
                          >
                            {group?.name}: {tag.name}
                            <button
                              type='button'
                              onClick={() => removeTag(tag.id)}
                              className='p-0.5 hover:bg-gray-700 rounded-full'
                            >
                              <X className='w-3 h-3' />
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className='h-16 px-4 flex items-center justify-between border-t border-gray-800'>
          <span className='text-sm text-gray-400'>
            已选择 <span className='text-cyan-400'>{localSelectedTagIds.length}</span> 个标签
          </span>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={clearSelection}>
              清空
            </Button>
            <Button
              onClick={handleConfirm}
              className='bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
            >
              确认
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* 新建标签组弹窗 */}
      <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
        <DialogContent className='max-w-sm bg-background border-0'>
          <DialogHeader>
            <DialogTitle className='text-white'>新建标签组</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <Input
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder='请输入标签组名称'
              className='bg-gray-800 border-gray-700'
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShowNewGroupDialog(false)
                setNewGroupName('')
              }}
            >
              取消
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={!newGroupName.trim()}
              className='bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
            >
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新建标签弹窗 */}
      <Dialog open={showNewTagDialog} onOpenChange={setShowNewTagDialog}>
        <DialogContent className='max-w-sm bg-background border-0'>
          <DialogHeader>
            <DialogTitle className='text-white'>新建标签</DialogTitle>
          </DialogHeader>
          <div className='py-4 space-y-3'>
            <Input
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              placeholder='请输入标签名称'
              className='bg-gray-800 border-gray-700'
              autoFocus
            />
            {activeGroupId !== ALL_TAGS_GROUP_ID && (
              <p className='text-xs text-gray-500'>
                将添加到「{groups.find(g => g.id === Number(activeGroupId))?.name}」
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setShowNewTagDialog(false)
                setNewTagName('')
              }}
            >
              取消
            </Button>
            <Button
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
              className='bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
            >
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
