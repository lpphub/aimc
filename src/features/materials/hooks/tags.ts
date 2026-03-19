import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '../api'
import type { TagGroup } from '../types'

export const materialTagKeys = {
  all: ['material-tags'] as const,
  groups: () => [...materialTagKeys.all, 'groups'] as const,
}

export function useTagGroups() {
  return useQuery({
    queryKey: materialTagKeys.groups(),
    queryFn: () => api.getTagGroups(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCreateTagGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => api.createTagGroup(name),
    onMutate: name => {
      const previousGroups = queryClient.getQueryData<TagGroup[]>(materialTagKeys.groups())
      queryClient.setQueryData<TagGroup[]>(materialTagKeys.groups(), old => [
        ...(old || []),
        { id: Date.now(), name, tags: [] },
      ])
      return { previousGroups }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(materialTagKeys.groups(), context?.previousGroups)
      toast.error('标签组创建失败')
    },
    onSuccess: () => {
      toast.success('标签组创建成功')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: materialTagKeys.groups() })
    },
  })
}

export function useDeleteTagGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (groupId: number) => api.deleteTagGroup(groupId),
    onMutate: groupId => {
      const previousGroups = queryClient.getQueryData<TagGroup[]>(materialTagKeys.groups())
      queryClient.setQueryData<TagGroup[]>(materialTagKeys.groups(), old => {
        if (!old) return old
        const groupIndex = old.findIndex(g => g.id === groupId)
        if (groupIndex === -1 || groupIndex === 0) return old
        const deletedGroup = old[groupIndex]
        const newGroups = old.filter(g => g.id !== groupId)
        newGroups[0] = { ...newGroups[0], tags: [...newGroups[0].tags, ...deletedGroup.tags] }
        return newGroups
      })
      return { previousGroups }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(materialTagKeys.groups(), context?.previousGroups)
      toast.error('标签组删除失败')
    },
    onSuccess: () => {
      toast.success('标签组删除成功')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: materialTagKeys.groups() })
    },
  })
}

export function useUpdateTagGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { groupId: number; name: string }) =>
      api.updateTagGroup(params.groupId, params.name),
    onMutate: ({ groupId, name }) => {
      const previousGroups = queryClient.getQueryData<TagGroup[]>(materialTagKeys.groups())
      queryClient.setQueryData<TagGroup[]>(materialTagKeys.groups(), old =>
        old?.map(g => (g.id === groupId ? { ...g, name } : g))
      )
      return { previousGroups }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(materialTagKeys.groups(), context?.previousGroups)
      toast.error('标签组更新失败')
    },
    onSuccess: () => {
      toast.success('标签组更新成功')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: materialTagKeys.groups() })
    },
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { name: string; groupId?: number }) =>
      api.createTag(params.name, params.groupId),
    onMutate: ({ name, groupId }) => {
      const previousGroups = queryClient.getQueryData<TagGroup[]>(materialTagKeys.groups())
      queryClient.setQueryData<TagGroup[]>(materialTagKeys.groups(), old => {
        if (!old) return old
        const targetGroupId = groupId ?? old[0]?.id
        return old.map(g => {
          if (g.id === targetGroupId) {
            return { ...g, tags: [...g.tags, { id: Date.now(), name }] }
          }
          return g
        })
      })
      return { previousGroups }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(materialTagKeys.groups(), context?.previousGroups)
      toast.error('标签创建失败')
    },
    onSuccess: () => {
      toast.success('标签创建成功')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: materialTagKeys.groups() })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tagId: number) => api.deleteTag(tagId),
    onMutate: tagId => {
      const previousGroups = queryClient.getQueryData<TagGroup[]>(materialTagKeys.groups())
      queryClient.setQueryData<TagGroup[]>(materialTagKeys.groups(), old =>
        old?.map(g => ({
          ...g,
          tags: g.tags.filter(t => t.id !== tagId),
        }))
      )
      return { previousGroups }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(materialTagKeys.groups(), context?.previousGroups)
      toast.error('标签删除失败')
    },
    onSuccess: () => {
      toast.success('标签删除成功')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: materialTagKeys.groups() })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { tagId: number; name: string }) =>
      api.updateTag(params.tagId, params.name),
    onMutate: ({ tagId, name }) => {
      const previousGroups = queryClient.getQueryData<TagGroup[]>(materialTagKeys.groups())
      queryClient.setQueryData<TagGroup[]>(materialTagKeys.groups(), old =>
        old?.map(g => ({
          ...g,
          tags: g.tags.map(t => (t.id === tagId ? { ...t, name } : t)),
        }))
      )
      return { previousGroups }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(materialTagKeys.groups(), context?.previousGroups)
      toast.error('标签更新失败')
    },
    onSuccess: () => {
      toast.success('标签更新成功')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: materialTagKeys.groups() })
    },
  })
}
