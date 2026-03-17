import { BookOpen, FolderOpen, Layers } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useProject, useRecords, useTemplates } from '@/features/project/hooks'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import { MaterialsTab } from './MaterialsTab'
import { WorksTab } from './WorksTab'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project, isLoading: projectLoading } = useProject(id!)
  const { data: allTemplates = [] } = useTemplates()
  const { data: records = [] } = useRecords(id!)

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
    type: 'image' as const,
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
        <div className='absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse' />
        <div className='absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700' />
        <div className='absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[100px] animate-pulse delay-2000' />
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
          </div>
        </div>

        <Card className='h-[calc(100vh-350px)] bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm p-6'>
          <div className='flex h-full gap-6'>
            <div className='flex-[6] min-w-0'>
              <div className='flex items-center gap-2 mb-4'>
                <FolderOpen className='w-5 h-5 text-cyan-400' />
                <span className='text-lg font-medium text-white'>作品集</span>
                <span className='text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400'>
                  {works.length}
                </span>
              </div>
              <WorksTab works={works} onDelete={handleDeleteWork} />
            </div>

            <div className='w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent' />

            <div className='flex-[4] min-w-0'>
              <div className='flex items-center gap-2 mb-4'>
                <Layers className='w-5 h-5 text-teal-400' />
                <span className='text-lg font-medium text-white'>素材库</span>
                <span className='text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400'>
                  {materials.length}
                </span>
              </div>
              <MaterialsTab
                materials={materials}
                onUpload={handleUploadMaterial}
                onDelete={handleDeleteMaterial}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
