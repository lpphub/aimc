import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectsApi, worksApi } from '@/shared/api'
import type { CreateWorkReq, WorksFilter } from '@/shared/types'

export const worksKeys = {
  all: ['works'] as const,
  list: (filter?: WorksFilter) => [...worksKeys.all, 'list', filter] as const,
}

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
}

export function useWorks(filter?: WorksFilter) {
  return useQuery({
    queryKey: worksKeys.list(filter),
    queryFn: () => worksApi.list(filter),
  })
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectsApi.list(),
  })
}

export function useCreateWork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWorkReq) => worksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: worksKeys.all })
    },
  })
}

export function useDeleteWork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => worksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: worksKeys.all })
    },
  })
}
