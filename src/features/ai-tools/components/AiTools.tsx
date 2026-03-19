'use client'

import { Heart, Image, Sparkles, Type, Video } from 'lucide-react'
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

export default function AiTools() {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'video'>('text')
  const [prompt, setPrompt] = useState('')
  const [referenceImages, _setReferenceImages] = useState<File[]>([])
  const [_startFrame, _setStartFrame] = useState<File | null>(null)
  const [_endFrame, _setEndFrame] = useState<File | null>(null)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [collectDialogOpen, setCollectDialogOpen] = useState(false)

  const aspectRatios = [
    { value: '1:1', label: '1:1' },
    { value: '2:3', label: '2:3' },
    { value: '3:2', label: '3:2' },
    { value: '3:4', label: '3:4' },
    { value: '4:3', label: '4:3' },
    { value: '4:5', label: '4:5' },
    { value: '5:4', label: '5:4' },
    { value: '9:16', label: '9:16' },
    { value: '16:9', label: '16:9' },
    { value: '21:9', label: '21:9' },
  ]

  const handleGenerate = () => {
    console.log('Generate with:', { activeTab, prompt, aspectRatio })

    const placeholderContent = {
      text: '在 2147 年的新东京，霓虹灯闪烁的街道上，一台老旧的机器人正在修理自己的核心电路。它的机械手指颤抖着，微小的电火花在指间跳跃。周围是全息广告牌，播放着最新的脑机接口广告。',
      image: 'https://picsum.photos/seed/ai-image/800/600',
      video: 'https://example.com/generated-video.mp4',
    }

    setGeneratedContent(placeholderContent[activeTab])
    toast.success(
      `${activeTab === 'text' ? '文本' : activeTab === 'image' ? '图片' : '视频'}生成成功！`
    )
  }

  const handleCollect = () => {
    if (!generatedContent) return
    setCollectDialogOpen(true)
  }

  const handleCollectSuccess = () => {
    toast.success('作品已收藏到作品集')
  }

  const handleTabChange = (tab: 'text' | 'image' | 'video') => {
    setActiveTab(tab)
    setGeneratedContent(null)
  }

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-background'>
      {/* Animated Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000' />
      </div>

      {/* Page Content */}
      <div className='relative z-10 flex-1 p-8'>
        {/* Header */}
        <div className='flex items-start justify-between mb-6'>
          <div className='flex items-start gap-6'>
            {/* Icon */}
            <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30'>
              <Sparkles className='w-6 h-6 text-purple-400' />
            </div>

            {/* Info */}
            <div>
              <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>AI工具箱</h1>
              <p className='text-sm text-muted-foreground'>单点工具，激发无限创意</p>
            </div>
          </div>

          {/* Tabs */}
          <div className='flex gap-2'>
            <Button
              variant={activeTab === 'text' ? 'default' : 'outline'}
              onClick={() => handleTabChange('text')}
              className={
                activeTab === 'text'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-background/50 border-border/30 text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
            >
              <Type className='w-4 h-4 mr-2' />
              AI文本
            </Button>
            <Button
              variant={activeTab === 'image' ? 'default' : 'outline'}
              onClick={() => handleTabChange('image')}
              className={
                activeTab === 'image'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-background/50 border-border/30 text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
            >
              <Image className='w-4 h-4 mr-2' />
              AI绘图
            </Button>
            <Button
              variant={activeTab === 'video' ? 'default' : 'outline'}
              onClick={() => handleTabChange('video')}
              className={
                activeTab === 'video'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-background/50 border-border/30 text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }
            >
              <Video className='w-4 h-4 mr-2' />
              AI视频
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex gap-6 h-[calc(100vh-280px)]'>
          {/* Left Panel - Settings */}
          <div className='w-96 flex-shrink-0'>
            {activeTab === 'text' && (
              <Card className='h-full bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm p-6'>
                <h2 className='text-lg font-semibold text-foreground mb-4'>文本生成设置</h2>

                {/* Prompt Input */}
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
                    <span className='text-xs text-muted-foreground'>
                      例如：请帮我写一段关于未来城市的科幻小说开头...
                    </span>
                    <span className='text-xs text-muted-foreground'>{prompt.length}/300</span>
                  </div>
                </div>

                {/* Generate Button */}
                <div className='mt-6'>
                  <Button
                    onClick={handleGenerate}
                    className='w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40'
                  >
                    开始生成
                  </Button>
                  <p className='text-center text-xs text-muted-foreground mt-2'>免费使用</p>
                </div>
              </Card>
            )}

            {activeTab === 'image' && (
              <Card className='h-full bg-card border-border backdrop-blur-sm p-6'>
                <h2 className='text-lg font-semibold text-foreground mb-4'>灵感参数</h2>

                {/* Core Engine */}
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

                {/* Aspect Ratio */}
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

                {/* Reference Images */}
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

                {/* Description */}
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

                {/* Generate Button */}
                <div className='mt-6'>
                  <Button
                    onClick={handleGenerate}
                    className='w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40'
                  >
                    开始渲染作品
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'video' && (
              <Card className='h-full bg-card border-border backdrop-blur-sm p-6'>
                <h2 className='text-lg font-semibold text-foreground mb-4'>视频引擎设置</h2>

                {/* Render Engine */}
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

                {/* Scene Description */}
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

                {/* Frame Stitching */}
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

                  {/* Frame Upload */}
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

                {/* Generate Button */}
                <div className='mt-6'>
                  <Button
                    onClick={handleGenerate}
                    className='w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40'
                  >
                    开始 AI 渲染
                  </Button>
                  <p className='text-center text-xs text-muted-foreground mt-2'>
                    预估消耗：40 灵感值
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Panel - Preview/Result */}
          <div className='flex-1'>
            <Card className='h-full bg-card border-border backdrop-blur-sm flex flex-col'>
              <div className='p-4 border-b border-border'>
                <h2 className='text-lg font-semibold text-foreground'>
                  {activeTab === 'text' ? '生成结果' : '预览区域'}
                </h2>
              </div>

              <div className='flex-1 flex items-center justify-center relative overflow-hidden'>
                {/* Grid Background */}
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
                    {activeTab === 'text' ? (
                      <div className='h-full flex flex-col'>
                        <div className='flex-1 bg-background/50 border border-border/30 rounded-lg p-6 overflow-auto'>
                          <p className='text-foreground whitespace-pre-wrap'>{generatedContent}</p>
                        </div>
                        <Button
                          onClick={handleCollect}
                          className='absolute bottom-8 right-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                        >
                          <Heart className='w-4 h-4 mr-2' />
                          收藏到作品集
                        </Button>
                      </div>
                    ) : activeTab === 'image' ? (
                      <div className='h-full flex flex-col items-center justify-center'>
                        <img
                          src={generatedContent}
                          alt='AI generated'
                          className='max-w-full max-h-[calc(100%-80px)] rounded-lg object-contain'
                        />
                        <Button
                          onClick={handleCollect}
                          className='absolute bottom-8 right-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                        >
                          <Heart className='w-4 h-4 mr-2' />
                          收藏到作品集
                        </Button>
                      </div>
                    ) : (
                      <div className='h-full flex flex-col items-center justify-center'>
                        <div className='w-full max-w-2xl aspect-video bg-background/50 border border-border/30 rounded-lg flex items-center justify-center'>
                          <Video className='w-16 h-16 text-muted-foreground' />
                        </div>
                        <Button
                          onClick={handleCollect}
                          className='absolute bottom-8 right-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                        >
                          <Heart className='w-4 h-4 mr-2' />
                          收藏到作品集
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='text-center relative z-10'>
                    {activeTab === 'text' ? (
                      <div>
                        <div className='w-20 h-20 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center mx-auto mb-4'>
                          <Type className='w-10 h-10 text-muted-foreground' />
                        </div>
                        <p className='text-muted-foreground text-lg mb-2'>
                          在此处查看生成的文本内容
                        </p>
                      </div>
                    ) : activeTab === 'image' ? (
                      <div>
                        <div className='w-20 h-20 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center mx-auto mb-4'>
                          <Image className='w-10 h-10 text-muted-foreground' />
                        </div>
                        <p className='text-muted-foreground text-lg mb-2'>AI 绘图引擎就绪</p>
                      </div>
                    ) : (
                      <div>
                        <div className='w-20 h-20 rounded-full bg-muted/50 border border-border/30 flex items-center justify-center mx-auto mb-4'>
                          <Video className='w-10 h-10 text-muted-foreground' />
                        </div>
                        <p className='text-muted-foreground text-lg mb-2'>画境引擎 就绪</p>
                      </div>
                    )}
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
        type={activeTab as WorkType}
        content={generatedContent || ''}
        prompt={prompt}
        onSuccess={handleCollectSuccess}
      />
    </div>
  )
}
