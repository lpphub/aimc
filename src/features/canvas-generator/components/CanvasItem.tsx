import { memo, useCallback } from 'react'
import type { CanvasItem as CanvasItemType } from '../types'

interface CanvasItemProps {
  item: CanvasItemType
  isSelected: boolean
  onDrag: (id: string, x: number, y: number) => void
  onSelect: (id: string) => void
}

export const CanvasItem = memo(function CanvasItem({
  item,
  isSelected,
  onDrag,
  onSelect,
}: CanvasItemProps) {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
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
    [item.id, item.x, item.y, onDrag, onSelect]
  )

  return (
    <button
      type='button'
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        transform: `rotate(${item.rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={item.imageUrl}
        alt='Canvas item'
        className='w-full h-full object-contain pointer-events-none'
        draggable={false}
      />
    </button>
  )
})
