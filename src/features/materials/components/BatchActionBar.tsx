import { Tag, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { useAddTagsToMaterials } from '../hooks'
import { TagSelectorModal } from './TagSelectorModal'

interface BatchActionBarProps {
  selectedIds: string[]
  onClear: () => void
  onDelete: (ids: string[]) => void
}

export function BatchActionBar({ selectedIds, onClear, onDelete }: BatchActionBarProps) {
  const [showTagModal, setShowTagModal] = useState(false)
  const addTagsToMaterials = useAddTagsToMaterials()

  if (selectedIds.length === 0) return null

  return (
    <>
      <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-2xl px-6 py-4 shadow-2xl'>
        <div className='flex items-center gap-4'>
          <span className='text-white'>
            已选择 <span className='text-cyan-400 font-semibold'>{selectedIds.length}</span> 项
          </span>

          <div className='h-6 w-px bg-gray-700' />

          <Button
            size='sm'
            variant='outline'
            onClick={() => setShowTagModal(true)}
            className='border-gray-600 text-gray-300 hover:text-white'
          >
            <Tag className='w-4 h-4 mr-2' />
            添加标签
          </Button>
          <Button size='sm' variant='destructive' onClick={() => onDelete(selectedIds)}>
            删除
          </Button>

          <div className='h-6 w-px bg-gray-700' />

          <button
            type='button'
            onClick={onClear}
            className='p-1 hover:bg-gray-800 rounded transition-colors'
          >
            <X className='w-5 h-5 text-gray-400' />
          </button>
        </div>
      </div>

      <TagSelectorModal
        open={showTagModal}
        onOpenChange={setShowTagModal}
        selectedTagIds={[]}
        onConfirm={tagIds => {
          if (tagIds.length > 0) {
            addTagsToMaterials.mutate(
              { materialIds: selectedIds, tagIds },
              { onSuccess: () => setShowTagModal(false) }
            )
          } else {
            setShowTagModal(false)
          }
        }}
      />
    </>
  )
}
