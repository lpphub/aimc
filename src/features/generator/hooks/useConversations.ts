import { useQuery } from '@tanstack/react-query'
import { generatorApi } from '../api'
import { generatorKeys } from './keys'

export function useConversations() {
  return useQuery({
    queryKey: generatorKeys.conversations(),
    queryFn: () => generatorApi.getConversations(),
  })
}
