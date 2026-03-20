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
    <div className='mb-12'>
      <div className='mb-12 flex justify-between items-end'>
        <div className='max-w-2xl'>
          <span className='text-[#00dbe7] tracking-[0.2em] font-bold uppercase block mb-4 text-[0.6875rem]'>
            中央仓库
          </span>
          <h1 className='font-bold text-5xl tracking-[-0.04em] text-[#e5e2e3] leading-none mb-4'>
            素材管理
          </h1>
          <p className='text-[#b9cacb] text-lg max-w-md'>
            您的合成智能工作站。在这里管理产品视觉效果、生成的场景和营销母版。
          </p>
        </div>
        <div className='flex gap-4'>
          <div className='bg-[#0e0e0f] border border-[#3a494b]/15 flex p-1 rounded-xl'>
            <button
              type='button'
              className='px-6 py-2 bg-[#2a2a2b] text-[#00f2ff] rounded-lg font-medium text-sm'
            >
              图片
            </button>
            <button
              type='button'
              className='px-6 py-2 text-[#b9cacb] hover:text-[#e5e2e3] transition-colors rounded-lg font-medium text-sm'
            >
              视频
            </button>
            <button
              type='button'
              className='px-6 py-2 text-[#b9cacb] hover:text-[#e5e2e3] transition-colors rounded-lg font-medium text-sm'
            >
              模型
            </button>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between gap-6'>
        <div className='flex-1 relative group'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#849495]' />
          <input
            type='text'
            placeholder='按标签、产品或生成日期搜索素材...'
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className='w-full bg-[#0e0e0f] border border-[#3a494b]/15 focus:border-[#00f2ff]/50 focus:ring-0 text-sm py-4 pl-12 rounded-xl placeholder:text-[#849495]/50 transition-all text-[#e5e2e3]'
          />
        </div>
        <button
          type='button'
          onClick={onFilterClick}
          className={cn(
            'bg-[#2a2a2b] px-6 py-4 rounded-xl transition-colors flex items-center gap-2',
            filterTagCount > 0
              ? 'text-[#00f2ff]'
              : 'text-[#b9cacb] hover:text-[#00f2ff]'
          )}
        >
          <Filter className='w-4 h-4' />
          <span className='text-sm font-medium'>筛选</span>
        </button>
        <button
          type='button'
          className='bg-[#2a2a2b] p-4 rounded-xl text-[#b9cacb] hover:text-[#00f2ff] transition-colors'
        >
          <Grid3x3 className='w-5 h-5' />
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
        className='flex flex-col items-center justify-center gap-4 p-12 bg-[#1c1b1c]/30 border-dashed border-2 border-[#3a494b]/30 hover:border-[#00f2ff]/50 hover:bg-[#00f2ff]/5 transition-all rounded-2xl group'
      >
        <div className='w-16 h-16 rounded-full bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff] group-hover:scale-110 transition-transform duration-500'>
          <span className='text-4xl'>+</span>
        </div>
        <div className='text-center'>
          <span className='block text-sm font-bold uppercase tracking-widest text-[#e5e2e3]'>
            上传素材
          </span>
          <span className='block text-[10px] text-[#b9cacb] mt-1 uppercase'>
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
    <div className='flex min-h-screen flex-col bg-[#0e0e0f]'>
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
            <div className='text-[#b9cacb]'>加载中...</div>
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
              className='aspect-[4/5] flex flex-col items-center justify-center gap-4 bg-[#1c1b1c]/30 border-dashed border-2 border-[#3a494b]/30 hover:border-[#00f2ff]/50 hover:bg-[#00f2ff]/5 transition-all rounded-2xl group'
            >
              <div className='w-16 h-16 rounded-full bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff] group-hover:scale-110 transition-transform duration-500'>
                <span className='text-4xl'>+</span>
              </div>
              <div className='text-center'>
                <span className='block text-sm font-bold uppercase tracking-widest text-[#e5e2e3]'>
                  上传素材
                </span>
                <span className='block text-[10px] text-[#b9cacb] mt-1 uppercase'>
                  支持 JPG, PNG, MP4, OBJ
                </span>
              </div>
            </button>
          </div>
        ) : (
          <EmptyState onUploadClick={() => fileInputRef.current?.click()} />
        )}

        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-[#353436]/40 backdrop-blur-xl border border-[#00f2ff]/10 p-6 rounded-2xl'>
            <div className='flex items-center gap-4 mb-4'>
              <span className='text-[#00f2ff] text-2xl'>💾</span>
              <h5 className='font-bold text-lg text-white'>存储空间</h5>
            </div>
            <div className='w-full h-1.5 bg-[#353436] rounded-full overflow-hidden mb-3'>
              <div className='h-full bg-[#00f2ff] w-[65%] shadow-[0_0_15px_rgba(0,242,255,0.4)]' />
            </div>
            <div className='flex justify-between text-xs font-medium'>
              <span className='text-[#b9cacb]'>已使用 12.4 GB</span>
              <span className='text-[#00f2ff]'>总计 20 GB</span>
            </div>
          </div>

          <div className='bg-[#353436]/40 backdrop-blur-xl border border-[#00f2ff]/10 p-6 rounded-2xl'>
            <div className='flex items-center gap-4 mb-4'>
              <span className='text-[#d0bcff] text-2xl'>⏳</span>
              <h5 className='font-bold text-lg text-white'>任务队列</h5>
            </div>
            <div className='flex items-center gap-3'>
              <div className='animate-pulse w-2 h-2 rounded-full bg-[#d0bcff] shadow-[0_0_8px_#d0bcff]' />
              <span className='text-sm text-[#e5e2e3]'>正在渲染 "北极系列" 广告活动...</span>
            </div>
          </div>

          <div className='bg-[#353436]/40 backdrop-blur-xl border border-[#00f2ff]/10 p-6 rounded-2xl'>
            <div className='flex items-center gap-4 mb-4'>
              <span className='text-[#00dbe7] text-2xl'>✨</span>
              <h5 className='font-bold text-lg text-white'>AI 智能管家</h5>
            </div>
            <p className='text-sm text-[#b9cacb] leading-relaxed'>
              检测到 12 张原始照片可以进行自动<b className='text-white'>环境重照明</b>
              优化。建议立即处理以提升渲染品质。
            </p>
            <button
              type='button'
              className='mt-4 text-[#00f2ff] text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all'
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
