import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMutationErrorHandler } from '@/shared/utils/query-helpers'
import { generatorApi } from '../api'
import type { CreateConversationReq } from '../types'
import { generatorKeys } from './keys'

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
