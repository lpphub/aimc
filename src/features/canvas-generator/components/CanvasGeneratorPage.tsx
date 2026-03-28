import { Canvas } from './Canvas'
import { CanvasToolbar } from './CanvasToolbar'
import { ChatPanel } from './ChatPanel'

export function CanvasGeneratorPage() {
  return (
    <div className='flex h-[calc(100vh-64px)]'>
      <ChatPanel />
      <div className='relative flex-1 flex flex-col'>
        <Canvas />
        <CanvasToolbar />
      </div>
    </div>
  )
}
