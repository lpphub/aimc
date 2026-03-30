import { History, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { useCreateConversation } from '../hooks'
import { ConversationList } from './ConversationList'

export function AiDrawLanding() {
  const navigate = useNavigate()
  const createConversation = useCreateConversation()
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)

  const handleStartNew = async () => {
    try {
      const result = await createConversation.mutateAsync({})
      navigate(`/canvas/${result.conversation.id}`)
    } catch {
      // Error handled by hook
    }
  }

  // 收起状态：显示浮动按钮
  if (!isHistoryExpanded) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center p-8 relative'>
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

        {/* 历史记录按钮 */}
        <button
          type='button'
          onClick={() => setIsHistoryExpanded(true)}
          className='absolute right-4 top-4 z-50 p-3 bg-card/90 backdrop-blur-xl border border-primary/30 text-primary rounded-2xl shadow-[0_0_40px_rgba(0,242,255,0.15)] hover:shadow-[0_0_60px_rgba(0,242,255,0.25)] hover:border-primary/50 hover:scale-105 transition-all duration-300'
          title='历史对话'
        >
          <History className='w-5 h-5' />
        </button>
      </div>
    )
  }

  // 展开状态：显示完整面板
  return (
    <div className='flex-1 flex relative'>
      {/* 主内容区域 */}
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

      {/* 右侧历史面板 */}
      <div className='absolute right-4 top-4 bottom-4 z-50 w-80 flex flex-col bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.3)] transition-all duration-300'>
        {/* 头部 */}
        <div className='flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center'>
              <History className='w-4 h-4 text-primary' />
            </div>
            <span className='text-sm font-medium text-foreground'>历史对话</span>
          </div>
          <button
            type='button'
            onClick={() => setIsHistoryExpanded(false)}
            className='p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors'
            title='收起'
          >
            <History className='w-4 h-4' />
          </button>
        </div>

        {/* 列表内容 */}
        <ConversationList />
      </div>
    </div>
  )
}