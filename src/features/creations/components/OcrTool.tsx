import { Copy, Download, FileUp, ScanText, Sparkles } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { useFileUpload } from '@/shared/hooks'
import { useOcr } from '../hooks'
import { ToolHeader } from './ToolGrid'

interface OcrToolProps {
  onBack: () => void
}

export function OcrTool({ onBack }: OcrToolProps) {
  const [result, setResult] = useState<string | null>(null)

  const { file, previewUrl, isUploading, fileInputRef, selectFile, handleDrop, openFilePicker } =
    useFileUpload({
      accept: ['image/*', 'application/pdf'],
      maxSize: 20 * 1024 * 1024,
      errorMessage: {
        type: '仅支持 JPG、PNG、PDF 格式',
        size: '文件大小不能超过 20MB',
      },
    })

  const ocr = useOcr()
  const isProcessing = ocr.isPending

  // Wrapper to clear result on new file selection
  const handleFileSelect = useCallback(
    async (f: File) => {
      const success = await selectFile(f)
      if (success) setResult(null)
    },
    [selectFile]
  )

  const handleExtract = useCallback(async () => {
    if (!file) return

    try {
      const data = await ocr.mutateAsync({ file })
      setResult(data.text)
      toast.success('文字提取完成')
    } catch {
      // Error handled by hook onError
    }
  }, [file, ocr])

  const handleDropWrapper = useCallback(
    async (e: React.DragEvent) => {
      await handleDrop(e)
      setResult(null)
    },
    [handleDrop]
  )

  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result)
      toast.success('已复制到剪贴板')
    }
  }, [result])

  const resultLines = useMemo(() => result?.split('\n') ?? [], [result])

  return (
    <div className='flex-1 flex flex-col px-8 pb-8'>
      <ToolHeader title='图片文字提取' icon={ScanText} onBack={onBack} />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1'>
        {/* 左栏：上传/预览区 */}
        <div className='lg:col-span-6 flex flex-col'>
          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*,application/pdf'
            className='hidden'
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) handleFileSelect(f)
            }}
          />

          <section
            aria-label='文件上传区域'
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropWrapper}
            className={cn(
              'flex-1 relative group rounded-xl overflow-hidden',
              'border border-dashed border-border/30',
              'bg-background',
              'flex flex-col items-center justify-center',
              'transition-all',
              // When preview is shown, change border style
              previewUrl && !isUploading && 'border-solid border-border/20'
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

            {/* 上传中 Loading 状态 */}
            {isUploading && (
              <div className='absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm'>
                <div className='w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 shadow-glow-primary-md' />
                <p className='font-sans text-sm font-bold tracking-widest text-primary uppercase'>
                  上传中...
                </p>
              </div>
            )}

            {/* 预览图 */}
            {previewUrl && !isUploading && (
              <>
                {/* 图片容器 + 扫描线 */}
                <div className='absolute inset-4 flex items-center justify-center'>
                  <div className='relative w-full h-full flex items-center justify-center'>
                    <img
                      src={previewUrl}
                      alt={file?.name ?? 'preview'}
                      className={cn(
                        'max-w-full max-h-full object-contain transition-all duration-300',
                        isProcessing && 'opacity-50 blur-[2px]'
                      )}
                    />
                    {/* 扫描线 - 只在图片区域 */}
                    {isProcessing && (
                      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                        <div className='absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-glow-primary-md animate-scan' />
                      </div>
                    )}
                  </div>
                </div>

                {/* 已完成标记 */}
                {result && !isProcessing && (
                  <div className='absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center gap-1.5'>
                    <ScanText className='w-3.5 h-3.5' />
                    提取完成
                  </div>
                )}

                {/* 底部操作按钮 (有预览时显示) */}
                {!isProcessing && (
                  <div className='absolute bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-3'>
                    <button
                      type='button'
                      onClick={openFilePicker}
                      className='px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-primary text-sm border border-border/30 hover:border-primary/30 transition-all'
                    >
                      重新上传
                    </button>
                    {!result && (
                      <button
                        type='button'
                        onClick={handleExtract}
                        className='px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-glow-primary-sm'
                      >
                        <Sparkles className='w-4 h-4' />
                        提取文字
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 上传交互区域 (无预览时显示) */}
            {!previewUrl && !isUploading && (
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
                <Button
                  onClick={openFilePicker}
                  variant='outline'
                  className='bg-surface-container-high border-primary/20 text-primary hover:bg-muted'
                >
                  选择文件
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* 右栏：结果面板 */}
        <div className='lg:col-span-6 flex flex-col'>
          <div className='flex-1 flex flex-col bg-card rounded-xl border border-border/10 overflow-hidden'>
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
                  {resultLines.map((line, i) => (
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
    </div>
  )
}