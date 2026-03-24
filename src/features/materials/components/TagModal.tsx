import { AlertTriangle, Pencil, Search } from 'lucide-react'
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
} from '../hooks'
import { ALL_TAGS_GROUP_ID } from '../types'
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
      <DialogContent className='max-w-sm bg-card/90 backdrop-blur-xl border-border/20'>
        <DialogHeader>
          <DialogTitle className='text-foreground flex items-center gap-2'>
            <Pencil className='w-5 h-5' />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='请输入名称'
            className='bg-background border-border/20 text-foreground focus:ring-primary/50'
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='bg-transparent border-border/20 text-muted-foreground hover:text-foreground'
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className='bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20'
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
      <DialogContent className='max-w-sm bg-card/90 backdrop-blur-xl border-border/20'>
        <DialogHeader>
          <DialogTitle className='text-foreground'>{title}</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={placeholder}
            className='bg-background border-border/20 text-foreground focus:ring-primary/50'
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='bg-transparent border-border/20 text-muted-foreground hover:text-foreground'
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className='bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20'
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
      <DialogContent className='max-w-sm bg-card/90 backdrop-blur-xl border-border/20'>
        <DialogHeader>
          <DialogTitle className='text-foreground flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-destructive' />
            {title}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground'>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='bg-transparent border-border/20 text-muted-foreground hover:text-foreground'
          >
            取消
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className='bg-destructive-container/20 border border-destructive/30 text-destructive hover:bg-destructive-container/30'
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
      <DialogContent className='max-w-5xl h-205 p-0 flex flex-col bg-card/60 backdrop-blur-xl border-border/15 shadow-[0_0_40px_rgba(0,242,255,0.06)]'>
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

          <div className='flex-1 flex flex-col bg-surface/30 backdrop-blur-sm overflow-hidden'>
            <div className='p-6 pb-4 border-b border-border/10'>
              <div className='relative group pr-10'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors' />
                <Input
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  placeholder='搜索标签...'
                  className='h-10 pl-10 pr-4 bg-card border border-border/20 focus:ring-1 focus:ring-primary/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50'
                />
              </div>
            </div>

            <div className='flex-1 overflow-y-auto p-6'>
              <TagGrid
                tags={filteredTags}
                selectedTagIds={localSelectedTagIds}
                isLoading={isLoading}
                onTagToggle={toggleTag}
                onNewTagClick={() => setShowNewTagDialog(true)}
                onDeleteTag={handleDeleteTag}
                onEditTag={handleEditTag}
              />
            </div>

            <div className='p-6 bg-card/80 border-t border-border/10 flex flex-col sm:flex-row gap-4 items-center justify-between'>
              <TagSelectedChips
                selectedTags={selectedTags}
                onRemoveTag={id => setLocalSelectedTagIds(prev => prev.filter(x => x !== id))}
              />
              <div className='flex items-center gap-4'>
                <button
                  type='button'
                  onClick={() => setLocalSelectedTagIds([])}
                  disabled={localSelectedTagIds.length === 0}
                  className='text-sm text-muted-foreground hover:text-destructive transition-colors px-4 py-2 font-medium disabled:opacity-50'
                >
                  清空
                </button>
                <button
                  type='button'
                  onClick={() => onConfirm(localSelectedTagIds)}
                  className='bg-primary text-primary-foreground font-bold px-8 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all active:scale-95 text-sm uppercase tracking-wider'
                >
                  确认选择
                </button>
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
