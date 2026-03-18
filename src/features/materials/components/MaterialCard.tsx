import { CheckCircle, FileImage, FileVideo } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Material } from '../types'

interface MaterialCardProps {
  material: Material
  isSelected: boolean
  onSelect: (id: string) => void
}

export function MaterialCard({ material, isSelected, onSelect }: MaterialCardProps) {
  const isVideo = material.type === 'video'

  return (
    <div
      className={cn(
        'relative group rounded-md overflow-hidden transition-all duration-200',
        isSelected && 'ring-1 ring-cyan-500 border border-cyan-500'
      )}
    >
      <div className='aspect-square bg-gray-900/50'>
        {isVideo ? (
          <video src={material.url} className='w-full h-full object-cover' muted />
        ) : (
          <img src={material.url} alt={material.filename} className='w-full h-full object-cover' />
        )}

        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />

        <button
          type='button'
          onClick={e => {
            e.stopPropagation()
            onSelect(material.id)
          }}
          className='absolute top-1.5 left-1.5 p-0.5 rounded-full cursor-pointer hover:bg-gray-700/50 transition-colors'
        >
          {isSelected ? (
            <CheckCircle className='w-5 h-5 text-cyan-500 fill-cyan-500/20' />
          ) : (
            <div className='w-5 h-5 rounded-full border border-gray-600 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity' />
          )}
        </button>
      </div>

      <div className='p-3 transition-colors'>
        <div className='flex items-center gap-1.5'>
          {isVideo ? (
            <FileVideo className='w-4 h-4 text-purple-400 flex-shrink-0' />
          ) : (
            <FileImage className='w-4 h-4 text-blue-400 flex-shrink-0' />
          )}
          <p className='text-sm text-white truncate'>{material.filename}</p>
        </div>
        {material.tags.length > 0 && (
          <div className='flex flex-wrap gap-0.5 mt-1'>
            {material.tags.slice(0, 2).map(tag => (
              <span key={tag} className='px-1 py-0.5 text-[10px] bg-gray-800 text-gray-400 rounded'>
                {tag}
              </span>
            ))}
            {material.tags.length > 2 && (
              <span className='px-1 py-0.5 text-[10px] text-gray-500'>
                +{material.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
