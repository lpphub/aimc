import { Canvas } from './Canvas'
import { CanvasToolbar } from './CanvasToolbar'
import { FloatingChat } from './FloatingChat'

export function CanvasGeneratorPage() {
  return (
    <div className='relative h-full'>
      <Canvas />
      <FloatingChat />
      <CanvasToolbar />
    </div>
  )
}
