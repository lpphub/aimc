import { useCallback, useEffect, useRef, useState } from 'react'
import { useCanvas } from '../hooks/useCanvas'
import { useCanvasZoom } from '../hooks/useCanvasZoom'
import { CanvasItem } from './CanvasItem'

interface CanvasProps {
  tool?: 'select' | 'hand'
  onZoomChange?: (zoom: number) => void
}

export function Canvas({ tool = 'select', onZoomChange }: CanvasProps) {
  const { items, selectedId, handleDrag, selectItem, removeItem, handleDownload } = useCanvas()
  const { zoom, setZoom, handleWheel: handleZoomWheel } = useCanvasZoom()
  const canvasRef = useRef<HTMLElement>(null)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const offsetStartRef = useRef({ x: 0, y: 0 })

  // 处理画布拖拽（抓手工具）和取消选中
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 点击空白区域取消选中
      if (tool === 'select' && !(e.target as HTMLElement).closest('.canvas-item')) {
        selectItem(null)
      }

      if (tool !== 'hand') return
      if ((e.target as HTMLElement).closest('.canvas-item')) return

      setIsDragging(true)
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      offsetStartRef.current = { ...canvasOffset }
    },
    [tool, canvasOffset, selectItem]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || tool !== 'hand') return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      setCanvasOffset({
        x: offsetStartRef.current.x + deltaX,
        y: offsetStartRef.current.y + deltaY,
      })
    },
    [isDragging, tool]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Handle zoom via wheel
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const result = handleZoomWheel(e, canvasOffset)
      setZoom(result.zoom)
      setCanvasOffset(result.offset)
      onZoomChange?.(result.zoom)
    },
    [handleZoomWheel, canvasOffset, setZoom, onZoomChange]
  )

  // 全局鼠标事件监听
  useEffect(() => {
    if (!isDragging) return

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      setCanvasOffset({
        x: offsetStartRef.current.x + deltaX,
        y: offsetStartRef.current.y + deltaY,
      })
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging])

  return (
    <section
      ref={canvasRef}
      className={`relative w-full h-full overflow-hidden bg-background ${
        tool === 'hand' ? 'cursor-grab' : ''
      } ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        backgroundImage: `radial-gradient(circle, rgba(100, 116, 139, 0.4) 1px, transparent 1px)`,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          selectItem(null)
        }
      }}
      aria-label='Canvas area'
    >
      {/* 可拖拽的内容层 */}
      <div
        className='absolute inset-0'
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {items.map(item => (
          <CanvasItem
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onDrag={handleDrag}
            onSelect={selectItem}
            tool={tool}
            onDelete={removeItem}
            onDownload={handleDownload}
          />
        ))}
      </div>
    </section>
  )
}
