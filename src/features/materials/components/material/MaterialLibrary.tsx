import { Filter, Grid3x3, Search } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
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
}: {
  materialsCount: number
  search: string
  onSearchChange: (value: string) => void
  filterTagCount: number
  onFilterClick: () => void
}) {
  return (
    <div className='mb-8'>
      <div className='mb-6'>
        <p className='text-xs text-primary-fixed-dim mb-2 tracking-wider'>中央仓库</p>
        <h1 className='text-4xl font-bold text-on-surface mb-2'>素材管理</h1>
        <p className='text-sm text-on-surface-variant'>
          您的合成智能工作站。在这里管理产品视觉效果、生成的场景和营销母版。
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <div className='flex-1 relative group max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline' />
          <input
            type='text'
            placeholder='搜索素材...'
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className='w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary-container/50 focus:outline-none transition-colors'
          />
        </div>

        <button
          type='button'
          onClick={onFilterClick}
          className={cn(
            'px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 border',
            filterTagCount > 0
              ? 'bg-primary-container/10 border-primary-container/40 text-primary-container'
              : 'bg-surface-container-high border-outline-variant/30 text-on-surface-variant hover:text-primary-container hover:border-primary-container/30'
          )}
        >
          <Filter className='w-4 h-4' />
          <span className='text-sm font-medium'>
            {filterTagCount > 0 ? `筛选 ${filterTagCount}` : '筛选'}
          </span>
        </button>
      </div>
    </div>
  )
}

function EmptyState({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className='flex h-[calc(100vh-400px)] items-center justify-center'>
      <button
        type='button'
        onClick={onUploadClick}
        className='flex flex-col items-center justify-center gap-4 p-12 bg-surface-container-low/30 border-dashed border-2 border-outline-variant/30 hover:border-primary-container/50 hover:bg-primary-container/5 transition-all rounded-2xl group'
      >
        <div className='w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform duration-500'>
          <span className='text-4xl'>+</span>
        </div>
        <div className='text-center'>
          <span className='block text-sm font-bold uppercase tracking-widest text-on-surface'>
            上传素材
          </span>
          <span className='block text-[10px] text-on-surface-variant mt-1 uppercase'>
            支持 JPG, PNG, MP4, OBJ
          </span>
        </div>
      </button>
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
    <div className='flex min-h-screen flex-col bg-surface'>
      <div className='flex-1 pt-12 px-12 pb-12'>
        <MaterialsHeader
          materialsCount={materials.length}
          search={search}
          onSearchChange={setSearch}
          filterTagCount={filterTagIds.length}
          onFilterClick={() => setShowFilterModal(true)}
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
          <div className='flex h-[calc(100vh-400px)] items-center justify-center'>
            <div className='text-on-surface-variant'>加载中...</div>
          </div>
        ) : materials.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {materials.map(material => (
              <MaterialCard
                key={material.id}
                material={material}
                isSelected={selectedIds.includes(material.id)}
                onSelect={handleSelect}
              />
            ))}
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='aspect-[3/4] flex flex-col items-center justify-center gap-4 bg-surface-container-low/30 border-dashed border-2 border-outline-variant/30 hover:border-primary-container/50 hover:bg-primary-container/5 transition-all rounded-2xl group'
            >
              <div className='w-16 h-16 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:scale-110 transition-transform duration-500'>
                <span className='text-4xl'>+</span>
              </div>
              <div className='text-center'>
                <span className='block text-sm font-bold uppercase tracking-widest text-on-surface'>
                  上传素材
                </span>
                <span className='block text-[10px] text-on-surface-variant mt-1 uppercase'>
                  支持 JPG, PNG, MP4, OBJ
                </span>
              </div>
            </button>
          </div>
        ) : (
          <EmptyState onUploadClick={() => fileInputRef.current?.click()} />
        )}

        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-surface-container-high/40 backdrop-blur-xl border border-primary-container/10 p-6 rounded-2xl'>
            <div className='flex items-center gap-4 mb-4'>
              <span className='text-primary text-2xl'>💾</span>
              <h5 className='font-bold text-lg text-on-surface'>存储空间</h5>
            </div>
            <div className='w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-3'>
              <div className='h-full bg-primary w-[65%] shadow-[0_0_15px_rgba(0,242,255,0.4)]' />
            </div>
            <div className='flex justify-between text-xs font-medium'>
              <span className='text-on-surface-variant'>已使用 12.4 GB</span>
              <span className='text-primary'>总计 20 GB</span>
            </div>
          </div>

          <div className='bg-surface-container-high/40 backdrop-blur-xl border border-primary-container/10 p-6 rounded-2xl'>
            <div className='flex items-center gap-4 mb-4'>
              <span className='text-secondary text-2xl'>⏳</span>
              <h5 className='font-bold text-lg text-on-surface'>任务队列</h5>
            </div>
            <div className='flex items-center gap-3'>
              <div className='animate-pulse w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_hsl(var(--secondary))]' />
              <span className='text-sm text-on-surface'>正在渲染 "北极系列" 广告活动...</span>
            </div>
          </div>

          <div className='bg-surface-container-high/40 backdrop-blur-xl border border-primary-container/10 p-6 rounded-2xl'>
            <div className='flex items-center gap-4 mb-4'>
              <span className='text-tertiary text-2xl'>✨</span>
              <h5 className='font-bold text-lg text-on-surface'>AI 智能管家</h5>
            </div>
            <p className='text-sm text-on-surface-variant leading-relaxed'>
              检测到 12 张原始照片可以进行自动<b className='text-on-surface'>环境重照明</b>
              优化。建议立即处理以提升渲染品质。
            </p>
            <button
              type='button'
              className='mt-4 text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all'
            >
              处理全部素材 <span>→</span>
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
