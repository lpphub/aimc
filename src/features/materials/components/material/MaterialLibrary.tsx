import { Filter, Grid3x3, LayoutGrid, Search, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { useDeleteMaterial, useMaterials, useTagGroups, useUploadMaterial } from '../../hooks'
import { TagModal } from '../tag/TagModal'
import { MaterialBatchToolbar } from './MaterialBatchToolbar'
import { MaterialCard } from './MaterialCard'

function MaterialsHeader({
  materialsCount,
  search,
  onSearchChange,
  filterTagCount,
  onFilterClick,
  onUploadClick,
}: {
  materialsCount: number
  search: string
  onSearchChange: (value: string) => void
  filterTagCount: number
  onFilterClick: () => void
  onUploadClick: () => void
}) {
  return (
    <div className='mb-8'>
      <div className='mb-6'>
        <p className='text-xs text-cyan-400 mb-2 tracking-wider'>中央仓库</p>
        <h1 className='text-4xl font-bold text-white mb-2'>素材管理</h1>
        <p className='text-sm text-gray-400'>
          您的合成能工作品。在这里管理产品视觉效果、生成的场景和专辑模板。
        </p>
      </div>

      <div className='flex items-center gap-3 mb-6'>
        <Button
          variant='outline'
          className='bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
        >
          图片
        </Button>
        <Button variant='ghost' className='text-gray-400 hover:text-white hover:bg-white/5'>
          视频
        </Button>
        <Button variant='ghost' className='text-gray-400 hover:text-white hover:bg-white/5'>
          模型
        </Button>
      </div>

      <div className='flex items-center gap-3'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
          <input
            type='text'
            placeholder='搜索素材、产品或项目标签或系统...'
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className='w-full h-10 pl-10 pr-4 bg-[#1a1f2e] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors'
          />
        </div>

        <Button
          variant='outline'
          onClick={onFilterClick}
          className={
            filterTagCount > 0
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              : 'bg-[#1a1f2e] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
          }
        >
          <Filter className='w-4 h-4 mr-2' />
          {filterTagCount > 0 ? `筛选 ${filterTagCount}` : '筛选'}
        </Button>

        <Button
          variant='outline'
          className='bg-[#1a1f2e] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
        >
          <Grid3x3 className='w-4 h-4' />
        </Button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
      <div className='text-center'>
        <LayoutGrid className='w-16 h-16 text-gray-600 mx-auto mb-4' />
        <p className='text-gray-400 text-lg'>暂无素材</p>
        <p className='text-gray-600 text-sm mt-2'>上传你的第一个素材开始管理</p>
      </div>
    </div>
  )
}

export function MaterialLibrary() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [filterTagIds, setFilterTagIds] = useState<number[]>([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: groups = [] } = useTagGroups()
  const allTags = groups.flatMap(g => g.tags)

  const filterTagNames = filterTagIds
    .map(id => allTags.find(t => t.id === id)?.name)
    .filter(Boolean) as string[]

  const { data: materials = [], isLoading } = useMaterials({
    tags: filterTagNames.length > 0 ? filterTagNames : undefined,
    search: search || undefined,
  })

  const upload = useUploadMaterial()
  const deleteMaterial = useDeleteMaterial()

  const handleSelect = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]))
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) {
        toast.error(`${file.name} 不是支持的格式`)
        continue
      }
      upload.mutate({ file })
    }
    e.target.value = ''
  }

  const handleBatchDelete = (ids: string[]) => {
    for (const id of ids) {
      deleteMaterial.mutate(id)
    }
    setSelectedIds([])
  }

  return (
    <div className='flex min-h-screen flex-col bg-[#0a0e14]'>
      <div className='flex-1 p-8'>
        <MaterialsHeader
          materialsCount={materials.length}
          search={search}
          onSearchChange={setSearch}
          filterTagCount={filterTagIds.length}
          onFilterClick={() => setShowFilterModal(true)}
          onUploadClick={() => fileInputRef.current?.click()}
        />
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*,video/*'
          multiple
          className='hidden'
          onChange={handleUpload}
        />

        {isLoading ? (
          <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-gray-400'>加载中...</div>
          </div>
        ) : materials.length > 0 ? (
          <div className='grid grid-cols-4 gap-4'>
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
          <EmptyState />
        )}
      </div>

      <div className='border-t border-white/5 bg-[#0f1419] p-4'>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 rounded-full bg-cyan-400' />
              <span className='text-sm text-gray-400'>存储空间</span>
            </div>
            <div className='w-48 h-2 bg-[#1a1f2e] rounded-full overflow-hidden'>
              <div className='h-full w-1/3 bg-linear-to-r from-cyan-400 to-teal-400' />
            </div>
            <span className='text-xs text-gray-500'>已使用 12.4 GB</span>
            <span className='text-xs text-cyan-400'>共计 20 GB</span>
          </div>

          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 rounded-full bg-purple-400' />
              <span className='text-sm text-gray-400'>任务队列</span>
            </div>
            <span className='text-xs text-gray-500'>
              正在渲染 "北欧风列表广告" 广告素材...
            </span>
          </div>

          <div className='text-right'>
            <p className='text-sm text-cyan-400 mb-1'>AI 智能管家</p>
            <p className='text-xs text-gray-500'>
              经测到 12 张类似图片可以进行自动标签或建议去重。
            </p>
            <button
              type='button'
              className='text-xs text-cyan-400 hover:text-cyan-300 mt-1 flex items-center gap-1'
            >
              处理全部素材 →
            </button>
          </div>
        </div>
      </div>

      <MaterialBatchToolbar
        selectedIds={selectedIds}
        onClear={() => setSelectedIds([])}
        onDelete={handleBatchDelete}
      />

      <TagModal
        open={showFilterModal}
        onOpenChange={setShowFilterModal}
        selectedTagIds={filterTagIds}
        onConfirm={ids => {
          setFilterTagIds(ids)
          setShowFilterModal(false)
        }}
      />
    </div>
  )
}
