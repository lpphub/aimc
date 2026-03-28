import { useCallback } from 'react'
import { useCanvas } from '../hooks/useCanvas'
import { CanvasItem } from './CanvasItem'

export function Canvas() {
  const { items, selectedId, handleDrag, selectItem } = useCanvas()

  const handleCanvasClick = useCallback(() => {
    selectItem(null)
  }, [selectItem])

  return (
    <section
      className='relative w-full h-full overflow-hidden bg-background'
      style={{
        backgroundImage: `radial-gradient(circle, rgba(100, 116, 139, 0.4) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
      onClick={handleCanvasClick}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          selectItem(null)
        }
      }}
      aria-label='Canvas area'
    >
      {items.map(item => (
        <CanvasItem
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onDrag={handleDrag}
          onSelect={selectItem}
        />
      ))}
    </section>
  )
}
