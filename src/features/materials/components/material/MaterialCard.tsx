import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Material } from '../../types'

interface MaterialCardProps {
  material: Material
  isSelected: boolean
  onSelect: (id: string) => void
}

function MaterialContent({ material }: { material: Material }) {
  return material.type === 'video' ? (
    <video src={material.url} className='w-full h-full object-cover' muted />
  ) : (
    <img src={material.url} alt={material.filename} className='w-full h-full object-cover' />
  )
}

export function MaterialCard({ material, isSelected, onSelect }: MaterialCardProps) {
  const isVideo = material.type === 'video'
  const tagLabel = material.tags[0] || (isVideo ? '无背景' : '成品海报')
  const tagColorClass = isVideo
    ? 'bg-[#571bc1]/30 backdrop-blur-md text-[#d0bcff]'
    : 'bg-[#00f2ff]/20 backdrop-blur-md text-[#00f2ff]'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-[#1c1b1c] border transition-all duration-300 group',
        'aspect-[4/5]',
        isSelected
          ? 'border-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.15)]'
          : 'border-[#3a494b]/50 hover:border-[#00f2ff] hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:-translate-y-1'
      )}
    >
      <div className='absolute inset-0'>
        <div className='w-full h-full group-hover:scale-110 transition-transform duration-700 overflow-hidden'>
          <MaterialContent material={material} />
        </div>
      </div>

      <div className='absolute inset-0 bg-linear-to-t from-[#131314] via-[#131314]/20 to-transparent' />

      <div className='absolute top-4 left-4'>
        <span className={cn('text-[10px] font-bold px-2 py-1 rounded uppercase', tagColorClass)}>
          {tagLabel}
        </span>
      </div>

      <button
        type='button'
        onClick={e => {
          e.stopPropagation()
          onSelect(material.id)
        }}
        className='absolute top-4 right-4 transition-all'
        aria-label={isSelected ? '取消选择' : '选择'}
      >
        {isSelected && (
          <CheckCircle className='w-5 h-5 text-[#00f2ff] fill-[#00f2ff]' />
        )}
      </button>

      <div className='absolute bottom-0 p-5 w-full'>
        <h3 className='font-bold text-lg text-white'>{material.filename}</h3>
        <p className='text-[#b9cacb] text-xs mt-1'>
          {isVideo ? 'PNG • 透明背景' : '4K • 2小时前生成'}
        </p>
        <div className='mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
          <button
            type='button'
            className='flex-1 bg-[#00f2ff] text-[#00363a] py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all'
          >
            下载
          </button>
          <button
            type='button'
            className='p-2 bg-[#353436] text-white rounded-lg hover:bg-[#2a2a2b] transition-colors'
          >
            <span className='text-sm'>⋯</span>
          </button>
        </div>
      </div>
    </div>
  )
}
