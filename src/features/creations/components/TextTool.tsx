import { Bolt, Copy, Info, Type } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { useGenerateText } from '../hooks'
import type { BrandTone } from '../types'
import { ToolHeader } from './ToolGrid'

const brandTones: BrandTone[] = ['专业严谨', '风趣幽默', '极简主义', '煽动性强']

interface TextToolProps {
  onBack: () => void
}

export function TextTool({ onBack }: TextToolProps) {
  const [productDesc, setProductDesc] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [selectedTone, setSelectedTone] = useState<BrandTone>('专业严谨')
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)

  const generateText = useGenerateText()
  const isGenerating = generateText.isPending

  const handleGenerate = useCallback(async () => {
    const prompt = [productDesc, targetAudience, selectedTone].filter(Boolean).join('\n')
    if (!prompt.trim()) {
      toast.error('请输入产品描述')
      return
    }

    setGeneratedContent(null)
    try {
      const result = await generateText.mutateAsync({
        prompt,
        productDesc: productDesc.trim() || undefined,
        targetAudience: targetAudience.trim() || undefined,
        tone: selectedTone,
      })
      setGeneratedContent(result.content)
      toast.success('文案生成成功')
    } catch {
      // Error handled by hook onError
    }
  }, [productDesc, targetAudience, selectedTone, generateText])

  const handleCopy = useCallback(() => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent)
      toast.success('已复制到剪贴板')
    }
  }, [generatedContent])

  return (
    <div className='flex-1 flex flex-col px-8'>
      <ToolHeader title='营销文案' icon={Type} onBack={onBack} />

      <p className='text-muted-foreground text-sm leading-relaxed -mt-4 mb-8 max-w-2xl'>
        输入您的产品愿景，让合成架构为您完成剩下的工作。
      </p>

      <div className='grid grid-cols-12 gap-8 items-stretch'>
        {/* Left Panel: Input */}
        <section className='col-span-12 lg:col-span-5 flex flex-col space-y-6 min-h-185'>
          <div className='bg-card p-8 rounded-xl border-t border-primary/20 shadow-elevation flex-1'>
            <div className='space-y-6'>
              {/* 产品描述 */}
              <div>
                <label className='block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3'>
                  产品描述
                </label>
                <Textarea
                  value={productDesc}
                  onChange={e => setProductDesc(e.target.value)}
                  placeholder='输入您的产品名称和核心卖点...'
                  className='w-full bg-background border-none focus:ring-1 focus:ring-primary/50 rounded-sm p-4 text-foreground text-sm min-h-72 resize-none'
                />
              </div>

              {/* 目标受众 */}
              <div>
                <label className='block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3'>
                  目标受众
                </label>
                <input
                  type='text'
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  placeholder='例如：25-35岁的科技爱好者'
                  className='w-full bg-background border-none focus:ring-1 focus:ring-primary/50 rounded-sm p-4 text-foreground text-sm'
                />
              </div>

              {/* 品牌语调 */}
              <div>
                <label className='block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3'>
                  品牌语调
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {brandTones.map(tone => (
                    <button
                      key={tone}
                      type='button'
                      onClick={() => setSelectedTone(tone)}
                      className={cn(
                        'py-2 px-3 text-xs rounded transition-all',
                        selectedTone === tone
                          ? 'bg-surface-container-high border border-primary/30 text-primary'
                          : 'bg-surface-container-high border border-border/30 text-muted-foreground hover:border-primary/30'
                      )}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* 生成按钮 */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className='w-full group relative overflow-hidden bg-primary text-primary-foreground py-4 rounded-xl font-bold tracking-tighter uppercase transition-transform active:scale-[0.98]'
              >
                <span className='relative z-10 flex items-center justify-center gap-2'>
                  <Bolt className='w-5 h-5' />
                  开始生成
                </span>
                <div className='absolute inset-0 bg-foreground/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
              </Button>
            </div>
          </div>

          {/* 提示 */}
          <div className='flex items-center gap-3 px-2 text-muted-foreground'>
            <Info className='w-4 h-4 text-primary/60' />
            <p className='text-[10px] uppercase tracking-wider'>
              提示：提供具体的使用场景将显著提升生成质量。
            </p>
          </div>
        </section>

        {/* Right Panel: Result & Loading */}
        <section className='col-span-12 lg:col-span-7 flex flex-col relative'>
          <div className='h-full bg-card rounded-xl border-t border-secondary-container/20 shadow-elevation flex flex-col overflow-hidden'>
            {/* Header Actions */}
            <div className='flex justify-between items-center px-8 py-4 border-b border-border/10'>
              <h2 className='font-sans text-lg font-bold tracking-tight text-primary'>输出预览</h2>
              <div className='flex gap-2'>
                <button
                  type='button'
                  onClick={handleCopy}
                  disabled={!generatedContent}
                  className='p-2 text-muted-foreground hover:text-primary hover:bg-surface-container-high rounded transition-all disabled:opacity-30'
                  title='复制'
                >
                  <Copy className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className='flex-1 p-8 font-sans leading-relaxed text-muted-foreground overflow-y-auto relative'>
              {/* 骨架屏 / 占位 */}
              {!generatedContent && !isGenerating && (
                <div className='space-y-4 opacity-40 select-none'>
                  <div className='h-4 bg-muted rounded w-3/4' />
                  <div className='h-4 bg-muted rounded w-full' />
                  <div className='h-4 bg-muted rounded w-5/6' />
                  <div className='h-20 bg-muted rounded w-full' />
                  <div className='h-4 bg-muted rounded w-2/3' />
                </div>
              )}

              {/* 生成结果 */}
              {generatedContent && !isGenerating && (
                <div className='text-sm whitespace-pre-wrap leading-relaxed'>
                  {generatedContent}
                </div>
              )}

              {/* Loading Overlay */}
              {isGenerating && (
                <div className='absolute inset-0 z-10 flex items-center justify-center bg-card/40 backdrop-blur-[2px]'>
                  <div className='relative flex flex-col items-center'>
                    <div className='absolute inset-0 bg-secondary-container rounded-full blur-[60px] opacity-20 animate-pulse scale-150' />
                    <div className='relative z-20 flex flex-col items-center'>
                      <div className='w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 shadow-glow-primary-md' />
                      <p className='font-sans text-sm font-bold tracking-[0.3em] text-primary uppercase animate-pulse'>
                        Generating...
                      </p>
                      <p className='text-[10px] text-muted-foreground mt-2 uppercase tracking-widest'>
                        正在构建多维营销视角
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Decorative Grid Overlay */}
          <div className='absolute -bottom-4 -right-4 w-48 h-48 pointer-events-none opacity-5 overflow-hidden'>
            <div
              className='w-full h-full'
              style={{
                backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)',
                backgroundSize: '12px 12px',
              }}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
