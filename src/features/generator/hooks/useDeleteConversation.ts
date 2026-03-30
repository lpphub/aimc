import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMutationErrorHandler } from '@/shared/utils/query-helpers'
import { generatorApi } from '../api'
import { generatorKeys } from './keys'

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
