import { Clock } from 'lucide-react'
import { Projects } from '@/features/projects'

export default function ProjectsPage() {
  return (
    <div className='flex min-h-screen flex-col bg-surface'>
      <div className='flex items-center gap-4 p-8'>
        <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/20 border border-primary/30'>
          <Clock className='w-6 h-6 text-primary' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-foreground tracking-tight'>项目日志</h1>
          <p className='text-sm text-muted-foreground mt-1'>管理你的创作作品</p>
        </div>
      </div>

      <Projects />
    </div>
  )
}
