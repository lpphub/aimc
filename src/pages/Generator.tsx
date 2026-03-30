import { useParams } from 'react-router-dom'
import { GeneratorPage } from '@/features/generator'

export default function Generator() {
  const { conversationId } = useParams<{ conversationId: string }>()

  return (
    <div className='h-screen w-screen overflow-hidden bg-background'>
      <GeneratorPage conversationId={conversationId} />
    </div>
  )
}
