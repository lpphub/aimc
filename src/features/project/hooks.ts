import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  type CreateProjectReq,
  type CreateRecordReq,
  projectApi,
  recordApi,
  tagApi,
  templateApi,
  type UpdateProjectReq,
  type UpdateRecordReq,
} from './api'

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
}

export const templateKeys = {
  all: ['templates'] as const,
  list: (type?: 'copy' | 'image' | 'video') => [...templateKeys.all, 'list', type] as const,
}

export const tagKeys = {
  all: ['tags'] as const,
  list: () => [...tagKeys.all, 'list'] as const,
}

export const recordKeys = {
  all: ['records'] as const,
  list: (projectId: string) => [...recordKeys.all, 'list', projectId] as const,
  detail: (projectId: string, id: string) => [...recordKeys.all, 'detail', projectId, id] as const,
}

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectApi.list(),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectApi.get(id),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProjectReq) => projectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProjectReq) => projectApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.list() })
    },
  })
}

export function useTemplates(type?: 'copy' | 'image' | 'video') {
  return useQuery({
    queryKey: templateKeys.list(type),
    queryFn: () => templateApi.list(type),
  })
}

export function useRecords(projectId: string) {
  return useQuery({
    queryKey: recordKeys.list(projectId),
    queryFn: () => recordApi.list(projectId),
    enabled: !!projectId,
  })
}

export function useCreateRecord(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRecordReq) => recordApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recordKeys.list(projectId) })
    },
  })
}

export function useUpdateRecord(projectId: string, id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateRecordReq) => recordApi.update(projectId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recordKeys.list(projectId) })
      queryClient.invalidateQueries({ queryKey: recordKeys.detail(projectId, id) })
    },
  })
}

export function useDeleteRecord(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => recordApi.delete(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recordKeys.list(projectId) })
    },
  })
}

export function useTags() {
  return useQuery({
    queryKey: tagKeys.list(),
    queryFn: () => tagApi.list(),
  })
}
