import { Canvas } from './Canvas'
import { CanvasToolbar } from './CanvasToolbar'
import { FloatingChat } from './FloatingChat'

export function CanvasGeneratorPage() {
  return (
    <div className='relative h-[calc(100vh-64px)]'>
      <Canvas />
      <FloatingChat />
      <CanvasToolbar />
    </div>
  )
}
