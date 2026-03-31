import { useEffect, useRef, useState } from 'react'
import { useConversation } from '../hooks'
import { useCanvasStore } from '../stores/canvas'
import { Canvas } from './Canvas'
import { CanvasToolbar } from './CanvasToolbar'
import { FloatingChat } from './FloatingChat'

interface GeneratorPageProps {
  conversationId?: string
}

export function GeneratorPage({ conversationId }: GeneratorPageProps) {
  const [activeTool, setActiveTool] = useState<'select' | 'hand'>('select')
  const [isLoaded, setIsLoaded] = useState(false)
  const [zoom, setZoom] = useState(1)

  const { data: conversation, isLoading } = useConversation(conversationId || '')
  const setItems = useCanvasStore(state => state.setItems)

  // Restore canvas items when conversation loads
  useEffect(() => {
    if (conversation && !isLoaded) {
      setItems(conversation.canvasItems)
      setIsLoaded(true)
    }
  }, [conversation, isLoaded, setItems])

  // Reset loaded state when conversationId changes - using ref to track previous value
  const prevConversationIdRef = useRef(conversationId)
  if (prevConversationIdRef.current !== conversationId) {
    prevConversationIdRef.current = conversationId
    setIsLoaded(false)
  }

  if (!conversationId) {
    return null // Should be redirected by router
  }

  if (isLoading && !isLoaded) {
    return (
      <div className='h-full flex items-center justify-center bg-background'>
        <div className='text-muted-foreground'>加载中...</div>
      </div>
    )
  }

  return (
    <div className='relative h-full'>
      <Canvas tool={activeTool} onZoomChange={setZoom} />
      <FloatingChat conversationId={conversationId} />
      <CanvasToolbar onToolChange={setActiveTool} zoom={zoom} />
    </div>
  )
}
