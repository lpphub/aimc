'use client'

import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { MarketingCopyTool } from './MarketingCopyTool'
import { PosterTool } from './PosterTool'
import { ToolSelector, type ToolType } from './ToolSelector'
import { VideoTool } from './VideoTool'

export default function AiTools() {
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null)

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-background'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000' />
      </div>

      <div className='relative z-10 flex-1 flex flex-col'>
        {!selectedTool ? (
          <>
            <div className='flex items-center gap-3 mb-4 px-8 pt-8'>
              <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30'>
                <Sparkles className='w-6 h-6 text-purple-400' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white tracking-tight'>AI工具箱</h1>
                <p className='text-sm text-muted-foreground mt-1'>单点工具，激发无限创意</p>
              </div>
            </div>
            <ToolSelector onSelect={setSelectedTool} />
          </>
        ) : selectedTool === 'text' ? (
          <MarketingCopyTool onBack={() => setSelectedTool(null)} />
        ) : selectedTool === 'image' ? (
          <PosterTool onBack={() => setSelectedTool(null)} />
        ) : (
          <VideoTool onBack={() => setSelectedTool(null)} />
        )}
      </div>
    </div>
  )
}
