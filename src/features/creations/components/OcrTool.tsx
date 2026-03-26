import { Copy, Download, FileUp, ScanText } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { useOcr } from '../hooks'
import { ToolHeader } from './ToolGrid'

interface OcrToolProps {
  onBack: () => void
}

export function OcrTool({ onBack }: OcrToolProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ocr = useOcr()
  const isProcessing = ocr.isPending

  const handleFile = useCallback(
    async (f: File) => {
      if (!f.type.startsWith('image/') && f.type !== 'application/pdf') {
        toast.error('仅支持 JPG、PNG、PDF 格式')
        return
      }
      if (f.size > 20 * 1024 * 1024) {
        toast.error('文件大小不能超过 20MB')
        return
      }

      setFile(f)
      setResult(null)

      const objectUrl = URL.createObjectURL(f)
      if (f.type.startsWith('image/')) {
        setPreviewUrl(objectUrl)
      } else {
        setPreviewUrl(null)
      }

      try {
        const data = await ocr.mutateAsync({ file: f })
        setResult(data.text)
        toast.success('文字提取完成')
      } catch {
        // Error handled by hook onError
      }
    },
    [ocr]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result)
      toast.success('已复制到剪贴板')
    }
  }, [result])

  return (
    <div className='flex-1 flex flex-col px-8'>
      <ToolHeader title='图片文字提取' icon={ScanText} onBack={onBack} />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
        {/* 左栏：上传区 */}
        <div className='lg:col-span-6 flex flex-col gap-4'>
          {/* 上传区域 */}
          <section
            aria-label='文件上传区域'
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className={cn(
              'relative group rounded-xl overflow-hidden',
              'border border-dashed border-border/30',
              'bg-background',
              'flex flex-col items-center justify-center',
              'transition-all hover:border-primary/30',
              'h-240'
            )}
          >
            {/* 点状背景 */}
            <div
              className='absolute inset-0 opacity-[0.03] pointer-events-none'
              style={{
                backgroundImage:
                  'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* 扫描线动画 */}
            {isProcessing && (
              <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent shadow-glow-primary-sm animate-scan' />
              </div>
            )}

            {/* 预览图 */}
            {previewUrl && !isProcessing && result ? (
              <div className='absolute inset-0 p-6 flex items-center justify-center'>
                <img
                  src={previewUrl}
                  alt={file?.name ?? 'preview'}
                  className='max-w-full max-h-full rounded-lg object-contain opacity-60'
                />
              </div>
            ) : null}

            {/* 上传交互 */}
            <div className='relative z-10 flex flex-col items-center gap-6 p-12 text-center'>
              <div
                className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center',
                  'bg-surface-container-high border border-primary/20',
                  'group-hover:scale-110 transition-transform duration-500',
                  'shadow-glow-primary'
                )}
              >
                <FileUp className='w-10 h-10 text-primary' />
              </div>
              <div>
                <h3 className='text-xl font-sans font-bold text-foreground mb-2'>拖拽或点击上传</h3>
                <p className='text-muted-foreground text-xs tracking-widest uppercase'>
                  支持 JPG, PNG, PDF (最大 20MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*,application/pdf'
                className='hidden'
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant='outline'
                className='bg-surface-container-high border-primary/20 text-primary hover:bg-muted'
              >
                选择文件
              </Button>
            </div>
          </section>
        </div>

        {/* 右栏：结果面板 */}
        <div className='lg:col-span-6 flex flex-col bg-card rounded-xl border border-border/10 overflow-hidden h-200'>
          {/* 头部 */}
          <div className='p-5 border-b border-border/10 flex items-center justify-between bg-background/50'>
            <div className='flex items-center gap-2'>
              <ScanText className='w-4 h-4 text-primary' />
              <h2 className='font-sans text-lg font-bold text-foreground'>提取结果</h2>
            </div>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={handleCopy}
                disabled={!result}
                className='p-2 rounded-lg bg-surface-container-high text-muted-foreground hover:text-primary transition-all active:scale-90 disabled:opacity-30'
                title='复制'
              >
                <Copy className='w-4 h-4' />
              </button>
              <button
                type='button'
                disabled={!result}
                className='p-2 rounded-lg bg-surface-container-high text-muted-foreground hover:text-primary transition-all active:scale-90 disabled:opacity-30'
                title='下载'
              >
                <Download className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* 文本内容区 */}
          <div className='flex-1 p-5 overflow-y-auto'>
            {result ? (
              <div className='space-y-1 text-muted-foreground text-sm leading-relaxed'>
                {result.split('\n').map((line, i) => (
                  <div
                    key={line || `empty-${i}`}
                    className='group cursor-text p-2 hover:bg-surface-container-high/40 rounded transition-colors border-l border-transparent hover:border-primary/30'
                  >
                    <span className='text-secondary font-bold mr-2 text-xs opacity-50 select-none'>
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                    {line || '\u00A0'}
                  </div>
                ))}
                <div className='flex items-center gap-2 mt-4 pt-3 border-t border-border/10'>
                  <span className='w-2 h-2 rounded-full bg-primary animate-pulse' />
                  <span className='text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60'>
                    解析完成 - 无错误检测
                  </span>
                </div>
              </div>
            ) : (
              <div className='h-full flex items-center justify-center text-center'>
                <div>
                  <ScanText className='w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30' />
                  <p className='text-muted-foreground text-sm'>
                    上传图片后，提取的文字将显示在此处
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 底部导出 */}
          <div className='p-5 bg-muted/20 border-t border-border/10'>
            <Button
              disabled={!result}
              className={cn(
                'w-full py-5 font-bold tracking-widest uppercase text-sm',
                'bg-linear-to-r from-secondary-container to-secondary',
                'text-foreground shadow-glow-primary-lg',
                'hover:shadow-glow-primary-lg-hover',
                'transition-all active:scale-[0.98]',
                'disabled:opacity-30 disabled:shadow-none'
              )}
            >
              导出结构化数据
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
