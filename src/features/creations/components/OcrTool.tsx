import { Copy, Download, FileUp, ScanText } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { ToolHeader } from './ToolGrid'

const MOCK_RESULT = `项目名称：极光边缘计算节点架构设计 (Project Aurora-Edge)

核心目标：构建可大规模部署的合成智能网络，实现低延迟数据提取与自动标注。

硬件需求：
  - Lumina NPU 系列核心处理器 x4
  - 高带宽内存存储系统 (64GB HBM3)
  - 超导液冷散热阵列

合规性：符合 ISO/IEC 42001 人工智能管理体系标准。

此文档包含机密数据，仅供内部架构委员会审阅。未经授权禁止分发或进行逆向工程分析。`

interface OcrToolProps {
  onBack: () => void
}

export function OcrTool({ onBack }: OcrToolProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
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

    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }

    setIsProcessing(true)
    setTimeout(() => {
      setResult(MOCK_RESULT)
      setIsProcessing(false)
      toast.success('文字提取完成')
    }, 2000)
  }, [])

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
              'border border-dashed border-outline-variant/30',
              'bg-surface-container-lowest',
              'flex flex-col items-center justify-center',
              'transition-all hover:border-primary-container/30',
              'h-240'
            )}
          >
            {/* 点状背景 */}
            <div
              className='absolute inset-0 opacity-[0.03] pointer-events-none'
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #00f2ff 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* 扫描线动画 */}
            {isProcessing && (
              <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div
                  className='absolute left-0 right-0 h-0.5 animate-[scan_3s_linear_infinite]'
                  style={{
                    background: 'linear-gradient(90deg, transparent, #00f2ff, transparent)',
                    boxShadow: '0 0 15px #00f2ff',
                  }}
                />
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
                  'bg-surface-container-high border border-primary-container/20',
                  'group-hover:scale-110 transition-transform duration-500',
                  'shadow-[0_0_30px_rgba(0,242,255,0.1)]'
                )}
              >
                <FileUp className='w-10 h-10 text-primary-container' />
              </div>
              <div>
                <h3 className='text-xl font-headline font-bold text-tertiary mb-2'>
                  拖拽或点击上传
                </h3>
                <p className='text-on-surface-variant text-xs tracking-widest uppercase'>
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
                className='bg-surface-container-high border-primary-container/20 text-primary hover:bg-surface-container-highest'
              >
                选择文件
              </Button>
            </div>
          </section>
        </div>

        {/* 右栏：结果面板 */}
        <div className='lg:col-span-6 flex flex-col bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden h-200'>
          {/* 头部 */}
          <div className='p-5 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-lowest/50'>
            <div className='flex items-center gap-2'>
              <ScanText className='w-4 h-4 text-primary-container' />
              <h2 className='font-headline text-lg font-bold text-tertiary'>提取结果</h2>
            </div>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={handleCopy}
                disabled={!result}
                className='p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-all active:scale-90 disabled:opacity-30'
                title='复制'
              >
                <Copy className='w-4 h-4' />
              </button>
              <button
                type='button'
                disabled={!result}
                className='p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-all active:scale-90 disabled:opacity-30'
                title='下载'
              >
                <Download className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* 文本内容区 */}
          <div className='flex-1 p-5 overflow-y-auto'>
            {result ? (
              <div className='space-y-1 text-on-surface-variant text-sm leading-relaxed'>
                {result.split('\n').map((line, i) => (
                  <div
                    key={line || `empty-${i}`}
                    className='group cursor-text p-2 hover:bg-surface-container-high/40 rounded transition-colors border-l border-transparent hover:border-primary-container/30'
                  >
                    <span className='text-secondary-fixed-dim font-bold mr-2 text-xs opacity-50 select-none'>
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                    {line || '\u00A0'}
                  </div>
                ))}
                <div className='flex items-center gap-2 mt-4 pt-3 border-t border-outline-variant/10'>
                  <span className='w-2 h-2 rounded-full bg-primary-container animate-pulse' />
                  <span className='text-[10px] uppercase tracking-[0.2em] font-bold text-primary-container/60'>
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
          <div className='p-5 bg-surface-container-highest/20 border-t border-outline-variant/10'>
            <Button
              disabled={!result}
              className={cn(
                'w-full py-5 font-bold tracking-widest uppercase text-sm',
                'bg-linear-to-r from-secondary-container to-[#6b2fd0]',
                'text-tertiary shadow-[0_8px_30px_rgba(87,27,193,0.3)]',
                'hover:shadow-[0_12px_40px_rgba(87,27,193,0.5)]',
                'transition-all active:scale-[0.98]',
                'disabled:opacity-30 disabled:shadow-none'
              )}
            >
              导出结构化数据
            </Button>
          </div>
        </div>
      </div>

      {/* 扫描线动画 keyframes */}
      <style>
        {`
          @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}
      </style>
    </div>
  )
}
