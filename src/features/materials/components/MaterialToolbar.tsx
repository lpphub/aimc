import { Tag, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { useBatchUpdateTags } from '../hooks'
import { TagModal } from './TagModal'

interface MaterialToolbarProps {
  selectedIds: string[]
  onClear: () => void
  onDelete: (ids: string[]) => void
}

export function MaterialToolbar({ selectedIds, onClear, onDelete }: MaterialToolbarProps) {
  const [showTagModal, setShowTagModal] = useState(false)
  const batchUpdate = useBatchUpdateTags()

  if (selectedIds.length === 0) return null

  const handleConfirm = (tagIds: number[]) => {
    batchUpdate.mutate(
      { ids: selectedIds, tagIds, mode: 'replace' },
      {
        onSuccess: () => {
          setShowTagModal(false)
          onClear()
        },
      }
    )
  }

  return (
    <>
      <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface-container-high/95 backdrop-blur border border-border/30 rounded-2xl px-6 py-4 shadow-2xl'>
        <div className='flex items-center gap-4'>
          <span className='text-foreground'>
            已选择 <span className='text-primary font-semibold'>{selectedIds.length}</span> 项
          </span>

          <div className='h-6 w-px bg-outline-variant/30' />

          <Button
            size='sm'
            variant='outline'
            onClick={() => setShowTagModal(true)}
            className='border-border/30 text-muted-foreground hover:text-primary hover:border-primary-container/50'
          >
            <Tag className='w-4 h-4 mr-2' />
            标签
          </Button>

          <Button size='sm' variant='destructive' onClick={() => onDelete(selectedIds)}>
            删除
          </Button>

          <div className='h-6 w-px bg-outline-variant/30' />

          <button
            type='button'
            onClick={onClear}
            className='p-1 hover:bg-primary-container/10 rounded transition-colors'
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
        onConfirm={handleConfirm}
      />
    </>
  )
}
