import { CollectDialog as SharedCollectDialog } from '@/shared/components/collect'
import { useCreateWork, useProjects } from '@/shared/hooks'
import type { WorkType } from '@/shared/types'

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
  const { data: projects = [] } = useProjects()
  const createWork = useCreateWork()

  const handleCollect = (data: {
    projectId?: string
    type: WorkType
    content: string
    prompt: string
    engine?: string
  }) => {
    createWork.mutate(data, {
      onSuccess: () => {
        onOpenChange(false)
        onSuccess?.()
      },
    })
  }

  return (
    <SharedCollectDialog
      open={open}
      onOpenChange={onOpenChange}
      type={type}
      content={content}
      prompt={prompt}
      engine={engine}
      projects={projects}
      isPending={createWork.isPending}
      onCollect={handleCollect}
    />
  )
}
