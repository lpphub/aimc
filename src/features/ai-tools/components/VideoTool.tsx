'use client'

import { Heart, Sparkles, Video } from 'lucide-react'
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

interface VideoToolProps {
  onBack: () => void
}

export function VideoTool({ onBack }: VideoToolProps) {
  const [prompt, setPrompt] = useState('')
  const [_startFrame, _setStartFrame] = useState<File | null>(null)
  const [_endFrame, _setEndFrame] = useState<File | null>(null)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [collectDialogOpen, setCollectDialogOpen] = useState(false)

  const handleGenerate = () => {
    setGeneratedContent('https://example.com/generated-video.mp4')
    toast.success('视频生成成功！')
  }

  const handleCollect = () => {
    if (!generatedContent) return
    setCollectDialogOpen(true)
  }

  return (
    <>
      <div className='flex-1 flex flex-col'>
        <ToolHeader title='AI 视频' icon={Video} onBack={onBack} />

        <div className='flex gap-6 flex-1'>
          <div className='w-96 flex-shrink-0'>
            <Card className='h-full bg-card border-border backdrop-blur-sm p-6'>
              <h2 className='text-lg font-semibold text-foreground mb-4'>视频引擎设置</h2>

              <div className='mb-6'>
                <label className='text-sm text-muted-foreground mb-2 block'>渲染模型引擎</label>
                <Select defaultValue='veo'>
                  <SelectTrigger className='w-full h-10 bg-background/50 border-border/30 text-foreground focus:border-primary/50'>
                    <SelectValue placeholder='选择引擎' />
                  </SelectTrigger>
                  <SelectContent className='bg-popover/95 border-border/30'>
                    <SelectItem value='veo'>veo3.1_pro-4k (40 灵感值)</SelectItem>
                    <SelectItem value='sora'>Sora (60 灵感值)</SelectItem>
                    <SelectItem value='runway'>Runway Gen-2 (50 灵感值)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='mb-6'>
                <label className='text-sm text-muted-foreground mb-2 block'>场景描述</label>
                <div className='relative'>
                  <Textarea
                    placeholder='描述视频内容，如：赛博朋克风格的猫在霓虹街道上奔跑，4K 电影质感...'
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className='min-h-[150px] bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground resize-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 backdrop-blur-sm transition-all duration-300 pr-12'
                  />
                  <Button
                    variant='ghost'
                    size='icon'
                    className='absolute top-2 right-2 w-8 h-8 text-muted-foreground hover:text-primary'
                  >
                    <Sparkles className='w-4 h-4' />
                  </Button>
                </div>
                <div className='flex justify-end mt-2'>
                  <span className='text-xs text-muted-foreground'>{prompt.length}/3000</span>
                </div>
              </div>

              <div className='mb-6'>
                <label className='text-sm text-muted-foreground mb-2 block'>首尾帧自动拼接</label>
                <div className='flex items-center justify-between p-3 bg-background/50 border border-border/30 rounded-lg'>
                  <span className='text-sm text-muted-foreground'>未开启</span>
                  <div className='w-12 h-6 bg-muted rounded-full relative'>
                    <div className='absolute left-1 top-1 w-4 h-4 bg-foreground rounded-full transition-all' />
                  </div>
                </div>
                <p className='text-xs text-muted-foreground mt-2'>
                  开启后需要上传首帧与尾帧，系统自动补间生成
                </p>

                <div className='grid grid-cols-2 gap-3 mt-3'>
                  <div className='border-2 border-dashed border-border/30 rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer'>
                    <div className='flex flex-col items-center gap-2'>
                      <div className='w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center'>
                        <Sparkles className='w-4 h-4 text-muted-foreground' />
                      </div>
                      <span className='text-xs text-muted-foreground'>上传首帧</span>
                    </div>
                  </div>
                  <div className='border-2 border-dashed border-border/30 rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer'>
                    <div className='flex flex-col items-center gap-2'>
                      <div className='w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center'>
                        <Sparkles className='w-4 h-4 text-muted-foreground' />
                      </div>
                      <span className='text-xs text-muted-foreground'>上传尾帧</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <Button
                  onClick={handleGenerate}
                  className='w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40'
                >
                  <Sparkles className='w-4 h-4 mr-2' />
                  开始 AI 渲染
                </Button>
                <p className='text-center text-xs text-muted-foreground mt-2'>
                  预估消耗：40 灵感值
                </p>
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
                      <div className='w-full max-w-2xl aspect-video bg-background/50 border border-border/30 rounded-lg flex items-center justify-center'>
                        <Video className='w-16 h-16 text-muted-foreground' />
                      </div>
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
                      <Video className='w-10 h-10 text-muted-foreground' />
                    </div>
                    <p className='text-muted-foreground text-lg mb-2'>画境引擎就绪</p>
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
        type={'video' as WorkType}
        content={generatedContent || ''}
        prompt={prompt}
        onSuccess={() => toast.success('作品已收藏到作品集')}
      />
    </>
  )
}
