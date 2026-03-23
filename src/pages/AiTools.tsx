import { Sparkles } from 'lucide-react'
import { AiToolsPage } from '@/features/ai-tools'

function AiToolsHeader() {
  return (
    <div className='flex items-center gap-4 p-8'>
      <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30'>
        <Sparkles className='w-6 h-6 text-purple-400' />
      </div>
      <div>
        <h1 className='text-3xl font-bold text-white tracking-tight'>AI工具箱</h1>
        <p className='text-sm text-muted-foreground mt-1'>单点工具，激发无限创意</p>
      </div>
    </div>
  )
}

export default function AiTools() {
  return (
    <div className='flex min-h-screen flex-col bg-surface'>
      <AiToolsHeader />
      <AiToolsPage />
    </div>
  )
}
