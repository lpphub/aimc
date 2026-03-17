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
      role='button'
      tabIndex={0}
      onClick={() => onSelect(material.id)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(material.id)
        }
      }}
      className={cn(
        'relative group cursor-pointer rounded-xl overflow-hidden border transition-all duration-200',
        isSelected
          ? 'border-cyan-500 ring-2 ring-cyan-500/30'
          : 'border-gray-800 hover:border-gray-700'
      )}
    >
      <div className='aspect-square bg-gray-900/50'>
        {isVideo ? (
          <video src={material.url} className='w-full h-full object-cover' muted />
        ) : (
          <img src={material.url} alt={material.filename} className='w-full h-full object-cover' />
        )}

        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />

        <div className='absolute top-2 right-2'>
          {isSelected ? (
            <CheckCircle className='w-6 h-6 text-cyan-500 fill-cyan-500/20' />
          ) : (
            <div className='w-6 h-6 rounded-full border-2 border-gray-600 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity' />
          )}
        </div>

        <div className='absolute top-2 left-2'>
          {isVideo ? (
            <FileVideo className='w-5 h-5 text-purple-400' />
          ) : (
            <FileImage className='w-5 h-5 text-blue-400' />
          )}
        </div>
      </div>

      <div className='p-3'>
        <p className='text-sm text-white truncate'>{material.filename}</p>
        {material.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mt-2'>
            {material.tags.slice(0, 3).map(tag => (
              <span key={tag} className='px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded'>
                {tag}
              </span>
            ))}
            {material.tags.length > 3 && (
              <span className='px-2 py-0.5 text-xs text-gray-500'>+{material.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
