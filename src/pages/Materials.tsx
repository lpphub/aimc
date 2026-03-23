import { FolderOpen } from 'lucide-react'
import { MaterialPage } from '@/features/materials'

function MaterialsHeader() {
  return (
    <div className='flex items-center gap-4 p-8'>
      <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'>
        <FolderOpen className='w-6 h-6 text-purple-400' />
      </div>
      <div>
        <h1 className='text-3xl font-bold text-white tracking-tight'>素材库</h1>
        <p className='text-sm text-muted-foreground mt-1'>管理你的图片和视频素材</p>
      </div>
    </div>
  )
}

export default function Materials() {
  return (
    <div className='flex min-h-screen flex-col bg-surface'>
      <MaterialsHeader />
      <MaterialPage />
    </div>
  )
}
