import { BookOpen, ChevronRight, FolderOpen, Layers } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProject, useRecords, useTemplates } from '@/features/project/hooks'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { MaterialsTab } from './MaterialsTab'
import { WorksTab } from './WorksTab'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading: projectLoading } = useProject(id!)
  const { data: allTemplates = [] } = useTemplates()
  const { data: records = [] } = useRecords(id!)
  const [activeTab, setActiveTab] = useState<'materials' | 'works'>('materials')

  const handleStartCreation = () => {
    navigate('/tools')
  }

  const handleUploadMaterial = () => {
    console.log('Upload material')
  }

  const handleDeleteMaterial = (materialId: string) => {
    console.log('Delete material:', materialId)
  }

  const handleDeleteWork = (workId: string) => {
    console.log('Delete work:', workId)
  }

  if (projectLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#0a0a0a]'>
        <div className='text-gray-500'>加载中...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#0a0a0a]'>
        <div className='text-gray-500'>项目不存在</div>
      </div>
    )
  }

  const presetTemplates = allTemplates.filter(t => project.presetTemplateIds?.includes(t.id))

  const materials = presetTemplates.map(t => ({
    id: t.id,
    type: 'text' as const,
    name: t.name,
    content: t.content,
    createdAt: new Date().toISOString(),
  }))

  const works = records.map(r => ({
    id: r.id,
    projectId: id,
    type: (r.type === 'copy' ? 'text' : r.type) as 'text' | 'image' | 'video',
    content: r.content,
    prompt: r.title || '',
    createdAt: r.createdAt,
  }))

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000' />
      </div>

      <div className='relative z-10 flex-1 p-8'>
        <div className='mb-6'>
          <div className='flex items-start justify-between mb-6'>
            <div className='flex items-start gap-6'>
              <div className='flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 shadow-lg shadow-purple-500/10'>
                <BookOpen className='h-10 w-10 text-purple-400' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>
                  {project.name}
                </h1>
                {project.description && <p className='text-gray-400 mb-3'>{project.description}</p>}
                <div className='flex items-center gap-2 flex-wrap'>
                  {project.tags?.map(tag => (
                    <Badge key={tag} className='bg-cyan-500/20 text-cyan-400 border-cyan-500/30'>
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex gap-3'>
              <Button
                onClick={handleStartCreation}
                className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40'
              >
                <ChevronRight className='mr-2 h-4 w-4' />
                开始AI创作
              </Button>
            </div>
          </div>

          <div className='flex gap-2 border-b border-gray-800'>
            <button
              type='button'
              onClick={() => setActiveTab('materials')}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px',
                activeTab === 'materials'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              )}
            >
              <Layers className='w-4 h-4' />
              素材库
              <span className='text-xs bg-gray-800 px-2 py-0.5 rounded-full'>
                {materials.length}
              </span>
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('works')}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px',
                activeTab === 'works'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              )}
            >
              <FolderOpen className='w-4 h-4' />
              作品集
              <span className='text-xs bg-gray-800 px-2 py-0.5 rounded-full'>{works.length}</span>
            </button>
          </div>
        </div>

        <Card className='h-[calc(100vh-350px)] bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm p-6'>
          {activeTab === 'materials' ? (
            <MaterialsTab
              materials={materials}
              onUpload={handleUploadMaterial}
              onDelete={handleDeleteMaterial}
            />
          ) : (
            <WorksTab works={works} onDelete={handleDeleteWork} />
          )}
        </Card>
      </div>
    </div>
  )
}
