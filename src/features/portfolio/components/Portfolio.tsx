import { FolderOpen, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useProjects } from '@/features/project/hooks'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useDeleteWork, useWorks } from '../hooks'
import type { WorkType } from '../types'
import { WorkCard } from './WorkCard'

export function Portfolio() {
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { data: projects = [] } = useProjects()
  const { data: works = [], isLoading } = useWorks({
    projectId: projectFilter !== 'all' ? projectFilter : undefined,
    type: typeFilter !== 'all' ? (typeFilter as WorkType) : undefined,
    search: searchQuery || undefined,
  })
  const deleteWork = useDeleteWork()

  const handleDelete = (id: string) => {
    deleteWork.mutate(id, {
      onSuccess: () => toast.success('作品已删除'),
      onError: () => toast.error('删除失败'),
    })
  }

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000' />
      </div>

      <div className='relative z-10 flex-1 p-8'>
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30'>
              <FolderOpen className='w-6 h-6 text-teal-400' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white tracking-tight'>作品集</h1>
              <p className='text-sm text-gray-500 mt-1'>全部作品 · {works.length} 件</p>
            </div>
          </div>

          <div className='flex gap-4'>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className='w-40 bg-gray-900/50 border-gray-700/30 text-white'>
                <SelectValue placeholder='全部项目' />
              </SelectTrigger>
              <SelectContent className='bg-gray-900/95 border-gray-700/30'>
                <SelectItem value='all'>全部项目</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className='w-32 bg-gray-900/50 border-gray-700/30 text-white'>
                <SelectValue placeholder='全部类型' />
              </SelectTrigger>
              <SelectContent className='bg-gray-900/95 border-gray-700/30'>
                <SelectItem value='all'>全部类型</SelectItem>
                <SelectItem value='text'>文本</SelectItem>
                <SelectItem value='image'>图片</SelectItem>
                <SelectItem value='video'>视频</SelectItem>
              </SelectContent>
            </Select>

            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
              <input
                type='text'
                placeholder='搜索作品...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full h-10 pl-10 pr-4 bg-gray-900/50 border border-gray-700/30 rounded-md text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors'
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-gray-500'>加载中...</div>
          </div>
        ) : works.length > 0 ? (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {works.map(work => (
              <WorkCard key={work.id} work={work} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-center'>
              <div className='flex justify-center mb-4'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse' />
                  <Sparkles className='relative w-16 h-16 text-gray-600' />
                </div>
              </div>
              <p className='text-gray-500 text-lg'>暂无作品</p>
              <p className='text-gray-600 text-sm mt-2'>使用AI工具创作并收藏你的第一个作品</p>
              <Button
                onClick={() => (window.location.href = '/tools')}
                variant='outline'
                className='mt-4 bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
              >
                前往工具箱
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
