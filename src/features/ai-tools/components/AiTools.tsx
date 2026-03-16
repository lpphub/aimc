'use client'

import { Image, Sparkles, Type, Video } from 'lucide-react'
import { useState } from 'react'
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

    // 模拟生成过程
    const placeholderContent = {
      text: '在 2147 年的新东京，霓虹灯闪烁的街道上，一台老旧的机器人正在修理自己的核心电路。它的机械手指颤抖着，微小的电火花在指间跳跃。周围是全息广告牌，播放着最新的脑机接口广告。',
      image: 'AI 正在生成图片...',
      video: 'AI 正在渲染视频...',
    }

    alert(
      `${activeTab === 'text' ? '文本' : activeTab === 'image' ? '图片' : '视频'}生成功能已触发！\n\n提示词: ${prompt}\n\n${placeholderContent[activeTab]}`
    )
  }

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]'>
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
              <p className='text-sm text-gray-500'>单点工具，激发无限创意</p>
            </div>
          </div>

          {/* Tabs */}
          <div className='flex gap-2'>
            <Button
              variant={activeTab === 'text' ? 'default' : 'outline'}
              onClick={() => setActiveTab('text')}
              className={
                activeTab === 'text'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-gray-900/50 border-gray-700/30 text-gray-400 hover:text-white hover:bg-gray-800/50'
              }
            >
              <Type className='w-4 h-4 mr-2' />
              AI文本
            </Button>
            <Button
              variant={activeTab === 'image' ? 'default' : 'outline'}
              onClick={() => setActiveTab('image')}
              className={
                activeTab === 'image'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-gray-900/50 border-gray-700/30 text-gray-400 hover:text-white hover:bg-gray-800/50'
              }
            >
              <Image className='w-4 h-4 mr-2' />
              AI绘图
            </Button>
            <Button
              variant={activeTab === 'video' ? 'default' : 'outline'}
              onClick={() => setActiveTab('video')}
              className={
                activeTab === 'video'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-gray-900/50 border-gray-700/30 text-gray-400 hover:text-white hover:bg-gray-800/50'
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
                <h2 className='text-lg font-semibold text-white mb-4'>文本生成设置</h2>

                {/* Prompt Input */}
                <div className='mb-6'>
                  <label htmlFor='text-prompt' className='text-sm text-gray-400 mb-2 block'>
                    输入提示词
                  </label>
                  <Textarea
                    id='text-prompt'
                    placeholder='例如：请帮我写一段关于未来城市的科幻小说开头...'
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className='min-h-[200px] bg-gray-900/50 border-gray-700/30 text-white placeholder:text-gray-600 resize-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300'
                  />
                  <div className='flex justify-between mt-2'>
                    <span className='text-xs text-gray-500'>
                      例如：请帮我写一段关于未来城市的科幻小说开头...
                    </span>
                    <span className='text-xs text-gray-500'>{prompt.length}/300</span>
                  </div>
                </div>

                {/* Generate Button */}
                <div className='mt-6'>
                  <Button
                    onClick={handleGenerate}
                    className='w-full h-12 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40'
                  >
                    开始生成
                  </Button>
                  <p className='text-center text-xs text-gray-500 mt-2'>免费使用</p>
                </div>
              </Card>
            )}

            {activeTab === 'image' && (
              <Card className='h-full bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm p-6'>
                <h2 className='text-lg font-semibold text-white mb-4'>灵感参数</h2>

                {/* Core Engine */}
                <div className='mb-6'>
                  <label className='text-sm text-gray-400 mb-2 block'>核心引擎</label>
                  <Select defaultValue='gemini'>
                    <SelectTrigger className='w-full h-10 bg-gray-900/50 border-gray-700/30 text-white focus:border-cyan-500/50'>
                      <SelectValue placeholder='选择引擎' />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-900/95 border-gray-700/30'>
                      <SelectItem value='gemini'>Gemini生图1K (5 灵感值)</SelectItem>
                      <SelectItem value='dall-e'>DALL-E 3 (10 灵感值)</SelectItem>
                      <SelectItem value='stable'>Stable Diffusion (8 灵感值)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Aspect Ratio */}
                <div className='mb-6'>
                  <label className='text-sm text-gray-400 mb-2 block'>画幅比例</label>
                  <div className='grid grid-cols-5 gap-2'>
                    {aspectRatios.map(ratio => (
                      <Button
                        key={ratio.value}
                        variant={aspectRatio === ratio.value ? 'default' : 'outline'}
                        onClick={() => setAspectRatio(ratio.value)}
                        className={
                          aspectRatio === ratio.value
                            ? 'h-10 bg-cyan-500 text-white text-xs shadow-lg shadow-cyan-500/20'
                            : 'h-10 bg-gray-900/50 border-gray-700/30 text-gray-400 text-xs hover:bg-gray-800/50'
                        }
                      >
                        {ratio.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Reference Images */}
                <div className='mb-6'>
                  <label className='text-sm text-gray-400 mb-2 block'>
                    参考图 ({referenceImages.length}/3)
                  </label>
                  <div className='border-2 border-dashed border-gray-700/30 rounded-lg p-6 text-center hover:border-cyan-500/50 transition-colors cursor-pointer'>
                    <div className='flex flex-col items-center gap-2'>
                      <div className='w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center'>
                        <Sparkles className='w-5 h-5 text-gray-500' />
                      </div>
                      <span className='text-sm text-gray-500'>上传</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className='mb-6'>
                  <label className='text-sm text-gray-400 mb-2 block'>画面描述</label>
                  <Textarea
                    placeholder='输入灵感提示词...'
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className='min-h-[150px] bg-gray-900/50 border-gray-700/30 text-white placeholder:text-gray-600 resize-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300'
                  />
                  <div className='flex justify-end mt-2'>
                    <span className='text-xs text-gray-500'>{prompt.length}/3000</span>
                  </div>
                </div>

                {/* Generate Button */}
                <div className='mt-6'>
                  <Button
                    onClick={handleGenerate}
                    className='w-full h-12 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40'
                  >
                    开始渲染作品
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'video' && (
              <Card className='h-full bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm p-6'>
                <h2 className='text-lg font-semibold text-white mb-4'>视频引擎设置</h2>

                {/* Render Engine */}
                <div className='mb-6'>
                  <label className='text-sm text-gray-400 mb-2 block'>渲染模型引擎</label>
                  <Select defaultValue='veo'>
                    <SelectTrigger className='w-full h-10 bg-gray-900/50 border-gray-700/30 text-white focus:border-cyan-500/50'>
                      <SelectValue placeholder='选择引擎' />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-900/95 border-gray-700/30'>
                      <SelectItem value='veo'>veo3.1_pro-4k (40 灵感值)</SelectItem>
                      <SelectItem value='sora'>Sora (60 灵感值)</SelectItem>
                      <SelectItem value='runway'>Runway Gen-2 (50 灵感值)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Scene Description */}
                <div className='mb-6'>
                  <label className='text-sm text-gray-400 mb-2 block'>场景描述</label>
                  <div className='relative'>
                    <Textarea
                      placeholder='描述视频内容，如：赛博朋克风格的猫在霓虹街道上奔跑，4K 电影质感...'
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      className='min-h-[150px] bg-gray-900/50 border-gray-700/30 text-white placeholder:text-gray-600 resize-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-sm transition-all duration-300 pr-12'
                    />
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute top-2 right-2 w-8 h-8 text-gray-500 hover:text-cyan-400'
                    >
                      <Sparkles className='w-4 h-4' />
                    </Button>
                  </div>
                  <div className='flex justify-end mt-2'>
                    <span className='text-xs text-gray-500'>{prompt.length}/3000</span>
                  </div>
                </div>

                {/* Frame Stitching */}
                <div className='mb-6'>
                  <label className='text-sm text-gray-400 mb-2 block'>首尾帧自动拼接</label>
                  <div className='flex items-center justify-between p-3 bg-gray-900/50 border border-gray-700/30 rounded-lg'>
                    <span className='text-sm text-gray-500'>未开启</span>
                    <div className='w-12 h-6 bg-gray-700/50 rounded-full relative'>
                      <div className='absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full transition-all' />
                    </div>
                  </div>
                  <p className='text-xs text-gray-600 mt-2'>
                    开启后需要上传首帧与尾帧，系统自动补间生成
                  </p>

                  {/* Frame Upload */}
                  <div className='grid grid-cols-2 gap-3 mt-3'>
                    <div className='border-2 border-dashed border-gray-700/30 rounded-lg p-4 text-center hover:border-cyan-500/50 transition-colors cursor-pointer'>
                      <div className='flex flex-col items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center'>
                          <Sparkles className='w-4 h-4 text-gray-500' />
                        </div>
                        <span className='text-xs text-gray-500'>上传首帧</span>
                      </div>
                    </div>
                    <div className='border-2 border-dashed border-gray-700/30 rounded-lg p-4 text-center hover:border-cyan-500/50 transition-colors cursor-pointer'>
                      <div className='flex flex-col items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center'>
                          <Sparkles className='w-4 h-4 text-gray-500' />
                        </div>
                        <span className='text-xs text-gray-500'>上传尾帧</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className='mt-6'>
                  <Button
                    onClick={handleGenerate}
                    className='w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40'
                  >
                    开始AI渲染
                  </Button>
                  <p className='text-center text-xs text-gray-500 mt-2'>预估消耗: 40 灵感值</p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Panel - Preview/Result */}
          <div className='flex-1'>
            <Card className='h-full bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm flex flex-col'>
              <div className='p-4 border-b border-gray-700/30'>
                <h2 className='text-lg font-semibold text-white'>
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

                {/* Status */}
                <div className='text-center relative z-10'>
                  {activeTab === 'text' ? (
                    <div>
                      <div className='w-20 h-20 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center mx-auto mb-4'>
                        <Type className='w-10 h-10 text-gray-600' />
                      </div>
                      <p className='text-gray-500 text-lg mb-2'>在此处查看生成的文本内容</p>
                    </div>
                  ) : activeTab === 'image' ? (
                    <div>
                      <div className='w-20 h-20 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center mx-auto mb-4'>
                        <Image className='w-10 h-10 text-gray-600' />
                      </div>
                      <p className='text-gray-500 text-lg mb-2'>AI 绘图引擎就绪</p>
                    </div>
                  ) : (
                    <div>
                      <div className='w-20 h-20 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center mx-auto mb-4'>
                        <Video className='w-10 h-10 text-gray-600' />
                      </div>
                      <p className='text-gray-500 text-lg mb-2'>画境引擎 就绪</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
