import { Copy, ImageIcon, MessageSquare, Send, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { canvasGeneratorApi } from '../api'
import { useCanvas } from '../hooks/useCanvas'
import type { ChatMessage } from '../types'

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { handleAddImage } = useCanvas()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  const sendMessage = async (image?: File) => {
    if (!input.trim() && !image) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      imageUrl: image ? URL.createObjectURL(image) : undefined,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await canvasGeneratorApi.sendMessage({
        conversationId,
        message: input,
        image,
      })

      setConversationId(response.conversationId)

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message.content,
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, assistantMessage])

      if (response.generatedImage?.imageUrl) {
        handleAddImage(response.generatedImage.imageUrl, response.generatedImage.suggestedPosition)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      toast.error('发送消息失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      sendMessage(file)
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <div className='w-[380px] h-full flex flex-col bg-white border-r'>
      {/* Header */}
      <div className='flex items-center gap-3 px-4 py-3 border-b bg-gray-50/50'>
        <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10'>
          <MessageSquare className='w-4 h-4 text-secondary' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-medium text-foreground truncate'>AI 对话生成图片</h3>
          <p className='text-xs text-muted-foreground truncate'>在线</p>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30'>
        {messages.length === 0 && (
          <div className='text-center py-8 text-muted-foreground'>
            <div className='flex justify-center mb-3'>
              <ImageIcon className='w-12 h-12 text-gray-300' />
            </div>
            <p className='text-sm'>上传图片或输入描述</p>
            <p className='text-xs mt-1'>AI 将为您生成营销图片</p>
          </div>
        )}

        {messages.map(message => (
          <div key={message.id} className='space-y-1'>
            {/* Timestamp */}
            <div className='flex justify-center'>
              <span className='text-xs text-muted-foreground/60'>
                {formatTime(message.timestamp)}
              </span>
            </div>

            {/* Message bubble */}
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`relative group max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === 'user'
                    ? 'bg-secondary text-white'
                    : 'bg-white border border-gray-200 text-foreground'
                }`}
              >
                {/* Copy button for assistant messages */}
                {message.role === 'assistant' && (
                  <button
                    type='button'
                    onClick={() => copyToClipboard(message.content)}
                    className='absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 rounded'
                    title='复制'
                  >
                    <Copy className='w-3.5 h-3.5 text-gray-400' />
                  </button>
                )}

                {/* Image attachment */}
                {message.imageUrl && (
                  <div className='mb-2'>
                    <img src={message.imageUrl} alt='附件' className='max-w-[200px] rounded-lg' />
                  </div>
                )}

                {/* Text content */}
                <div className='whitespace-pre-wrap'>{message.content}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='bg-white border border-gray-200 rounded-2xl px-4 py-3'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-secondary rounded-full animate-bounce' />
                <div className='w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.2s]' />
                <div className='w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:0.4s]' />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className='p-4 border-t bg-white'>
        <div className='flex flex-col gap-2'>
          {/* Text input */}
          <div className='flex items-center gap-2'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleFileSelect}
            />
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='p-2 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-colors'
              title='上传图片'
            >
              <Upload className='w-5 h-5' />
            </button>
            <input
              type='text'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder='描述你想要的效果，让 AI 搞定所有设计'
              className='flex-1 px-3 py-2 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 placeholder:text-gray-400'
              disabled={isLoading}
            />
            <button
              type='button'
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className='p-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
            >
              <Send className='w-4 h-4' />
            </button>
          </div>

          {/* Quick actions */}
          <div className='flex items-center gap-2 px-1'>
            <button
              type='button'
              className='text-xs text-gray-400 hover:text-secondary transition-colors'
              onClick={() => setInput('生成场景图')}
            >
              生成场景图
            </button>
            <span className='text-gray-300'>|</span>
            <button
              type='button'
              className='text-xs text-gray-400 hover:text-secondary transition-colors'
              onClick={() => setInput('生成卖点图')}
            >
              生成卖点图
            </button>
            <span className='text-gray-300'>|</span>
            <button
              type='button'
              className='text-xs text-gray-400 hover:text-secondary transition-colors'
              onClick={() => setInput('生成白底图')}
            >
              生成白底图
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
