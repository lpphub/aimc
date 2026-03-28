import { Paperclip, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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

  return (
    <div className='w-[380px] h-full flex flex-col bg-white border-r'>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                message.role === 'user' ? 'bg-secondary text-white' : 'bg-gray-100'
              }`}
            >
              {message.imageUrl && (
                <img src={message.imageUrl} alt='Attachment' className='w-full rounded-lg mb-2' />
              )}
              <p className='text-sm'>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='p-4 border-t'>
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
            className='p-2 hover:bg-gray-100 rounded-lg'
          >
            <Paperclip className='w-5 h-5' />
          </button>
          <input
            type='text'
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder='描述你想要的效果，让 AI 搞定所有设计'
            className='flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary'
            disabled={isLoading}
          />
          <button
            type='button'
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className='p-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 disabled:opacity-50'
          >
            <Send className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  )
}
