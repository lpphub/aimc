import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { generatorApi } from '../api'
import type { ChatMessage } from '../types'

interface UseChatOptions {
  conversationId: string
  onGenerateImage?: (imageUrl: string, position?: { x: number; y: number }) => void
}

export function useChat({ conversationId, onGenerateImage }: UseChatOptions) {
  const queryClient = useQueryClient()

  const queryKey = ['chat-messages', conversationId] as const

  const messages = queryClient.getQueryData<ChatMessage[]>(queryKey) ?? []

  const setMessages = useCallback(
    (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      const current = queryClient.getQueryData<ChatMessage[]>(queryKey) ?? []
      const next = typeof updater === 'function' ? updater(current) : updater
      queryClient.setQueryData(queryKey, next)
    },
    [queryClient, queryKey]
  )

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, image }: { message: string; image?: File }) => {
      const response = await generatorApi.sendMessage({
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
    queryClient.setQueryData(queryKey, [])
  }, [queryClient, queryKey])

  return {
    messages,
    isLoading: sendMessageMutation.isPending,
    sendMessage,
    clearMessages,
  }
}
