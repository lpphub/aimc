import { AlertTriangle, Check, Pencil, Plus, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import {
  useCreateTag,
  useCreateTagGroup,
  useDeleteTag,
  useDeleteTagGroup,
  useTagGroups,
  useUpdateTag,
  useUpdateTagGroup,
} from '../../hooks'
import { ALL_TAGS_GROUP_ID } from '../../types'
import { TagGrid } from './TagGrid'
import { TagGroupSidebar } from './TagGroupSidebar'
import { TagSelectedChips } from './TagSelectedChips'

interface TagModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTagIds: number[]
  onConfirm: (tagIds: number[]) => void
}

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  initialValue: string
  onSubmit: (name: string) => void
}

function EditDialog({ open, onOpenChange, title, initialValue, onSubmit }: EditDialogProps) {
  const [name, setName] = useState(initialValue)

  useEffect(() => {
    if (open) setName(initialValue)
  }, [open, initialValue])

  const handleSubmit = () => {
    if (!name.trim()) return
    onSubmit(name.trim())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm bg-[#1a1f2e] border-white/10'>
        <DialogHeader>
          <DialogTitle className='text-white flex items-center gap-2'>
            <Pencil className='w-5 h-5' />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='请输入名称'
            className='bg-[#0f1419] border-white/10 text-white'
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='bg-transparent border-white/10 text-gray-400 hover:text-white'
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className='bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  placeholder: string
  onSubmit: (name: string) => void
}

function CreateDialog({ open, onOpenChange, title, placeholder, onSubmit }: CreateDialogProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (!open) setName('')
  }, [open])

  const handleSubmit = () => {
    if (!name.trim()) return
    onSubmit(name.trim())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm bg-[#1a1f2e] border-white/10'>
        <DialogHeader>
          <DialogTitle className='text-white'>{title}</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={placeholder}
            className='bg-[#0f1419] border-white/10 text-white'
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='bg-transparent border-white/10 text-gray-400 hover:text-white'
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className='bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
          >
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm bg-[#1a1f2e] border-white/10'>
        <DialogHeader>
          <DialogTitle className='text-white flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-red-400' />
            {title}
          </DialogTitle>
          <DialogDescription className='text-gray-400'>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='bg-transparent border-white/10 text-gray-400 hover:text-white'
          >
            取消
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className='bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
          >
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TagModal({
  open,
  onOpenChange,
  selectedTagIds: initialSelectedTagIds,
  onConfirm,
}: TagModalProps) {
  const [localSelectedTagIds, setLocalSelectedTagIds] = useState<number[]>(initialSelectedTagIds)
  const [activeGroupId, setActiveGroupId] = useState<string>(ALL_TAGS_GROUP_ID)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false)
  const [showNewTagDialog, setShowNewTagDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'tag' | 'group'
    id: number
    name: string
  } | null>(null)
  const [editTarget, setEditTarget] = useState<{
    type: 'tag' | 'group'
    id: number
    name: string
  } | null>(null)

  const { data: groups = [], isLoading } = useTagGroups()
  const createTag = useCreateTag()
  const createTagGroup = useCreateTagGroup()
  const deleteTag = useDeleteTag()
  const deleteTagGroup = useDeleteTagGroup()
  const updateTag = useUpdateTag()
  const updateTagGroup = useUpdateTagGroup()

  useEffect(() => {
    setLocalSelectedTagIds(initialSelectedTagIds)
  }, [initialSelectedTagIds])

  const allTags = useMemo(() => {
    return groups.flatMap(g => g.tags)
  }, [groups])

  const filteredTags = useMemo(() => {
    const tags =
      activeGroupId === ALL_TAGS_GROUP_ID
        ? allTags
        : (groups.find(g => g.id === Number(activeGroupId))?.tags ?? [])
    return searchKeyword ? tags.filter(t => t.name.includes(searchKeyword)) : tags
  }, [activeGroupId, allTags, groups, searchKeyword])

  const selectedTags = useMemo(() => {
    return allTags.filter(t => localSelectedTagIds.includes(t.id))
  }, [allTags, localSelectedTagIds])

  const toggleTag = (tagId: number) => {
    setLocalSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  const handleCreateGroup = (name: string) => {
    createTagGroup.mutate(name, {
      onSuccess: () => setShowNewGroupDialog(false),
    })
  }

  const handleCreateTag = (name: string) => {
    const groupId = activeGroupId === ALL_TAGS_GROUP_ID ? undefined : Number(activeGroupId)
    createTag.mutate(
      { name, groupId },
      {
        onSuccess: () => setShowNewTagDialog(false),
      }
    )
  }

  const handleDeleteTag = (tagId: number) => {
    const tag = allTags.find(t => t.id === tagId)
    if (tag) {
      setDeleteTarget({ type: 'tag', id: tagId, name: tag.name })
    }
  }

  const handleDeleteGroup = (groupId: number) => {
    const group = groups.find(g => g.id === groupId)
    if (group) {
      setDeleteTarget({ type: 'group', id: groupId, name: group.name })
    }
  }

  const handleEditTag = (tagId: number, name: string) => {
    setEditTarget({ type: 'tag', id: tagId, name })
  }

  const handleEditGroup = (groupId: number, name: string) => {
    setEditTarget({ type: 'group', id: groupId, name })
  }

  const confirmDelete = () => {
    if (!deleteTarget) return

    if (deleteTarget.type === 'tag') {
      deleteTag.mutate(deleteTarget.id)
      setLocalSelectedTagIds(prev => prev.filter(id => id !== deleteTarget.id))
    } else {
      deleteTagGroup.mutate(deleteTarget.id)
      if (activeGroupId === String(deleteTarget.id)) {
        setActiveGroupId(ALL_TAGS_GROUP_ID)
      }
    }
    setDeleteTarget(null)
  }

  const confirmEdit = (name: string) => {
    if (!editTarget) return

    if (editTarget.type === 'tag') {
      updateTag.mutate({ tagId: editTarget.id, name })
    } else {
      updateTagGroup.mutate({ groupId: editTarget.id, name })
    }
    setEditTarget(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl h-[600px] p-0 flex flex-col bg-[#0f1419] border-white/10'>
        <div className='flex flex-1 overflow-hidden'>
          <TagGroupSidebar
            groups={groups}
            allTagsCount={allTags.length}
            activeGroupId={activeGroupId}
            onGroupSelect={setActiveGroupId}
            onNewGroupClick={() => setShowNewGroupDialog(true)}
            onDeleteGroup={handleDeleteGroup}
            onEditGroup={handleEditGroup}
          />

          <div className='flex-1 p-6 flex flex-col overflow-hidden bg-[#0a0e14]'>
            <div className='mb-6'>
              <h2 className='text-lg font-bold text-white mb-1'>标签管理</h2>
              <p className='text-xs text-gray-500 uppercase tracking-wider'>TAG NAVIGATOR</p>
            </div>

            <div className='flex items-center gap-3 mb-6'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500' />
                <Input
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  placeholder='搜索标签和分组或标签名...'
                  className='h-10 pl-10 bg-[#1a1f2e] border-white/10 text-white placeholder:text-gray-500'
                />
              </div>
              <Button
                variant='outline'
                className='bg-[#1a1f2e] border-white/10 text-gray-400 hover:text-white'
              >
                筛选
              </Button>
              <Button
                variant='outline'
                className='bg-[#1a1f2e] border-white/10 text-gray-400 hover:text-white'
              >
                排序
              </Button>
            </div>

            <TagGrid
              tags={filteredTags}
              selectedTagIds={localSelectedTagIds}
              isLoading={isLoading}
              onTagToggle={toggleTag}
              onNewTagClick={() => setShowNewTagDialog(true)}
              onDeleteTag={handleDeleteTag}
              onEditTag={handleEditTag}
            />

            <div className='mt-auto pt-4 border-t border-white/10'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-cyan-400' />
                  <span className='text-sm text-gray-400'>
                    已选择 {localSelectedTagIds.length} 个标签
                  </span>
                </div>
                <div className='flex gap-2'>
                  {localSelectedTagIds.map(id => {
                    const tag = allTags.find(t => t.id === id)
                    if (!tag) return null
                    return (
                      <span
                        key={id}
                        className='px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-md text-xs flex items-center gap-2'
                      >
                        {tag.name}
                        <button
                          type='button'
                          onClick={() =>
                            setLocalSelectedTagIds(prev => prev.filter(tid => tid !== id))
                          }
                          className='hover:text-cyan-300'
                        >
                          <X className='w-3 h-3' />
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <Button
                  variant='outline'
                  onClick={() => setLocalSelectedTagIds([])}
                  disabled={localSelectedTagIds.length === 0}
                  className='bg-transparent border-white/10 text-gray-400 hover:text-white'
                >
                  清空
                </Button>
                <Button
                  onClick={() => onConfirm(localSelectedTagIds)}
                  className='bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
                >
                  确认选择
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <CreateDialog
        open={showNewGroupDialog}
        onOpenChange={setShowNewGroupDialog}
        title='新建标签组'
        placeholder='请输入标签组名称'
        onSubmit={handleCreateGroup}
      />

      <CreateDialog
        open={showNewTagDialog}
        onOpenChange={setShowNewTagDialog}
        title='新建标签'
        placeholder='请输入标签名称'
        onSubmit={handleCreateTag}
      />

      <EditDialog
        open={editTarget !== null}
        onOpenChange={() => setEditTarget(null)}
        title={editTarget?.type === 'tag' ? '编辑标签' : '编辑标签组'}
        initialValue={editTarget?.name ?? ''}
        onSubmit={confirmEdit}
      />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={() => setDeleteTarget(null)}
        title={deleteTarget?.type === 'tag' ? '删除标签' : '删除标签组'}
        description={
          deleteTarget
            ? deleteTarget.type === 'tag'
              ? `确定要删除标签「${deleteTarget.name}」吗？`
              : `确定要删除标签组「${deleteTarget.name}」吗？该分组下的标签将移至默认分组。`
            : ''
        }
        onConfirm={confirmDelete}
      />
    </Dialog>
  )
}
