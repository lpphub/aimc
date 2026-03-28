import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { canvasGeneratorApi } from '../api'
import type { ChatMessage } from '../types'

const CHAT_MESSAGES_KEY = 'chat-messages'

export function useChat(
  onGenerateImage?: (imageUrl: string, position?: { x: number; y: number }) => void
) {
  const queryClient = useQueryClient()
  const [conversationId, setConversationId] = useState<string>()

  const messages = queryClient.getQueryData<ChatMessage[]>([CHAT_MESSAGES_KEY]) ?? []

  const setMessages = useCallback(
    (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      const current = queryClient.getQueryData<ChatMessage[]>([CHAT_MESSAGES_KEY]) ?? []
      const next = typeof updater === 'function' ? updater(current) : updater
      queryClient.setQueryData([CHAT_MESSAGES_KEY], next)
    },
    [queryClient]
  )

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, image }: { message: string; image?: File }) => {
      const response = await canvasGeneratorApi.sendMessage({
        conversationId,
        message,
        image,
      })
      return response
    },
    onMutate: async ({ message, image }) => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        imageUrl: image ? URL.createObjectURL(image) : undefined,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, userMessage])
    },
    onSuccess: data => {
      setConversationId(data.conversationId)

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message.content,
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, assistantMessage])

      if (data.generatedImage?.imageUrl) {
        onGenerateImage?.(data.generatedImage.imageUrl, data.generatedImage.suggestedPosition)
      }
    },
    onError: () => {
      toast.error('发送消息失败')
    },
  })

  const sendMessage = useCallback(
    async (message: string, image?: File) => {
      if (!message.trim() && !image) return
      await sendMessageMutation.mutateAsync({ message, image })
    },
    [sendMessageMutation]
  )

  const clearMessages = useCallback(() => {
    queryClient.setQueryData([CHAT_MESSAGES_KEY], [])
    setConversationId(undefined)
  }, [queryClient])

  return {
    messages,
    isLoading: sendMessageMutation.isPending,
    conversationId,
    sendMessage,
    clearMessages,
  }
}
