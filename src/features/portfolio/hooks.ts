import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { portfolioApi, projectApi } from './api'
import type { CreateWorkRequest, WorksFilter } from './types'

export const portfolioKeys = {
  all: ['portfolio'] as const,
  list: (filter?: WorksFilter) => [...portfolioKeys.all, 'list', filter] as const,
}

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
}

export function useWorks(filter?: WorksFilter) {
  return useQuery({
    queryKey: portfolioKeys.list(filter),
    queryFn: () => portfolioApi.list(filter),
  })
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectApi.list(),
  })
}

export function useCreateWork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWorkRequest) => portfolioApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
    },
  })
}

export function useDeleteWork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => portfolioApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: portfolioKeys.all })
    },
  })
}
