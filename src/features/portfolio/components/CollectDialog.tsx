import { Check, Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useProjects } from '@/features/project/hooks'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { useCreateWork } from '../hooks'
import type { WorkType } from '../types'

interface CollectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: WorkType
  content: string
  prompt: string
  engine?: string
  onSuccess?: () => void
}

export function CollectDialog({
  open,
  onOpenChange,
  type,
  content,
  prompt,
  engine,
  onSuccess,
}: CollectDialogProps) {
  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined)
  const { data: projects = [] } = useProjects()
  const createWork = useCreateWork()

  const handleCollect = () => {
    createWork.mutate(
      {
        projectId: selectedProject,
        type,
        content,
        prompt,
        engine,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md bg-gray-900 border-gray-800'>
        <DialogHeader>
          <DialogTitle className='text-white flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-cyan-400' />
            收藏到作品集
          </DialogTitle>
          <DialogDescription className='text-gray-500'>
            选择将作品收藏到项目或全局作品集
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-2'>
          <button
            type='button'
            onClick={() => setSelectedProject(undefined)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              selectedProject === undefined
                ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                : 'bg-gray-800/50 border border-gray-700/30 text-gray-400 hover:bg-gray-800'
            }`}
          >
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center'>
              {selectedProject === undefined && <Check className='w-4 h-4' />}
            </div>
            <span className='text-sm font-medium'>全局作品集</span>
          </button>

          {projects.map(project => (
            <button
              key={project.id}
              type='button'
              onClick={() => setSelectedProject(project.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                selectedProject === project.id
                  ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                  : 'bg-gray-800/50 border border-gray-700/30 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center'>
                {selectedProject === project.id && <Check className='w-4 h-4' />}
              </div>
              <span className='text-sm font-medium'>{project.name}</span>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='bg-transparent border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
          >
            取消
          </Button>
          <Button
            onClick={handleCollect}
            disabled={createWork.isPending}
            className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600'
          >
            {createWork.isPending ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                收藏中...
              </>
            ) : (
              '确认收藏'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
