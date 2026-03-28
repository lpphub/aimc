import { Canvas } from './Canvas'

export function CanvasGeneratorPage() {
  return (
    <div className='relative h-[calc(100vh-64px)]'>
      <Canvas />
      {/* FloatingChat 和 CanvasToolbar 将在后续任务添加 */}
    </div>
  )
}
