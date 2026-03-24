import { FolderOpen } from 'lucide-react'
import { MaterialPage } from '@/features/materials'

export default function Materials() {
  return (
    <div className='flex min-h-screen flex-col bg-surface'>
      <div className='flex items-center gap-4 p-8'>
        <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-secondary-container/20 to-error/20 border border-secondary-container/30'>
          <FolderOpen className='w-6 h-6 text-secondary-container' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-foreground tracking-tight'>素材库</h1>
          <p className='text-sm text-muted-foreground mt-1'>管理你的图片和视频素材</p>
        </div>
      </div>

      <MaterialPage />
    </div>
  )
}
