import { Heart, Sparkles, Type } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { CollectDialog } from '@/shared/components/collect'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Textarea } from '@/shared/components/ui/textarea'
import { useCreateWork, useProjects } from '@/shared/hooks'
import type { WorkType } from '@/shared/types'
import { ToolHeader } from './ToolSelector'

interface MarketingCopyToolProps {
  onBack: () => void
}

export function MarketingCopyTool({ onBack }: MarketingCopyToolProps) {
  const [prompt, setPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [collectDialogOpen, setCollectDialogOpen] = useState(false)

  const { data: projects = [] } = useProjects()
  const createWork = useCreateWork()

  const handleGenerate = () => {
    const placeholderContent =
      '在 2147 年的新东京，霓虹灯闪烁的街道上，一台老旧的机器人正在修理自己的核心电路。它的机械手指颤抖着，微小的电火花在指间跳跃。周围是全息广告牌，播放着最新的脑机接口广告。'
    setGeneratedContent(placeholderContent)
    toast.success('文本生成成功！')
  }

  const handleCollect = (data: {
    projectId?: string
    type: WorkType
    content: string
    prompt: string
    engine?: string
  }) => {
    createWork.mutate(data, {
      onSuccess: () => {
        setCollectDialogOpen(false)
        toast.success('作品已收藏到作品集')
      },
      onError: () => toast.error('收藏失败'),
    })
  }

  return (
    <>
      <div className='flex-1 flex flex-col'>
        <ToolHeader title='营销文案' icon={Type} onBack={onBack} />

        <div className='flex gap-6 flex-1'>
          <div className='w-96 flex-shrink-0'>
            <Card className='h-full bg-linear-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm p-6'>
              <h2 className='text-lg font-semibold text-foreground mb-4'>文案设置</h2>

              <div className='mb-6'>
                <label htmlFor='text-prompt' className='text-sm text-muted-foreground mb-2 block'>
                  输入提示词
                </label>
                <Textarea
                  id='text-prompt'
                  placeholder='例如：请帮我写一段关于未来城市的科幻小说开头...'
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  className='min-h-[200px] bg-background/50 border-border/30 text-foreground placeholder:text-muted-foreground resize-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 backdrop-blur-sm transition-all duration-300'
                />
                <div className='flex justify-between mt-2'>
                  <span className='text-xs text-muted-foreground'>简短描述需求即可</span>
                  <span className='text-xs text-muted-foreground'>{prompt.length}/300</span>
                </div>
              </div>

              <div className='mt-6'>
                <Button
                  onClick={handleGenerate}
                  className='w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40'
                >
                  <Sparkles className='w-4 h-4 mr-2' />
                  开始生成
                </Button>
                <p className='text-center text-xs text-muted-foreground mt-2'>免费使用</p>
              </div>
            </Card>
          </div>

          <div className='flex-1'>
            <Card className='h-full bg-card border-border backdrop-blur-sm flex flex-col'>
              <div className='p-4 border-b border-border'>
                <h2 className='text-lg font-semibold text-foreground'>生成结果</h2>
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
                    <div className='h-full flex flex-col'>
                      <div className='flex-1 bg-background/50 border border-border/30 rounded-lg p-6 overflow-auto'>
                        <p className='text-foreground whitespace-pre-wrap'>{generatedContent}</p>
                      </div>
                      <Button
                        onClick={() => setCollectDialogOpen(true)}
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
                      <Type className='w-10 h-10 text-muted-foreground' />
                    </div>
                    <p className='text-muted-foreground text-lg mb-2'>在此处查看生成的文案</p>
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
        type='text'
        content={generatedContent || ''}
        prompt={prompt}
        projects={projects}
        isPending={createWork.isPending}
        onCollect={handleCollect}
      />
    </>
  )
}
