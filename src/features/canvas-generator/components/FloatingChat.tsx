import { ImagePlus, MessageSquare, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useCanvas } from '../hooks/useCanvas'

// Mock 响应图片列表
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
  'https://images.unsplash.com/photo-1585386959980-a93cfa7ed2c7?w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
  timestamp: number
}

export function FloatingChat() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { handleAddImage } = useCanvas()

  useEffect(() => {
    if (isExpanded && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isExpanded])

  // 自动调整 textarea 高度
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Mock 延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 随机选择一张图片
    const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)]
    const randomX = 100 + Math.random() * 400
    const randomY = 100 + Math.random() * 300

    // 添加到画布
    handleAddImage(randomImage, { x: randomX, y: randomY })

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `已为您生成图片："${userMessage.content}"`,
      imageUrl: randomImage,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || isLoading) return

    const imageUrl = URL.createObjectURL(file)
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: '',
      imageUrl,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Mock 延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 随机选择一张图片作为响应
    const randomImage = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)]
    const randomX = 100 + Math.random() * 400
    const randomY = 100 + Math.random() * 300

    // 添加到画布
    handleAddImage(randomImage, { x: randomX, y: randomY })

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '已根据您上传的图片生成新的创意图片',
      imageUrl: randomImage,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)
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
        className='absolute left-4 top-20 z-50 p-3 bg-card/90 backdrop-blur-xl border border-primary/30 text-primary rounded-2xl shadow-[0_0_40px_rgba(0,242,255,0.15)] hover:shadow-[0_0_60px_rgba(0,242,255,0.25)] hover:border-primary/50 hover:scale-105 transition-all duration-300'
        title='打开聊天'
      >
        <MessageSquare className='w-5 h-5' />
      </button>
    )
  }

  // 展开状态：显示完整面板
  return (
    <div className='absolute left-4 top-20 bottom-20 z-50 w-[400px] flex flex-col bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.3)] transition-all duration-300'>
      {/* 头部区域 */}
      <div className='flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center'>
            <MessageSquare className='w-4 h-4 text-primary' />
          </div>
          <span className='text-sm font-medium text-foreground'>AI 绘图助手</span>
        </div>
        <button
          type='button'
          onClick={() => setIsExpanded(false)}
          className='p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors'
          title='收起'
        >
          <X className='w-4 h-4' />
        </button>
      </div>

      {/* 消息列表 */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 min-h-0'>
        {messages.length === 0 && (
          <div className='text-center py-12 text-muted-foreground space-y-3'>
            <div className='w-12 h-12 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center'>
              <MessageSquare className='w-6 h-6 text-muted-foreground/50' />
            </div>
            <div>
              <p className='text-sm font-medium'>输入描述，让 AI 生成图片</p>
              <p className='text-xs text-muted-foreground/60 mt-1'>支持上传图片作为参考</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={message.id} className={`space-y-1 ${index === 0 ? '' : 'mt-4'}`}>
            {/* 时间戳 */}
            <div className='flex justify-center'>
              <span className='text-[10px] text-muted-foreground/40 font-medium tracking-wide'>
                {formatTime(message.timestamp)}
              </span>
            </div>

            {/* 消息气泡 */}
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`relative group max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-muted text-foreground mr-8 border border-border/30'
                }`}
              >
                {/* 复制按钮 */}
                {message.role === 'assistant' && message.content && (
                  <button
                    type='button'
                    onClick={() => copyToClipboard(message.content)}
                    className='absolute -right-10 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-surface-container-high rounded-lg text-muted-foreground hover:text-foreground'
                    title='复制'
                  >
                    <span className='text-[10px] font-medium'>复制</span>
                  </button>
                )}

                {/* 图片 */}
                {message.imageUrl && (
                  <div className='mb-2 overflow-hidden rounded-xl'>
                    <img
                      src={message.imageUrl}
                      alt='生成的图片'
                      className='max-w-full rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer'
                      onClick={() => window.open(message.imageUrl, '_blank')}
                    />
                  </div>
                )}

                {/* 文本内容 */}
                {message.content && (
                  <div className='whitespace-pre-wrap leading-relaxed'>{message.content}</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* 加载状态 */}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-muted/80 rounded-2xl px-4 py-3 border border-border/20'>
              <div className='flex items-center gap-2'>
                <div
                  className='w-2 h-2 bg-primary rounded-full animate-bounce'
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className='w-2 h-2 bg-primary rounded-full animate-bounce'
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className='w-2 h-2 bg-primary rounded-full animate-bounce'
                  style={{ animationDelay: '300ms' }}
                />
                <span className='text-xs text-muted-foreground ml-2'>AI 正在生成...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入框区域 */}
      <div className='p-4 border-t border-border/50 bg-card/50'>
        <form onSubmit={handleSubmit}>
          <div className='relative bg-muted/50 rounded-2xl border border-border/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleFileSelect}
            />

            {/* 输入框 */}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={e => {
                setInputValue(e.target.value)
                adjustTextareaHeight()
              }}
              onInput={adjustTextareaHeight}
              placeholder='描述你想要的效果...'
              className='w-full px-4 py-3 pr-14 text-sm bg-transparent border-0 rounded-2xl focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60 resize-none min-h-[44px] max-h-[120px]'
              disabled={isLoading}
              rows={1}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />

            {/* 上传按钮 */}
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className='absolute left-2 bottom-2 p-2 text-muted-foreground/60 hover:text-primary hover:bg-primary/10 rounded-xl transition-all disabled:opacity-40'
              title='上传图片'
            >
              <ImagePlus className='w-4 h-4' />
            </button>

            {/* 发送按钮 */}
            <button
              type='submit'
              disabled={isLoading || !inputValue.trim()}
              className='absolute right-2 bottom-2 p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)]'
            >
              <Send className='w-4 h-4' />
            </button>
          </div>
          <div className='flex items-center justify-between mt-2 px-1'>
            <span className='text-[10px] text-muted-foreground/40'>
              按 Enter 发送，Shift + Enter 换行
            </span>
            <span className='text-[10px] text-muted-foreground/40'>支持 JPG、PNG</span>
          </div>
        </form>
      </div>
    </div>
  )
}
