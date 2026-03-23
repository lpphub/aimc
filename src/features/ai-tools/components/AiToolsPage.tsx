import { useState } from 'react'
import type { ToolType } from '../types'
import { MarketingCopyTool } from './MarketingCopyTool'
import { PosterTool } from './PosterTool'
import { ToolSelector } from './ToolSelector'
import { VideoTool } from './VideoTool'

export function AiToolsPage() {
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null)

  return (
    <div className='flex-1 flex flex-col'>
      {!selectedTool ? (
        <ToolSelector onSelect={setSelectedTool} />
      ) : selectedTool === 'text' ? (
        <MarketingCopyTool onBack={() => setSelectedTool(null)} />
      ) : selectedTool === 'image' ? (
        <PosterTool onBack={() => setSelectedTool(null)} />
      ) : (
        <VideoTool onBack={() => setSelectedTool(null)} />
      )}
    </div>
  )
}
