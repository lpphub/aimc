import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMutationErrorHandler } from '@/shared/utils/query-helpers'
import { generatorApi } from '../api'
import type { CreateConversationReq } from '../types'
import { generatorKeys } from './keys'

/**
 * 获取对话列表
 */
export function useConversations() {
  return useQuery({
    queryKey: generatorKeys.conversations(),
    queryFn: () => generatorApi.getConversations(),
  })
}

/**
 * 获取单个对话详情
 */
export function useConversation(id: string) {
  return useQuery({
    queryKey: generatorKeys.conversation(id),
    queryFn: () => generatorApi.getConversation(id),
    enabled: !!id,
  })
}

/**
 * 创建对话
 */
export function useCreateConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateConversationReq) => generatorApi.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: generatorKeys.conversations() })
    },
    onError: createMutationErrorHandler('创建对话失败'),
  })
}

/**
 * 删除对话
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => generatorApi.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: generatorKeys.conversations() })
    },
    onError: createMutationErrorHandler('删除对话失败'),
  })
}
