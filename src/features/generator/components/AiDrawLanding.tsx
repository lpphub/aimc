import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { useCreateConversation } from '../hooks'
import { ConversationList } from './ConversationList'

export function AiDrawLanding() {
  const navigate = useNavigate()
  const createConversation = useCreateConversation()

  const handleStartNew = async () => {
    try {
      const result = await createConversation.mutateAsync({})
      navigate(`/canvas/${result.conversation.id}`)
    } catch {
      // Error handled by hook
    }
  }

  return (
    <div className='flex h-screen bg-surface'>
      {/* History Sidebar */}
      <div className='w-[280px] border-r border-border/10 bg-card/50 flex flex-col'>
        <ConversationList />
      </div>

      {/* Welcome Area */}
      <div className='flex-1 flex flex-col items-center justify-center p-8'>
        <div className='text-center max-w-md'>
          <div className='w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6'>
            <Sparkles className='w-10 h-10 text-primary' />
          </div>
          <h1 className='text-3xl font-bold text-foreground mb-3'>AI 绘图</h1>
          <p className='text-muted-foreground mb-8'>
            描述你想要的画面，AI 将为你生成创意图片。支持上传参考图，实时在画布上编辑。
          </p>
          <Button
            onClick={handleStartNew}
            disabled={createConversation.isPending}
            size='lg'
            className='bg-primary text-primary-foreground hover:bg-primary/90 px-8'
          >
            <Sparkles className='w-5 h-5 mr-2' />
            开始新对话
          </Button>
        </div>
      </div>
    </div>
  )
}
