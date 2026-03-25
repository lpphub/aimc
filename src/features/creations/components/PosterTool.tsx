import { Bolt, Download, Image, Maximize2, Palette, Plus, Share, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { Textarea } from '@/shared/components/ui/textarea'
import { useGeneratePoster } from '../hooks'
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
  { id: 'cyberpunk', name: '赛博' },
  { id: 'minimalist', name: '极简' },
  { id: 'hyperreal', name: '写实' },
]

interface PosterConfig {
  aspectRatio: string
  colorTone: string
  style: string
}

interface PosterPreviewProps {
  isGenerating: boolean
  resultUrl: string | null
}

function PosterPreview({ isGenerating, resultUrl }: PosterPreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className='relative bg-card rounded-xl overflow-hidden flex items-center justify-center border border-border/10 h-185'>
        {/* Background Grid */}
        <div
          className='absolute inset-0 pointer-events-none opacity-5'
          style={{
            backgroundImage:
              'linear-gradient(var(--outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--outline-variant) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Main Preview */}
        <div className='relative z-10 w-140 h-175 bg-background shadow-2xl overflow-hidden flex items-center justify-center'>
          {isGenerating ? (
            <div className='flex flex-col items-center gap-4'>
              <div className='w-16 h-16 rounded-full bg-primary/20 animate-pulse' />
              <span className='font-sans text-foreground font-bold tracking-widest'>
                PROCESSING...
              </span>
            </div>
          ) : resultUrl ? (
            <button
              type='button'
              onClick={() => setIsModalOpen(true)}
              className='w-full h-full group relative'
            >
              <img
                src={resultUrl}
                alt='Generated poster'
                className='w-full h-full object-contain'
              />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                <Maximize2 className='w-8 h-8 text-white' />
              </div>
            </button>
          ) : (
            <div className='text-center'>
              <Image className='w-16 h-16 text-muted mx-auto mb-4' />
              <p className='text-muted-foreground text-sm'>配置参数后点击生成</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none'>
          <img
            src={resultUrl || ''}
            alt='Generated poster'
            className='w-full h-auto max-h-[90vh] object-contain'
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

interface PosterConfigPanelProps {
  config: PosterConfig
  onConfigChange: (config: PosterConfig) => void
  prompt: string
  onPromptChange: (prompt: string) => void
  previewUrl: string | null
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDelete: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

function PosterConfigPanel({
  config,
  onConfigChange,
  prompt,
  onPromptChange,
  previewUrl,
  onFileSelect,
  onDelete,
  fileInputRef,
}: PosterConfigPanelProps) {
  return (
    <div className='space-y-6'>
      {/* Parameter Config */}
      <div className='bg-card rounded-xl p-5 border-t border-primary/20'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='font-sans text-base font-bold text-foreground'>参数配置</h2>
          <Palette className='w-4 h-4 text-primary' />
        </div>

        <div className='space-y-4'>
          {/* Aspect Ratio */}
          <div>
            <label className='font-sans text-[0.625rem] text-muted-foreground tracking-widest uppercase mb-2 block'>
              宽高比例
            </label>
            <div className='grid grid-cols-3 gap-1.5'>
              {aspectRatios.map(ratio => (
                <button
                  key={ratio}
                  type='button'
                  onClick={() => onConfigChange({ ...config, aspectRatio: ratio })}
                  className={cn(
                    'py-1.5 rounded-sm text-xs font-bold transition-all',
                    config.aspectRatio === ratio
                      ? 'bg-surface-container-high border border-primary/50 text-primary'
                      : 'bg-background border border-border/20 text-muted-foreground hover:border-primary/30'
                  )}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Color Tone */}
          <div>
            <label className='font-sans text-[0.625rem] text-muted-foreground tracking-widest uppercase mb-2 block'>
              色调倾向
            </label>
            <div className='flex gap-2'>
              {colorTones.map(tone => (
                <button
                  key={tone.color}
                  type='button'
                  onClick={() => onConfigChange({ ...config, colorTone: tone.color })}
                  title={tone.label}
                  style={{ backgroundColor: tone.color }}
                  className={cn(
                    'w-7 h-7 rounded-full cursor-pointer transition-all',
                    config.colorTone === tone.color
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                      : 'hover:scale-110'
                  )}
                />
              ))}
              <button
                type='button'
                className='w-7 h-7 rounded-full border border-border flex items-center justify-center cursor-pointer hover:scale-110 transition-transform'
              >
                <Palette className='w-3 h-3' />
              </button>
            </div>
          </div>

          {/* Style Presets */}
          <div>
            <label className='font-sans text-[0.625rem] text-muted-foreground tracking-widest uppercase mb-2 block'>
              风格预设
            </label>
            <div className='grid grid-cols-3 gap-1.5'>
              {stylePresets.map(preset => (
                <button
                  key={preset.id}
                  type='button'
                  onClick={() => onConfigChange({ ...config, style: preset.id })}
                  className={cn(
                    'py-1.5 rounded-sm text-xs font-bold transition-all',
                    config.style === preset.id
                      ? 'bg-surface-container-high border border-primary/50 text-primary'
                      : 'bg-background border border-border/20 text-muted-foreground hover:border-primary/30'
                  )}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prompt & Upload */}
      <div className='bg-card rounded-xl p-5 border-t border-primary/20 flex-1'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='font-sans text-base font-bold text-foreground'>提示词</h2>
          <Upload className='w-4 h-4 text-primary' />
        </div>

        <div className='space-y-4'>
          <Textarea
            value={prompt}
            onChange={e => onPromptChange(e.target.value)}
            placeholder='输入创意描述，描述你想要的海报风格、元素、氛围...'
            className='min-h-80 resize-none bg-background border-border/20'
          />

          <div>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/png,image/jpeg,image/webp'
              onChange={onFileSelect}
              className='hidden'
            />
            {previewUrl ? (
              <div className='relative inline-block'>
                <img src={previewUrl} alt='Preview' className='w-20 h-20 object-cover rounded-lg' />
                <button
                  type='button'
                  onClick={onDelete}
                  className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center hover:scale-110 active:scale-95 transition-transform'
                >
                  <X className='w-3 h-3 text-foreground' />
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                className='w-20 h-20 border-2 border-dashed border-border/30 rounded-lg flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer bg-background'
              >
                <Plus className='w-5 h-5 text-muted-foreground' />
                <span className='text-[0.625rem] text-muted-foreground mt-1'>参考图</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PosterTool({ onBack }: PosterToolProps) {
  const [config, setConfig] = useState<PosterConfig>({
    aspectRatio: '9:16',
    colorTone: colorTones[0].color,
    style: 'cyberpunk',
  })
  const [prompt, setPrompt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generatePoster = useGeneratePoster()

  const isGenerating = generatePoster.isPending

  const validateFile = (f: File): boolean => {
    const validTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!validTypes.includes(f.type)) {
      toast.error('仅支持 PNG, JPG, WebP 格式')
      return false
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('文件大小不能超过 10MB')
      return false
    }
    return true
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!validateFile(f)) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setResultUrl(null)
  }

  const handleDelete = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setResultUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('请输入提示词')
      return
    }

    setResultUrl(null)

    try {
      const result = await generatePoster.mutateAsync({
        data: {
          prompt: prompt.trim(),
          aspectRatio: config.aspectRatio,
          colorTone: config.colorTone,
          style: config.style,
        },
        file: file ?? undefined,
      })
      setResultUrl(result.imageUrl)
      toast.success('海报生成完成')
    } catch {
      // Error toast handled by hook onError
    }
  }

  const handleDownload = async () => {
    if (!resultUrl) return
    try {
      const response = await fetch(resultUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'poster.png'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('下载失败')
    }
  }

  const handleShare = () => {
    toast.info('分享功能开发中')
  }

  return (
    <div className='flex-1 flex flex-col px-8'>
      <ToolHeader title='海报创作' icon={Image} onBack={onBack} />

      <p className='text-muted-foreground text-sm leading-relaxed -mt-4 mb-8'>
        利用AI算力构建视觉创意。输入创意描述，配置参数，即刻获取高清专业级海报。
      </p>

      {/* Bento Grid */}
      <div className='grid grid-cols-12 gap-8 items-start'>
        {/* Left Config Panel */}
        <div className='col-span-12 lg:col-span-4'>
          <PosterConfigPanel
            config={config}
            onConfigChange={setConfig}
            prompt={prompt}
            onPromptChange={setPrompt}
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onDelete={handleDelete}
            fileInputRef={fileInputRef}
          />
        </div>

        {/* Right Preview & Actions */}
        <div className='col-span-12 lg:col-span-8 space-y-6'>
          <PosterPreview isGenerating={isGenerating} resultUrl={resultUrl} />

          {/* Actions */}
          <div className='flex flex-wrap gap-4 items-center'>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className='flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-sans font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all'
            >
              <Bolt className='w-5 h-5' />
              {isGenerating ? '生成中...' : '开始生成'}
            </Button>
            <div className='flex gap-4 w-full sm:w-auto'>
              <Button
                variant='outline'
                disabled={!resultUrl}
                onClick={handleDownload}
                className='flex-1 sm:flex-none px-8 py-4 bg-surface-container-high border-border/20 text-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted'
              >
                <Download className='w-5 h-5' />
                下载
              </Button>
              <Button
                variant='outline'
                disabled={!resultUrl}
                onClick={handleShare}
                className='flex-1 sm:flex-none px-8 py-4 bg-surface-container-high border-border/20 text-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted'
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
