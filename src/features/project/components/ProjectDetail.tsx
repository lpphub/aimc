import { BookOpen, ChevronRight, Plus, Upload } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { CreationRecords, PresetMaterials } from '@/features/project/components'
import { useProject, useRecords, useTemplates } from '@/features/project/hooks'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading: projectLoading } = useProject(id!)
  const { data: allTemplates = [] } = useTemplates()
  const { data: records = [], isLoading: recordsLoading } = useRecords(id!)

  const handleStartCreation = () => {
    navigate('/creation')
  }

  const handleUploadMaterial = () => {
    console.log('Upload material')
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
                <Plus className='mr-2 h-4 w-4' />
                开始AI创作
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        <div className='flex gap-6 min-h-[calc(100vh-300px)]'>
          <div className='w-80 flex-shrink-0'>
            <Card className='h-full bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm flex flex-col'>
              <div className='p-4 border-b border-gray-700/30'>
                <h2 className='text-lg font-semibold text-white'>预设素材</h2>
              </div>
              <div className='flex-1 p-4 overflow-auto'>
                <PresetMaterials templates={presetTemplates} />
              </div>
            </Card>
          </div>

          <Separator orientation='vertical' className='h-auto bg-gray-700/20' />

          <div className='flex-1 flex flex-col'>
            <Card className='flex-1 bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm flex flex-col'>
              <div className='p-4 border-b border-gray-700/30 flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-white'>创作记录</h2>
                <span className='text-sm text-gray-500'>{records.length} 条记录</span>
              </div>
              <div className='flex-1 p-4 overflow-auto'>
                {recordsLoading ? (
                  <div className='flex items-center justify-center h-full'>
                    <div className='text-gray-500'>加载中...</div>
                  </div>
                ) : (
                  <CreationRecords records={records} />
                )}
              </div>
            </Card>

            <div className='mt-4 flex gap-3'>
              <Button
                onClick={handleUploadMaterial}
                variant='outline'
                className='bg-gray-900/50 border-gray-700/30 text-white hover:bg-gray-800/50 hover:border-gray-600/50 backdrop-blur-sm transition-all duration-300'
              >
                <Upload className='mr-2 h-4 w-4' />
                上传素材
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
