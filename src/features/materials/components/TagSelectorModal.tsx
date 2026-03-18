import { Check, Plus, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
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
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initialSelectedTagIds)
  const [activeGroupId, setActiveGroupId] = useState<string>(ALL_TAGS_GROUP_ID)
  const [searchKeyword, setSearchKeyword] = useState('')

  const { data: groups = [] } = useTagGroups()
  const createTag = useCreateTag()
  const createTagGroup = useCreateTagGroup()

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
    return allTags.filter(t => selectedTagIds.includes(t.id))
  }, [allTags, selectedTagIds])

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  const removeTag = (tagId: number) => {
    setSelectedTagIds(prev => prev.filter(id => id !== tagId))
  }

  const clearSelection = () => {
    setSelectedTagIds([])
  }

  const handleConfirm = () => {
    onConfirm(selectedTagIds)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[950px] h-[600px] p-0 flex flex-col bg-gray-900 border-gray-700'>
        <DialogHeader className='h-12 px-4 flex flex-row items-center justify-between border-b border-gray-700'>
          <DialogTitle className='text-base font-semibold'>选择标签</DialogTitle>
        </DialogHeader>

        <div className='flex flex-1 overflow-hidden'>
          <div className='w-[220px] border-r border-gray-700 flex flex-col'>
            <div className='h-12 px-4 flex items-center justify-between border-b border-gray-800'>
              <span className='text-sm font-medium text-gray-300'>标签组</span>
              <button
                type='button'
                onClick={() => {
                  const name = prompt('请输入标签组名称')
                  if (name) createTagGroup.mutate(name)
                }}
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
                  onClick={() => {
                    const name = prompt('请输入标签名称')
                    if (name) {
                      const groupId =
                        activeGroupId === ALL_TAGS_GROUP_ID ? undefined : Number(activeGroupId)
                      createTag.mutate({ name, groupId })
                    }
                  }}
                  className='px-4 py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors'
                >
                  <Plus className='w-4 h-4 inline mr-1' />
                  新建标签
                </button>
                {filteredTags.map(tag => {
                  const isSelected = selectedTagIds.includes(tag.id)
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
              <div className='mt-4 pt-4 border-t border-gray-700'>
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
          </div>
        </div>

        <div className='h-16 px-4 flex items-center justify-between border-t border-gray-700'>
          <span className='text-sm text-gray-400'>
            已选择 <span className='text-cyan-400'>{selectedTagIds.length}</span> 个标签
          </span>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={clearSelection}>
              清空
            </Button>
            <Button onClick={handleConfirm}>确认</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
