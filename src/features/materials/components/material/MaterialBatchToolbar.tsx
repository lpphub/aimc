import { Tag, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { useAddTagsToMaterials } from '../../hooks'
import { TagModal } from '../tag/TagModal'

interface MaterialBatchToolbarProps {
  selectedIds: string[]
  onClear: () => void
  onDelete: (ids: string[]) => void
}

export function MaterialBatchToolbar({
  selectedIds,
  onClear,
  onDelete,
}: MaterialBatchToolbarProps) {
  const [showTagModal, setShowTagModal] = useState(false)
  const addTags = useAddTagsToMaterials()

  if (selectedIds.length === 0) return null

  const handleAddTags = (tagIds: number[]) => {
    if (tagIds.length === 0) return
    addTags.mutate(
      { materialIds: selectedIds, tagIds },
      {
        onSuccess: () => setShowTagModal(false),
      }
    )
  }

  return (
    <>
      <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background/95 backdrop-blur border border-border rounded-2xl px-6 py-4 shadow-2xl'>
        <div className='flex items-center gap-4'>
          <span className='text-foreground'>
            已选择 <span className='text-primary font-semibold'>{selectedIds.length}</span> 项
          </span>

          <div className='h-6 w-px bg-border' />

          <Button
            size='sm'
            variant='outline'
            onClick={() => setShowTagModal(true)}
            className='border-border text-muted-foreground hover:text-foreground'
          >
            <Tag className='w-4 h-4 mr-2' />
            添加标签
          </Button>

          <Button size='sm' variant='destructive' onClick={() => onDelete(selectedIds)}>
            删除
          </Button>

          <div className='h-6 w-px bg-border' />

          <button
            type='button'
            onClick={onClear}
            className='p-1 hover:bg-accent rounded transition-colors'
            aria-label='清除选择'
          >
            <X className='w-5 h-5 text-muted-foreground' />
          </button>
        </div>
      </div>

      <TagModal
        open={showTagModal}
        onOpenChange={setShowTagModal}
        selectedTagIds={[]}
        onConfirm={handleAddTags}
      />
    </>
  )
}
