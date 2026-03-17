import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from './api'
import type { BatchUpdateTagsRequest, CreateMaterialRequest, MaterialsFilter } from './types'

export const materialKeys = {
  all: ['materials'] as const,
  list: (filter?: MaterialsFilter) => [...materialKeys.all, 'list', filter] as const,
  tags: ['material-tags'] as const,
}

export const tagKeys = {
  all: ['tags'] as const,
  groups: () => [...tagKeys.all, 'groups'] as const,
}

export function useMaterials(filter?: MaterialsFilter) {
  return useQuery({
    queryKey: materialKeys.list(filter),
    queryFn: () => api.getMaterials(filter),
  })
}

export function useUploadMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMaterialRequest) => api.uploadMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all })
      toast.success('上传成功')
    },
    onError: () => toast.error('上传失败'),
  })
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteMaterial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all })
      toast.success('删除成功')
    },
    onError: () => toast.error('删除失败'),
  })
}

export function useBatchUpdateTags() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: BatchUpdateTagsRequest) => api.batchUpdateTags(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all })
      toast.success('标签更新成功')
    },
    onError: () => toast.error('标签更新失败'),
  })
}

export function useMaterialTags() {
  return useQuery({
    queryKey: materialKeys.tags,
    queryFn: () => api.getMaterialTags(),
  })
}

export function useTagGroups() {
  return useQuery({
    queryKey: tagKeys.groups(),
    queryFn: () => api.getTagGroups(),
  })
}

export function useCreateTagGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => api.createTagGroup(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.groups() })
      toast.success('标签组创建成功')
    },
    onError: () => toast.error('标签组创建失败'),
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { name: string; groupId?: number }) =>
      api.createTag(params.name, params.groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.groups() })
      toast.success('标签创建成功')
    },
    onError: () => toast.error('标签创建失败'),
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tagId: number) => api.deleteTag(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.groups() })
      toast.success('标签删除成功')
    },
    onError: () => toast.error('标签删除失败'),
  })
}

export function useAddTagsToMaterials() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { materialIds: string[]; tagIds: number[] }) =>
      api.addTagsToMaterials(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.all })
      toast.success('标签添加成功')
    },
    onError: () => toast.error('标签添加失败'),
  })
}
