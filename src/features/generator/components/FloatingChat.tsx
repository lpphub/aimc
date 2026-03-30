import { ArrowLeft, ImagePlus, MessageSquare, Minimize2, Send, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCanvas } from '../hooks/useCanvas'
import { useChat } from '../hooks/useChat'
import { type PendingImage, useChatStore } from '../stores/chat'

interface FloatingChatProps {
  conversationId: string
}

export function FloatingChat({ conversationId }: FloatingChatProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { handleAddImage } = useCanvas()

  const pendingMessage = useChatStore(state => state.pendingMessage)
  const clearPendingMessage = useChatStore(state => state.clearPendingMessage)

  const { messages, isLoading, sendMessage } = useChat({
    conversationId,
    onGenerateImage: handleAddImage,
  })

  const processedRef = useRef(false)
  const prevMessagesLengthRef = useRef(0)
  const prevLoadingRef = useRef(false)

  useEffect(() => {
    if (pendingMessage && !processedRef.current) {
      processedRef.current = true
      const { text, images } = pendingMessage
      clearPendingMessage()
      sendMessage(
        text,
        images.map(img => img.file)
      )
    }
  }, [pendingMessage, clearPendingMessage, sendMessage])

  // Scroll to bottom when messages added or loading state changes
  useEffect(() => {
    const messagesChanged = messages.length !== prevMessagesLengthRef.current
    const loadingChanged = isLoading !== prevLoadingRef.current
    prevMessagesLengthRef.current = messages.length
    prevLoadingRef.current = isLoading

    if (messagesChanged || loadingChanged) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!inputValue.trim() && pendingImages.length === 0) || isLoading) return

    const message = inputValue.trim() || '[图片]'
    const images = pendingImages.map(img => img.file)

    pendingImages.forEach(img => {
      URL.revokeObjectURL(img.url)
    })
    setInputValue('')
    setPendingImages([])

    await sendMessage(message, images)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || isLoading) return

    const newImages = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file,
    }))
    setPendingImages(prev => [...prev, ...newImages])
    e.target.value = ''
  }

  const removePendingImage = (index: number) => {
    const img = pendingImages[index]
    if (img) {
      URL.revokeObjectURL(img.url)
      setPendingImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

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

  return (
    <div className='absolute left-4 top-20 bottom-20 z-50 w-100 flex flex-col bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.3)] transition-all duration-300'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center'>
            <MessageSquare className='w-4 h-4 text-primary' />
          </div>
          <span className='text-sm font-medium text-foreground'>AI 绘图助手</span>
        </div>
        <div className='flex items-center gap-1'>
          <button
            type='button'
            onClick={() => navigate('/canvas')}
            className='p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors'
            title='返回'
          >
            <ArrowLeft className='w-4 h-4' />
          </button>
          <button
            type='button'
            onClick={() => setIsExpanded(false)}
            className='p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors'
            title='收起'
          >
            <Minimize2 className='w-4 h-4' />
          </button>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-4 min-h-0'>
        {messages.length === 0 && !isLoading && (
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
            <div className='flex justify-center'>
              <span className='text-[10px] text-muted-foreground/40 font-medium tracking-wide'>
                {formatTime(message.timestamp)}
              </span>
            </div>

            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`relative group max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-muted text-foreground mr-8 border border-border/30'
                }`}
              >
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

                {message.imageUrls && message.imageUrls.length > 0 && (
                  <div className='mb-2 flex flex-wrap gap-2'>
                    {message.imageUrls.map(url => (
                      <img
                        key={url}
                        src={url}
                        alt='图片'
                        className='max-w-[120px] max-h-[120px] rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden'
                        onClick={() => window.open(url, '_blank')}
                        onKeyDown={e => {
                          if (e.key === 'Enter') window.open(url, '_blank')
                        }}
                      />
                    ))}
                  </div>
                )}

                {message.content && (
                  <div className='whitespace-pre-wrap leading-relaxed'>{message.content}</div>
                )}
              </div>
            </div>
          </div>
        ))}

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

      <div className='shrink-0 p-4 border-t border-border/50 bg-card/50'>
        <form onSubmit={handleSubmit}>
          <div className='bg-muted/50 rounded-2xl border border-border/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={handleFileSelect}
            />

            {pendingImages.length > 0 && (
              <div className='flex flex-wrap gap-2 mx-3 mt-2'>
                {pendingImages.map((img, index) => (
                  <div key={img.url} className='relative'>
                    <img src={img.url} alt='待发送图片' className='h-5 w-10 rounded object-cover' />
                    <button
                      type='button'
                      onClick={() => removePendingImage(index)}
                      className='absolute -top-1.5 -right-1.5 p-0.5 bg-background rounded-full text-muted-foreground hover:text-destructive transition-colors shadow-sm'
                      title='移除图片'
                    >
                      <XCircle className='w-3 h-3' />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder='描述你想要的效果...'
              className='w-full px-4 py-3 text-sm bg-transparent border-0 rounded-t-2xl focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60 resize-none max-h-32 leading-relaxed overflow-y-auto'
              disabled={isLoading}
              rows={3}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />

            <div className='flex items-center justify-between px-2 pb-2 pt-0.5'>
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className='p-1.5 text-muted-foreground/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-all disabled:opacity-40'
                title='上传图片'
              >
                <ImagePlus className='w-4 h-4' />
              </button>
              <button
                type='submit'
                disabled={isLoading || (!inputValue.trim() && pendingImages.length === 0)}
                className='p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)]'
              >
                <Send className='w-4 h-4' />
              </button>
            </div>
          </div>
          <div className='flex items-center justify-end mt-3 px-1'>
            <span className='text-xs text-muted-foreground/40'>
              按 Enter 发送，Shift + Enter 换行
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
