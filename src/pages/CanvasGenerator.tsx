import { Image } from 'lucide-react'
import { CanvasGeneratorPage } from '@/features/canvas-generator'

export default function CanvasGenerator() {
  return (
    <div className='flex min-h-screen flex-col bg-surface'>
      <div className='flex items-center gap-4 p-8'>
        <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-secondary-container/20 to-secondary/20 border border-secondary-container/30'>
          <Image className='w-6 h-6 text-secondary-container' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-foreground tracking-tight'>AI绘图</h1>
          <p className='text-sm text-muted-foreground mt-1'>AI 对话生成商品营销图片</p>
        </div>
      </div>

      <CanvasGeneratorPage />
    </div>
  )
}
