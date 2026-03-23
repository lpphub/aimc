import { Check, Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import type { WorkType } from '@/shared/types'

interface Project {
  id: string
  name: string
}

interface CollectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: WorkType
  content: string
  prompt: string
  engine?: string
  projects: Project[]
  isPending: boolean
  onCollect: (data: {
    projectId?: string
    type: WorkType
    content: string
    prompt: string
    engine?: string
  }) => void
}

export function CollectDialog({
  open,
  onOpenChange,
  type,
  content,
  prompt,
  engine,
  projects,
  isPending,
  onCollect,
}: CollectDialogProps) {
  const [selectedProject, setSelectedProject] = useState<string | undefined>(undefined)

  const handleCollect = () => {
    onCollect({ projectId: selectedProject, type, content, prompt, engine })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md bg-background border-border'>
        <DialogHeader>
          <DialogTitle className='text-foreground flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-cyan-400' />
            收藏到作品集
          </DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            选择将作品收藏到项目或全局作品集
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-2'>
          <button
            type='button'
            onClick={() => setSelectedProject(undefined)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
              selectedProject === undefined
                ? 'bg-primary/20 border border-primary/30 text-primary'
                : 'bg-muted/50 border border-border/30 text-muted-foreground hover:bg-accent'
            )}
          >
            <div className='w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center'>
              {selectedProject === undefined && <Check className='w-4 h-4' />}
            </div>
            <span className='text-sm font-medium'>全局作品集</span>
          </button>

          {projects.map(project => (
            <button
              key={project.id}
              type='button'
              onClick={() => setSelectedProject(project.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                selectedProject === project.id
                  ? 'bg-primary/20 border border-primary/30 text-primary'
                  : 'bg-muted/50 border border-border/30 text-muted-foreground hover:bg-accent'
              )}
            >
              <div className='w-8 h-8 rounded-lg bg-linear-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center'>
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
            className='bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-accent'
          >
            取消
          </Button>
          <Button
            onClick={handleCollect}
            disabled={isPending}
            className='bg-primary text-primary-foreground hover:bg-primary/90'
          >
            {isPending ? (
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
