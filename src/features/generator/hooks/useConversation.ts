import { useQuery } from '@tanstack/react-query'
import { generatorApi } from '../api'
import { generatorKeys } from './keys'

export function useConversation(id: string) {
  return useQuery({
    queryKey: generatorKeys.conversation(id),
    queryFn: () => generatorApi.getConversation(id),
    enabled: !!id,
  })
}
