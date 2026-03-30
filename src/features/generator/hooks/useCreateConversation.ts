import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMutationErrorHandler } from '@/shared/utils/query-helpers'
import { generatorApi } from '../api'
import { generatorKeys } from './keys'
import type { CreateConversationReq } from '../types'

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