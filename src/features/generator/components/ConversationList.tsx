import { MessageSquare, Plus, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { useConversations, useCreateConversation, useDeleteConversation } from '../hooks'

interface ConversationListProps {
  onSelectConversation?: (id: string) => void
}

export function ConversationList({ onSelectConversation }: ConversationListProps) {
  const navigate = useNavigate()
  const { data: conversations, isLoading } = useConversations()
  const createConversation = useCreateConversation()
  const deleteConversation = useDeleteConversation()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleCreateNew = useCallback(async () => {
    try {
      const result = await createConversation.mutateAsync({})
      navigate(`/canvas/${result.conversation.id}`)
      onSelectConversation?.(result.conversation.id)
    } catch {
      // Error handled by hook
    }
  }, [createConversation, navigate, onSelectConversation])

  const handleSelect = useCallback(
    (id: string) => {
      navigate(`/canvas/${id}`)
      onSelectConversation?.(id)
    },
    [navigate, onSelectConversation]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      if (deleteConfirmId !== id) {
        setDeleteConfirmId(id)
        return
      }
      try {
        await deleteConversation.mutateAsync(id)
        setDeleteConfirmId(null)
        toast.success('对话已删除')
      } catch {
        // Error handled by hook
      }
    },
    [deleteConversation, deleteConfirmId]
  )

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='p-4 border-b border-border/10'>
        <Button
          onClick={handleCreateNew}
          disabled={createConversation.isPending}
          className='w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30'
        >
          <Plus className='w-4 h-4 mr-2' />
          新建对话
        </Button>
      </div>

      <div className='flex-1 overflow-y-auto'>
        {isLoading ? (
          <div className='p-4 text-center text-muted-foreground text-sm'>加载中...</div>
        ) : !conversations || conversations.length === 0 ? (
          <div className='p-4 text-center text-muted-foreground text-sm'>暂无历史对话</div>
        ) : (
          <div className='space-y-1 p-2'>
            {conversations.map(conv => (
              <button
                type='button'
                key={conv.id}
                className='group flex items-center gap-2 p-3 rounded-lg hover:bg-surface-container-high cursor-pointer transition-colors w-full text-left'
                onClick={() => handleSelect(conv.id)}
              >
                <MessageSquare className='w-4 h-4 text-muted-foreground shrink-0' />
                <div className='flex-1 min-w-0'>
                  <div className='text-sm text-foreground truncate'>{conv.title}</div>
                  <div className='text-xs text-muted-foreground'>{formatDate(conv.updatedAt)}</div>
                </div>
                <span
                  className={cn(
                    'p-1.5 rounded transition-colors',
                    deleteConfirmId === conv.id
                      ? 'bg-destructive/20 text-destructive'
                      : 'opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                  title={deleteConfirmId === conv.id ? '再次点击确认删除' : '删除'}
                >
                  <button
                    type='button'
                    onClick={e => {
                      e.stopPropagation()
                      handleDelete(conv.id)
                    }}
                    className='bg-transparent border-none p-0 cursor-pointer'
                  >
                    <Trash2 className='w-3.5 h-3.5' />
                  </button>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
