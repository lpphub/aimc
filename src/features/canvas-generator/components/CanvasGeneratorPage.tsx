import { useState } from 'react'
import { Canvas } from './Canvas'
import { CanvasToolbar } from './CanvasToolbar'
import { FloatingChat } from './FloatingChat'

export function CanvasGeneratorPage() {
  const [activeTool, setActiveTool] = useState<'select' | 'hand'>('select')

  return (
    <div className='relative h-full'>
      <Canvas tool={activeTool} />
      <FloatingChat />
      <CanvasToolbar onToolChange={setActiveTool} />
    </div>
  )
}
