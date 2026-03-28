import { MessageSquare, Send, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useCanvas } from '../hooks/useCanvas'
import { useChat } from '../hooks/useChat'

export function FloatingChat() {
  const [isExpanded, setIsExpanded] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { handleAddImage } = useCanvas()
  const { messages, isLoading, sendMessage } = useChat(handleAddImage)

  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isExpanded])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const message = formData.get('message') as string
    if (message.trim()) {
      await sendMessage(message)
      e.currentTarget.reset()
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await sendMessage('', file)
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 收起状态：显示浮动按钮
  if (!isExpanded) {
    return (
      <button
        type='button'
        onClick={() => setIsExpanded(true)}
        className='absolute left-4 top-4 z-20 p-3 bg-primary text-primary-foreground rounded-full shadow-elevation hover:bg-primary/90 transition-all'
        title='打开聊天'
      >
        <MessageSquare className='w-5 h-5' />
      </button>
    )
  }

  // 展开状态：显示完整面板
  return (
    <div className='absolute left-4 top-4 z-20 w-[380px] max-h-[600px] flex flex-col bg-card border border-border rounded-lg shadow-elevation transition-all duration-300'>
      {/* 关闭按钮 */}
      <div className='flex justify-end p-2 border-b border-border'>
        <button
          type='button'
          onClick={() => setIsExpanded(false)}
          className='p-1 text-muted-foreground hover:text-foreground rounded'
          title='收起'
        >
          <X className='w-4 h-4' />
        </button>
      </div>

      {/* 消息列表 */}
      <div className='flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px]'>
        {messages.length === 0 && (
          <div className='text-center py-8 text-muted-foreground'>
            <p className='text-sm'>输入描述，让 AI 生成图片</p>
          </div>
        )}

        {messages.map(message => (
          <div key={message.id} className='space-y-1'>
            <div className='flex justify-center'>
              <span className='text-xs text-muted-foreground/60'>
                {formatTime(message.timestamp)}
              </span>
            </div>

            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`relative group max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.role === 'assistant' && (
                  <button
                    type='button'
                    onClick={() => copyToClipboard(message.content)}
                    className='absolute -right-6 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container-high rounded'
                    title='复制'
                  >
                    <span className='text-xs'>复制</span>
                  </button>
                )}

                {message.imageUrl && (
                  <div className='mb-2'>
                    <img src={message.imageUrl} alt='附件' className='max-w-[200px] rounded-lg' />
                  </div>
                )}

                <div className='whitespace-pre-wrap'>{message.content}</div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-muted rounded-xl px-3 py-2'>
              <div className='flex items-center gap-1.5'>
                <div className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce' />
                <div className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]' />
                <div className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]' />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 简化输入框 */}
      <div className='p-3 border-t border-border'>
        <form onSubmit={handleSubmit}>
          <div className='relative flex items-center'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleFileSelect}
            />

            {/* 上传按钮融入输入框左侧 */}
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='absolute left-2 p-1.5 text-muted-foreground hover:text-secondary transition-colors rounded'
              title='上传图片'
            >
              <Upload className='w-4 h-4' />
            </button>

            {/* 输入框 */}
            <input
              type='text'
              name='message'
              placeholder='描述你想要的效果...'
              className='w-full pl-10 pr-10 py-2 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground'
              disabled={isLoading}
            />

            {/* 发送按钮 */}
            <button
              type='submit'
              disabled={isLoading}
              className='absolute right-2 p-1.5 text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
            >
              <Send className='w-4 h-4' />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
