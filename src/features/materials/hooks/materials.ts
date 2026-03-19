import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '../api'
import type { BatchUpdateTagsRequest, CreateMaterialRequest, MaterialsFilter } from '../types'

export const materialKeys = {
  all: ['materials'] as const,
  list: (filter?: MaterialsFilter) => [...materialKeys.all, 'list', filter] as const,
  tags: ['material-tags'] as const,
}

export function useMaterials(filter?: MaterialsFilter) {
  return useQuery({
    queryKey: materialKeys.list(filter),
    queryFn: () => api.getMaterials(filter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
