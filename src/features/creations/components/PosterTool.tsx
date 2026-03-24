import { Bolt, Download, Image, Palette, Plus, Share, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { ToolHeader } from './ToolGrid'

interface PosterToolProps {
  onBack: () => void
}

const aspectRatios = ['9:16', '3:4', '1:1']

const colorTones = [
  { color: '#00F2FF', label: '赛博青' },
  { color: '#8B5CF6', label: '星云紫' },
  { color: '#FFB4AB', label: '霓虹粉' },
  { color: '#FAF6F9', label: '极光白' },
]

const stylePresets = [
  { id: 'cyberpunk', name: '赛博朋克 / Cyberpunk', active: true },
  { id: 'minimalist', name: '极简主义 / Minimalist', active: false },
  { id: 'hyperreal', name: '超写实 / Hyper-realistic', active: false },
]

export function PosterTool({ onBack }: PosterToolProps) {
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [selectedColor, setSelectedColor] = useState(colorTones[0].color)
  const [selectedStyle, setSelectedStyle] = useState('cyberpunk')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          toast.success('海报生成完成')
          return 100
        }
        return prev + 2
      })
    }, 60)
  }

  return (
    <div className='flex-1 flex flex-col px-8'>
      <ToolHeader title='海报创作' icon={Image} onBack={onBack} />

      <p className='text-on-surface-variant text-sm leading-relaxed -mt-4 mb-8'>
        利用AI算力构建极简主义视觉。上传资产，配置参数，即刻获取高清专业级电商海报。
      </p>

      {/* Bento Grid */}
      <div className='grid grid-cols-12 gap-8 items-start'>
        {/* Left Control Panel */}
        <div className='col-span-12 lg:col-span-4 space-y-6'>
          {/* Asset Upload */}
          <div className='bg-surface-container-low rounded-xl p-8 border-t border-primary-container/20'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='font-headline text-lg font-bold text-tertiary'>1. 资产上传</h2>
              <Upload className='w-5 h-5 text-primary-container' />
            </div>
            <input ref={fileInputRef} type='file' accept='image/*' className='hidden' />
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='w-full border-2 border-dashed border-outline-variant/30 rounded-lg p-10 flex flex-col items-center justify-center hover:border-primary-container/50 transition-colors cursor-pointer bg-surface-container-lowest'
            >
              <Plus className='w-10 h-10 text-on-surface-variant group-hover:text-primary-container mb-4' />
              <p className='text-sm text-on-surface-variant font-medium'>点击或拖拽上传主图资产</p>
              <p className='text-[0.625rem] text-outline mt-2 uppercase tracking-widest'>
                PNG, JPG, WebP (Max 10MB)
              </p>
            </button>
          </div>

          {/* Parameter Config */}
          <div className='bg-surface-container-low rounded-xl p-8 border-t border-primary-container/20'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='font-headline text-lg font-bold text-tertiary'>2. 参数配置</h2>
              <Palette className='w-5 h-5 text-primary-container' />
            </div>

            <div className='space-y-8'>
              {/* Aspect Ratio */}
              <div>
                <label className='font-label text-[0.6875rem] text-on-surface-variant tracking-widest uppercase mb-3 block'>
                  宽高比例
                </label>
                <div className='grid grid-cols-3 gap-2'>
                  {aspectRatios.map(ratio => (
                    <button
                      key={ratio}
                      type='button'
                      onClick={() => setAspectRatio(ratio)}
                      className={cn(
                        'py-2 rounded-sm text-xs font-bold transition-all',
                        aspectRatio === ratio
                          ? 'bg-surface-container-high border border-primary-container/50 text-primary-container'
                          : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:border-primary-container/30'
                      )}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Tone */}
              <div>
                <label className='font-label text-[0.6875rem] text-on-surface-variant tracking-widest uppercase mb-3 block'>
                  色调倾向
                </label>
                <div className='flex gap-3'>
                  {colorTones.map(tone => (
                    <button
                      key={tone.color}
                      type='button'
                      onClick={() => setSelectedColor(tone.color)}
                      title={tone.label}
                      style={{ backgroundColor: tone.color }}
                      className={cn(
                        'w-8 h-8 rounded-full cursor-pointer transition-all',
                        selectedColor === tone.color
                          ? 'ring-2 ring-primary-container ring-offset-2 ring-offset-surface-container-low'
                          : 'hover:scale-110'
                      )}
                    />
                  ))}
                  <button
                    type='button'
                    className='w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'
                  >
                    <Palette className='w-3 h-3' />
                  </button>
                </div>
              </div>

              {/* Style Presets */}
              <div>
                <label className='font-label text-[0.6875rem] text-on-surface-variant tracking-widest uppercase mb-3 block'>
                  风格预设
                </label>
                <div className='space-y-2'>
                  {stylePresets.map(preset => (
                    <button
                      key={preset.id}
                      type='button'
                      onClick={() => setSelectedStyle(preset.id)}
                      className={cn(
                        'w-full flex items-center justify-between p-3 rounded border cursor-pointer transition-all text-left',
                        selectedStyle === preset.id
                          ? 'bg-surface-container-highest/40 border-primary-container/20'
                          : 'bg-surface-container-lowest border-transparent hover:border-outline-variant/30'
                      )}
                    >
                      <span
                        className={cn(
                          'text-sm font-medium',
                          selectedStyle === preset.id ? 'text-tertiary' : 'text-on-surface-variant'
                        )}
                      >
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview & Actions */}
        <div className='col-span-12 lg:col-span-8 space-y-6'>
          {/* Preview Area */}
          <div className='relative bg-surface-container-low rounded-xl overflow-hidden min-h-150 flex items-center justify-center border border-outline-variant/10'>
            {/* Background Grid */}
            <div
              className='absolute inset-0 pointer-events-none opacity-5'
              style={{
                backgroundImage:
                  'linear-gradient(#849495 1px, transparent 1px), linear-gradient(90deg, #849495 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Main Preview */}
            <div className='relative z-10 w-100 h-150 bg-surface-container-lowest shadow-2xl overflow-hidden flex items-center justify-center'>
              {isGenerating ? (
                <>
                  <div className='absolute inset-0 bg-linear-to-br from-surface-container/80 to-surface-container-lowest' />
                  <div className='relative z-10 flex flex-col items-center'>
                    {/* Progress Ring */}
                    <div className='relative w-24 h-24 mb-6'>
                      <svg className='w-full h-full transform -rotate-90' aria-label='生成进度'>
                        <title>生成进度</title>
                        <circle
                          cx='48'
                          cy='48'
                          r='40'
                          fill='transparent'
                          stroke='currentColor'
                          strokeWidth='4'
                          className='text-surface-container-highest'
                        />
                        <circle
                          cx='48'
                          cy='48'
                          r='40'
                          fill='transparent'
                          stroke='currentColor'
                          strokeWidth='4'
                          strokeDasharray='251.2'
                          strokeDashoffset={251.2 - (251.2 * progress) / 100}
                          className='text-primary-container transition-all duration-300'
                        />
                      </svg>
                      <div className='absolute inset-0 bg-secondary-container/20 rounded-full animate-pulse blur-xl' />
                    </div>
                    <span className='font-headline text-tertiary font-bold tracking-widest text-lg'>
                      PROCESSING...
                    </span>
                    <span className='font-label text-[0.6875rem] text-on-surface-variant mt-2 uppercase'>
                      算力加载中 {progress}%
                    </span>
                  </div>
                </>
              ) : progress >= 100 ? (
                <div className='w-full h-full bg-linear-to-br from-[#0a1628] via-[#1a0a2e] to-[#0a1628] flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='w-48 h-48 mx-auto mb-6 rounded-lg bg-linear-to-br from-primary-container/20 to-secondary-container/20 border border-primary-container/30 flex items-center justify-center'>
                      <Image className='w-16 h-16 text-primary-container' />
                    </div>
                    <p className='text-tertiary font-headline font-bold text-lg'>海报已生成</p>
                    <p className='text-on-surface-variant text-xs mt-1 uppercase tracking-widest'>
                      Model: Kinetic-V24 • Seed: 8829103
                    </p>
                  </div>
                </div>
              ) : (
                <div className='text-center'>
                  <Image className='w-16 h-16 text-surface-container-highest mx-auto mb-4' />
                  <p className='text-on-surface-variant text-sm'>配置参数后点击生成</p>
                </div>
              )}

              {/* Decorative Corners */}
              <div className='absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary-container/40' />
              <div className='absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary-container/40' />
              <div className='absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary-container/40' />
              <div className='absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary-container/40' />
            </div>

            {/* Info Overlay */}
            {progress >= 100 && (
              <div className='absolute bottom-8 left-8 right-8 flex justify-between items-end p-6 rounded-lg bg-[rgba(53,52,54,0.6)] backdrop-blur-[20px] border border-primary-container/10'>
                <div>
                  <p className='font-headline text-xl text-tertiary font-bold mb-1'>
                    Cyber-Nexus 01
                  </p>
                  <p className='text-xs text-on-surface-variant uppercase tracking-widest'>
                    Model: Kinetic-V24 &bull; Seed: 8829103
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-[0.625rem] text-outline uppercase mb-1'>Status</p>
                  <p className='text-sm font-bold text-primary-container'>Completed</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className='flex flex-wrap gap-4 items-center'>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className='flex-1 bg-primary-container text-on-primary py-4 rounded-xl font-headline font-bold text-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all'
            >
              <Bolt className='w-5 h-5' />
              开始生成
            </Button>
            <div className='flex gap-4 w-full sm:w-auto'>
              <Button
                variant='outline'
                disabled={progress < 100}
                className='flex-1 sm:flex-none px-8 py-4 bg-surface-container-high border-outline-variant/20 text-tertiary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest'
              >
                <Download className='w-5 h-5' />
                下载 4K
              </Button>
              <Button
                variant='outline'
                disabled={progress < 100}
                className='flex-1 sm:flex-none px-8 py-4 bg-surface-container-high border-outline-variant/20 text-tertiary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest'
              >
                <Share className='w-5 h-5' />
                分享
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
