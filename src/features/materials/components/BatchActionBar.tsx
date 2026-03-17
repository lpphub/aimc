import { Tag, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { useBatchUpdateTags } from '../hooks'

interface BatchActionBarProps {
  selectedIds: string[]
  onClear: () => void
  onDelete: (ids: string[]) => void
}

export function BatchActionBar({ selectedIds, onClear, onDelete }: BatchActionBarProps) {
  const [showTagInput, setShowTagInput] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const batchUpdateTags = useBatchUpdateTags()

  const handleAddTags = () => {
    if (!tagInput.trim()) return
    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
    batchUpdateTags.mutate(
      { ids: selectedIds, tags, mode: 'add' },
      {
        onSuccess: () => {
          setShowTagInput(false)
          setTagInput('')
          onClear()
        },
      }
    )
  }

  if (selectedIds.length === 0) return null

  return (
    <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-2xl px-6 py-4 shadow-2xl'>
      <div className='flex items-center gap-4'>
        <span className='text-white'>
          已选择 <span className='text-cyan-400 font-semibold'>{selectedIds.length}</span> 项
        </span>

        <div className='h-6 w-px bg-gray-700' />

        {!showTagInput ? (
          <>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setShowTagInput(true)}
              className='border-gray-600 text-gray-300 hover:text-white'
            >
              <Tag className='w-4 h-4 mr-2' />
              添加标签
            </Button>
            <Button size='sm' variant='destructive' onClick={() => onDelete(selectedIds)}>
              删除
            </Button>
          </>
        ) : (
          <div className='flex items-center gap-2'>
            <input
              type='text'
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder='输入标签，逗号分隔'
              className='h-8 px-3 bg-gray-800 border border-gray-600 rounded text-white text-sm placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none'
              onKeyDown={e => e.key === 'Enter' && handleAddTags()}
            />
            <Button size='sm' onClick={handleAddTags}>
              确定
            </Button>
            <Button
              size='sm'
              variant='ghost'
              onClick={() => {
                setShowTagInput(false)
                setTagInput('')
              }}
            >
              取消
            </Button>
          </div>
        )}

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
  )
}
