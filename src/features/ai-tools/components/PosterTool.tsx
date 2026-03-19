'use client'

import { Heart, Image, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { CollectDialog } from '@/features/portfolio/components/CollectDialog'
import type { WorkType } from '@/features/portfolio/types'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { ToolHeader } from './ToolSelector'

interface PosterToolProps {
  onBack: () => void
}

export function PosterTool({ onBack }: PosterToolProps) {
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [referenceImages, _setReferenceImages] = useState<File[]>([])
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [collectDialogOpen, setCollectDialogOpen] = useState(false)

  const aspectRatios = [
    { value: '1:1', label: '1:1' },
    { value: '2:3', label: '2:3' },
    { value: '3:2', label: '3:2' },
    { value: '3:4', label: '3:4' },
    { value: '4:3', label: '4:3' },
    { value: '4:5', label: '4:5' },
    { value: '9:16', label: '9:16' },
    { value: '16:9', label: '16:9' },
    { value: '21:9', label: '21:9' },
  ]

  const handleGenerate = () => {
    setGeneratedContent('https://picsum.photos/seed/ai-image/800/600')
    toast.success('图片生成成功！')
  }

  const handleCollect = () => {
    if (!generatedContent) return
    setCollectDialogOpen(true)
  }

  return (
    <>
      <div className='flex-1 flex flex-col'>
        <ToolHeader title='海报创作' icon={Image} onBack={onBack} />

        <div className='flex gap-6 flex-1'>
          <div className='w-96 flex-shrink-0'>
            <Card className='h-full bg-card border-border backdrop-blur-sm p-6'>
              <h2 className='text-lg font-semibold text-foreground mb-4'>灵感参数</h2>

              <div className='mb-6'>
                <label className='text-sm text-muted-foreground mb-2 block'>核心引擎</label>
                <Select defaultValue='gemini'>
                  <SelectTrigger className='w-full h-10 bg-background/50 border-border/30 text-foreground focus:border-primary/50'>
                    <SelectValue placeholder='选择引擎' />
                  </SelectTrigger>
                  <SelectContent className='bg-popover/95 border-border/30'>
                    <SelectItem value='gemini'>Gemini生图1K (5 灵感值)</SelectItem>
                    <SelectItem value='dall-e'>DALL-E 3 (10 灵感值)</SelectItem>
                    <SelectItem value='stable'>Stable Diffusion (8 灵感值)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='mb-6'>
                <label className='text-sm text-muted-foreground mb-2 block'>画幅比例</label>
                <div className='grid grid-cols-5 gap-2'>
                  {aspectRatios.map(ratio => (
                    <Button
                      key={ratio.value}
                      variant={aspectRatio === ratio.value ? 'default' : 'outline'}
                      onClick={() => setAspectRatio(ratio.value)}
                      className={
                        aspectRatio === ratio.value
                          ? 'h-10 bg-primary text-primary-foreground text-xs shadow-lg shadow-primary/20'
                          : 'h-10 bg-background/50 border-border/30 text-muted-foreground text-xs hover:bg-accent/50'
                      }
                    >
                      {ratio.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className='mb-6'>
                <label className='text-sm text-muted-foreground mb-2 block'>
                  参考图 ({referenceImages.length}/3)
                </label>
                <div className='border-2 border-dashed border-border/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer'>
                  <div className='flex flex-col items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center'>
                      <Sparkles className='w-5 h-5 text-muted-foreground' />
                    </div>
                    <span className='text-sm text-muted-foreground'>上传</span>
                  </div>
                </div>
              </div>

              <div className='mb-6'>
                <label className='text-sm text-muted-foreground mb-2 block'>画面描述</label>
                <Textarea
                  placeholder='输入灵感提示词...'
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  className='min-h-[150px] bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground resize-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 backdrop-blur-sm transition-all duration-300'
                />
                <div className='flex justify-end mt-2'>
                  <span className='text-xs text-muted-foreground'>{prompt.length}/3000</span>
                </div>
              </div>

              <div className='mt-6'>
                <Button
                  onClick={handleGenerate}
                  className='w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40'
                >
                  <Sparkles className='w-4 h-4 mr-2' />
                  开始渲染作品
                </Button>
              </div>
            </Card>
          </div>

          <div className='flex-1'>
            <Card className='h-full bg-card border-border backdrop-blur-sm flex flex-col'>
              <div className='p-4 border-b border-border'>
                <h2 className='text-lg font-semibold text-foreground'>预览区域</h2>
              </div>

              <div className='flex-1 flex items-center justify-center relative overflow-hidden'>
                <div className='absolute inset-0 opacity-5'>
                  <div
                    className='w-full h-full'
                    style={{
                      backgroundImage: `linear-gradient(to right, #374151 1px, transparent 1px), linear-gradient(to bottom, #374151 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />
                </div>

                {generatedContent ? (
                  <div className='relative z-10 w-full h-full p-6'>
                    <div className='h-full flex flex-col items-center justify-center'>
                      <img
                        src={generatedContent}
                        alt='AI generated'
                        className='max-w-full max-h-[calc(100%-80px)] rounded-lg object-contain'
                      />
                      <Button
                        onClick={handleCollect}
                        className='self-end mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                      >
                        <Heart className='w-4 h-4 mr-2' />
                        收藏到作品集
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='text-center relative z-10'>
                    <div className='w-20 h-20 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center mx-auto mb-4'>
                      <Image className='w-10 h-10 text-muted-foreground' />
                    </div>
                    <p className='text-muted-foreground text-lg mb-2'>AI 绘图引擎就绪</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <CollectDialog
        open={collectDialogOpen}
        onOpenChange={setCollectDialogOpen}
        type={'image' as WorkType}
        content={generatedContent || ''}
        prompt={prompt}
        onSuccess={() => toast.success('作品已收藏到作品集')}
      />
    </>
  )
}
