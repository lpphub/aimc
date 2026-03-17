import { Search, Tag, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useDeleteMaterial, useMaterials, useMaterialTags, useUploadMaterial } from '../hooks'
import { BatchActionBar } from './BatchActionBar'
import { MaterialCard } from './MaterialCard'

export function Materials() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: materials = [], isLoading } = useMaterials({
    tags: tagFilter !== 'all' ? [tagFilter] : undefined,
    search: search || undefined,
  })
  const { data: allTags = [] } = useMaterialTags()
  const uploadMutation = useUploadMaterial()
  const deleteMutation = useDeleteMaterial()

  const handleSelect = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]))
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) {
        toast.error(`${file.name} 不是支持的格式`)
        return
      }
      uploadMutation.mutate({ file })
    })
    e.target.value = ''
  }

  const handleBatchDelete = (ids: string[]) => {
    ids.forEach(id => {
      deleteMutation.mutate(id)
    })
    setSelectedIds([])
  }

  const clearSelection = () => setSelectedIds([])

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>

      <div className='relative z-10 flex-1 p-8'>
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'>
              <Tag className='w-6 h-6 text-purple-400' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white tracking-tight'>素材库</h1>
              <p className='text-sm text-gray-500 mt-1'>
                管理你的图片和视频素材 · {materials.length} 个
              </p>
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
              <input
                type='text'
                placeholder='搜索素材...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='w-full h-10 pl-10 pr-4 bg-gray-900/50 border border-gray-700/30 rounded-md text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors'
              />
            </div>

            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className='w-40 bg-gray-900/50 border-gray-700/30 text-white'>
                <SelectValue placeholder='全部标签' />
              </SelectTrigger>
              <SelectContent className='bg-gray-900/95 border-gray-700/30'>
                <SelectItem value='all'>全部标签</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => fileInputRef.current?.click()}
              className='bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
            >
              <Upload className='w-4 h-4 mr-2' />
              上传素材
            </Button>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*,video/*'
              multiple
              className='hidden'
              onChange={handleUpload}
            />
          </div>
        </div>

        {isLoading ? (
          <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-gray-500'>加载中...</div>
          </div>
        ) : materials.length > 0 ? (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {materials.map(material => (
              <MaterialCard
                key={material.id}
                material={material}
                isSelected={selectedIds.includes(material.id)}
                onSelect={handleSelect}
              />
            ))}
          </div>
        ) : (
          <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-center'>
              <div className='flex justify-center mb-4'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse' />
                  <Tag className='relative w-16 h-16 text-gray-600' />
                </div>
              </div>
              <p className='text-gray-500 text-lg'>暂无素材</p>
              <p className='text-gray-600 text-sm mt-2'>上传你的第一个素材开始管理</p>
            </div>
          </div>
        )}
      </div>

      <BatchActionBar
        selectedIds={selectedIds}
        onClear={clearSelection}
        onDelete={handleBatchDelete}
      />
    </div>
  )
}
