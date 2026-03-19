import { Filter, Search, Tag, Upload } from 'lucide-react'
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
      <div className='flex items-center gap-3 mb-4'>
        <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'>
          <Tag className='w-6 h-6 text-purple-400' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-foreground tracking-tight'>素材库</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            管理你的图片和视频素材 · {materialsCount} 个
          </p>
        </div>
      </div>

      <div className='flex gap-4'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <input
            type='text'
            placeholder='搜索素材...'
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className='w-full h-10 pl-10 pr-4 bg-card/50 border border-border/30 rounded-md text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors'
          />
        </div>

        <Button
          variant='outline'
          onClick={onFilterClick}
          className={
            filterTagCount > 0
              ? 'border-primary/50 text-primary'
              : 'border-border/30 text-foreground'
          }
        >
          <Filter className='w-4 h-4 mr-2' />
          {filterTagCount > 0 ? `标签筛选 ${filterTagCount}` : '标签筛选'}
        </Button>

        <Button
          onClick={onUploadClick}
          className='bg-primary/20 border border-primary/30 text-primary-foreground hover:bg-primary/30'
        >
          <Upload className='w-4 h-4 mr-2' />
          上传素材
        </Button>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className='flex h-[calc(100vh-300px)] items-center justify-center'>
      <div className='text-center'>
        <div className='flex justify-center mb-4'>
          <div className='relative'>
            <div className='absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse' />
            <Tag className='relative w-16 h-16 text-muted-foreground' />
          </div>
        </div>
        <p className='text-muted-foreground text-lg'>暂无素材</p>
        <p className='text-muted-foreground/70 text-sm mt-2'>上传你的第一个素材开始管理</p>
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
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-background'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>

      <div className='relative z-10 flex-1 p-8'>
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
            <div className='text-muted-foreground'>加载中...</div>
          </div>
        ) : materials.length > 0 ? (
          <div className='grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8'>
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
