import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { generatorApi } from '../api'
import type { ChatMessage } from '../types'

interface UseChatOptions {
  conversationId: string
  onGenerateImage?: (imageUrl: string, position?: { x: number; y: number }) => void
}

export function useChat({ conversationId, onGenerateImage }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const blobUrlsRef = useRef<Set<string>>(new Set())

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach(url => {
        URL.revokeObjectURL(url)
      })
    }
  }, [])

  const sendMessage = useCallback(
    async (message: string, images?: File[]) => {
      if (!message.trim() && !images?.length) return

      const userImageUrls = images?.map(f => {
        const url = URL.createObjectURL(f)
        blobUrlsRef.current.add(url)
        return url
      })

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        imageUrls: userImageUrls,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, userMessage])
      setIsLoading(true)

      try {
        const data = await generatorApi.sendMessage({
          conversationId,
          message,
          images,
        })

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.message.content,
          imageUrls: data.generatedImage?.imageUrl ? [data.generatedImage.imageUrl] : undefined,
          timestamp: Date.now(),
        }
        setMessages(prev => [...prev, assistantMessage])

        if (data.generatedImage?.imageUrl) {
          onGenerateImage?.(data.generatedImage.imageUrl, data.generatedImage.suggestedPosition)
        }
      } catch {
        toast.error('发送消息失败')
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, onGenerateImage]
  )

  const clearMessages = useCallback(() => {
    blobUrlsRef.current.forEach(url => {
      URL.revokeObjectURL(url)
    })
    blobUrlsRef.current.clear()
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  }
}
