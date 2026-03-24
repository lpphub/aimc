import { Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useDeleteWork, useProjects, useWorks } from '../hooks'
import type { WorkType } from '../types'
import { WorkCard } from './WorkCard'

function WorksToolbar({
  projectFilter,
  onProjectChange,
  typeFilter,
  onTypeChange,
  search,
  onSearchChange,
  projects,
}: {
  projectFilter: string
  onProjectChange: (value: string) => void
  typeFilter: string
  onTypeChange: (value: string) => void
  search: string
  onSearchChange: (value: string) => void
  projects: { id: string; name: string }[]
}) {
  return (
    <div className='flex items-center gap-3 mb-6'>
      <Select value={projectFilter} onValueChange={onProjectChange}>
        <SelectTrigger className='w-40 bg-card border-border/30 text-foreground'>
          <SelectValue placeholder='全部项目' />
        </SelectTrigger>
        <SelectContent className='bg-popover/95 border-border/30'>
          <SelectItem value='all'>全部项目</SelectItem>
          {projects.map(p => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={typeFilter} onValueChange={onTypeChange}>
        <SelectTrigger className='w-32 bg-card border-border/30 text-foreground'>
          <SelectValue placeholder='全部类型' />
        </SelectTrigger>
        <SelectContent className='bg-popover/95 border-border/30'>
          <SelectItem value='all'>全部类型</SelectItem>
          <SelectItem value='text'>文本</SelectItem>
          <SelectItem value='image'>图片</SelectItem>
          <SelectItem value='ocr'>OCR</SelectItem>
        </SelectContent>
      </Select>

      <div className='flex-1 relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline' />
        <input
          type='text'
          placeholder='搜索作品...'
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className='w-full h-10 pl-10 pr-4 bg-card border border-border/30 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary-container/50 focus:outline-none transition-colors'
        />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className='flex h-[calc(100vh-400px)] items-center justify-center'>
      <div className='text-center'>
        <div className='flex justify-center mb-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-primary-container/20 rounded-full blur-xl animate-pulse' />
            <Sparkles className='relative w-16 h-16 text-muted-foreground' />
          </div>
        </div>
        <p className='text-foreground text-lg'>暂无作品</p>
        <p className='text-muted-foreground text-sm mt-2'>使用 AI 工具创作并收藏你的第一个作品</p>
        <Button
          onClick={() => (window.location.href = '/creations')}
          variant='outline'
          className='mt-4 bg-primary-container/10 border-primary-container/30 text-primary-container hover:bg-primary-container/20'
        >
          前往创作中心
        </Button>
      </div>
    </div>
  )
}

export function Projects() {
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
    <div className='flex-1 px-12 pb-12'>
      <WorksToolbar
        projectFilter={projectFilter}
        onProjectChange={setProjectFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        search={searchQuery}
        onSearchChange={setSearchQuery}
        projects={projects}
      />

      {isLoading ? (
        <div className='flex h-[calc(100vh-400px)] items-center justify-center'>
          <div className='text-muted-foreground'>加载中...</div>
        </div>
      ) : works.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
          {works.map(work => (
            <WorkCard key={work.id} work={work} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
