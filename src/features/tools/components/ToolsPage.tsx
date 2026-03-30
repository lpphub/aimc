import { useState } from 'react'
import type { ToolType } from '../types'
import { OcrTool } from './OcrTool'
import { PosterTool } from './PosterTool'
import { TextTool } from './TextTool'
import { ToolGrid } from './ToolGrid'

export function ToolsPage() {
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null)

  return (
    <div className='flex-1 flex flex-col'>
      {!selectedTool ? (
        <ToolGrid onSelect={setSelectedTool} />
      ) : selectedTool === 'text' ? (
        <TextTool onBack={() => setSelectedTool(null)} />
      ) : selectedTool === 'image' ? (
        <PosterTool onBack={() => setSelectedTool(null)} />
      ) : (
        <OcrTool onBack={() => setSelectedTool(null)} />
      )}
    </div>
  )
}
