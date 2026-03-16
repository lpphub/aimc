import { Layers, Plus, Search, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProjectCard } from '@/features/project/components'
import { useCreateProject, useProjects, useTags } from '@/features/project/hooks'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'

export default function HomePage() {
  const navigate = useNavigate()
  const { data: projects = [], isLoading } = useProjects()
  const { data: presetTags = [] } = useTags()
  const createProject = useCreateProject()
  const [searchQuery, setSearchQuery] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredProjects = projects.filter(
    project =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return

    createProject.mutate(
      {
        name: newProjectName,
        description: newProjectDescription || undefined,
        tags: selectedTags,
      },
      {
        onSuccess: () => {
          setNewProjectName('')
          setNewProjectDescription('')
          setSelectedTags([])
          setIsDialogOpen(false)
        },
      }
    )
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]))
  }

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`)
  }

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]'>
      {/* Animated Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000' />
      </div>

      {/* Page Content */}
      <div className='relative z-10 flex-1 p-8'>
        {/* Title Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30'>
                <Layers className='w-6 h-6 text-cyan-400' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white tracking-tight'>项目库</h1>
                <p className='text-sm text-gray-500 mt-1'>智绘工坊 · {projects.length} 个项目</p>
              </div>
            </div>

            {/* Create Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:text-white hover:from-cyan-600 hover:to-teal-600 hover:bg-transparent shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  创建新项目
                </Button>
              </DialogTrigger>
              <DialogContent className='bg-gray-900 border-gray-800'>
                <DialogHeader>
                  <DialogTitle className='text-white'>创建新项目</DialogTitle>
                  <DialogDescription className='text-gray-500'>
                    输入项目名称以创建一个新的创作项目
                  </DialogDescription>
                </DialogHeader>
                <div className='py-4 space-y-4'>
                  <div className='space-y-2'>
                    <label className='text-sm text-gray-300'>
                      项目名称 <span className='text-red-400'>*</span>
                    </label>
                    <Input
                      placeholder='输入项目名称...'
                      value={newProjectName}
                      onChange={e => setNewProjectName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleCreateProject()}
                      className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500/50'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm text-gray-300'>项目描述</label>
                    <Input
                      placeholder='输入项目描述（可选）...'
                      value={newProjectDescription}
                      onChange={e => setNewProjectDescription(e.target.value)}
                      className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-500/50'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm text-gray-300'>标签</label>
                    <div className='flex flex-wrap gap-2'>
                      {presetTags.map(tag => (
                        <Badge
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`cursor-pointer transition-all ${
                            selectedTags.includes(tag)
                              ? 'bg-cyan-500 text-white border-cyan-500'
                              : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-cyan-500/50'
                          }`}
                        >
                          {tag}
                          {selectedTags.includes(tag) && <X className='ml-1 h-3 w-3' />}
                        </Badge>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <p className='text-xs text-gray-500'>已选择: {selectedTags.join(', ')}</p>
                    )}
                  </div>
                </div>
                <div className='flex justify-end gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                    className='bg-transparent border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
                  >
                    取消
                  </Button>
                  <Button
                    variant='ghost'
                    onClick={handleCreateProject}
                    disabled={!newProjectName.trim() || createProject.isPending}
                    className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:text-white hover:from-cyan-600 hover:to-teal-600 hover:bg-transparent'
                  >
                    {createProject.isPending ? '创建中...' : '创建'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
          <div className='relative max-w-md'>
            <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500' />
            <Input
              type='text'
              placeholder='快速检索项目...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full h-12 pl-12 bg-gray-900/50 border-gray-700/30 text-white placeholder:text-gray-500 backdrop-blur-sm focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300'
            />
            <div className='absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600'>
              {searchQuery.length > 0 && `${filteredProjects.length} 个结果`}
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-gray-500'>加载中...</div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project.id)}
              />
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
              <p className='text-gray-500 text-lg'>暂无项目</p>
              <p className='text-gray-600 text-sm mt-2'>点击"创建新项目"开始创作</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
