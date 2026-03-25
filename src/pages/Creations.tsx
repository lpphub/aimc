import { Sparkles } from 'lucide-react'
import { CreationsPage } from '@/features/creations'

export default function Creations() {
  return (
    <div className='flex min-h-screen flex-col bg-surface'>
      <div className='flex items-center gap-4 p-8'>
        <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-secondary-container/20 to-secondary/20 border border-secondary-container/30'>
          <Sparkles className='w-6 h-6 text-secondary-container' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-foreground tracking-tight'>创作中心</h1>
          <p className='text-sm text-muted-foreground mt-1'>AI智绘，激发无限创意</p>
        </div>
      </div>

      <CreationsPage />
    </div>
  )
}
