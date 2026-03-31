import { memo, useCallback } from 'react'
import type { CanvasItem as CanvasItemType } from '../types'

interface CanvasItemProps {
  item: CanvasItemType
  isSelected: boolean
  onDrag: (id: string, x: number, y: number) => void
  onSelect: (id: string) => void
  tool?: 'select' | 'hand'
  onDelete: (id: string) => void
  onDownload: (imageUrl: string) => void
}

export const CanvasItem = memo(function CanvasItem({
  item,
  isSelected,
  onDrag,
  onSelect,
  tool = 'select',
  onDelete,
  onDownload,
}: CanvasItemProps) {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 只有在选择工具模式下才允许选择和拖拽
      if (tool !== 'select') return

      e.stopPropagation()
      onSelect(item.id)

      const startX = e.clientX - item.x
      const startY = e.clientY - item.y

      const handleMouseMove = (moveEvent: MouseEvent) => {
        onDrag(item.id, moveEvent.clientX - startX, moveEvent.clientY - startY)
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [item.id, item.x, item.y, onDrag, onSelect, tool]
  )

  return (
    <div
      className={`canvas-item absolute ${tool === 'select' ? 'cursor-move' : 'cursor-grab'} ${isSelected && tool === 'select' ? 'ring-2 ring-primary' : ''}`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg)`,
        pointerEvents: tool === 'select' ? 'auto' : 'none',
      }}
      onMouseDown={handleMouseDown}
      role='img'
      tabIndex={-1}
    >
      {/* 选中时显示操作栏 */}
      {isSelected && tool === 'select' && (
        <div className='absolute top-0 left-0 right-0 bg-black/60 rounded-t-md p-1 flex gap-1.5 justify-center z-10'>
          <button
            type='button'
            className='text-white text-[10px] hover:bg-white/20 rounded px-1.5 py-0.5 transition-colors'
            onClick={e => {
              e.stopPropagation()
              onDelete(item.id)
            }}
          >
            🗑️ 删除
          </button>
          <button
            type='button'
            className='text-white text-[10px] hover:bg-white/20 rounded px-1.5 py-0.5 transition-colors'
            onClick={e => {
              e.stopPropagation()
              onDownload(item.imageUrl)
            }}
          >
            ⬇️ 下载
          </button>
        </div>
      )}
      <img
        src={item.imageUrl}
        alt='Canvas item'
        className='w-full h-full object-contain pointer-events-none'
        draggable={false}
      />
    </div>
  )
})
