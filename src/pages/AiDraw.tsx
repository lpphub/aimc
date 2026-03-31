import { History, ImagePlus, Send, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConversationList } from '@/features/generator'
import { useCreateConversation } from '@/features/generator/hooks'
import { type PendingImage, useChatStore } from '@/features/generator/stores/chat'

export default function AiDraw() {
  const navigate = useNavigate()
  const createConversation = useCreateConversation()
  const setPendingMessage = useChatStore(state => state.setPendingMessage)
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () =>
      pendingImages.forEach(img => {
        URL.revokeObjectURL(img.url)
      })
  }, [pendingImages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!inputValue.trim() && pendingImages.length === 0) || createConversation.isPending) return

    setPendingMessage({
      text: inputValue.trim() || '[图片]',
      images: pendingImages,
    })

    try {
      const result = await createConversation.mutateAsync({})
      navigate(`/canvas/${result.conversation.id}`)
    } catch {
      // Error handled by hook
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || createConversation.isPending) return

    const newImages = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file,
    }))
    setPendingImages(prev => [...prev, ...newImages])
    e.target.value = ''
  }

  const removePendingImage = (index: number) => {
    const img = pendingImages[index]
    if (img) {
      URL.revokeObjectURL(img.url)
      setPendingImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const chatInputForm = (
    <form onSubmit={handleSubmit} className='w-full max-w-2xl'>
      <div className='bg-muted/50 rounded-2xl border border-border/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all'>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          className='hidden'
          onChange={handleFileSelect}
        />

        {pendingImages.length > 0 && (
          <div className='flex flex-wrap gap-2 mx-3 mt-2'>
            {pendingImages.map((img, index) => (
              <div key={img.url} className='relative'>
                <img src={img.url} alt='待发送图片' className='h-5 w-10 rounded object-cover' />
                <button
                  type='button'
                  onClick={() => removePendingImage(index)}
                  className='absolute -top-1.5 -right-1.5 p-0.5 bg-background rounded-full text-muted-foreground hover:text-destructive transition-colors shadow-sm'
                  title='移除图片'
                >
                  <XCircle className='w-3 h-3' />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder='描述你想要的效果...'
          className='w-full px-4 py-3 text-sm bg-transparent border-0 rounded-t-2xl focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60 resize-none max-h-32 leading-relaxed overflow-y-auto'
          disabled={createConversation.isPending}
          rows={3}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />

        <div className='flex items-center justify-between px-2 pb-2 pt-0.5'>
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            disabled={createConversation.isPending}
            className='p-1.5 text-muted-foreground/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-all disabled:opacity-40'
            title='上传图片'
          >
            <ImagePlus className='w-4 h-4' />
          </button>
          <button
            type='submit'
            disabled={
              createConversation.isPending || (!inputValue.trim() && pendingImages.length === 0)
            }
            className='p-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)]'
          >
            <Send className='w-4 h-4' />
          </button>
        </div>
      </div>
      <div className='flex items-center justify-end mt-3 px-1'>
        <span className='text-xs text-muted-foreground/40'>按 Enter 发送，Shift + Enter 换行</span>
      </div>
    </form>
  )

  const heroSection = (
    <div className='text-center max-w-2xl'>
      <div className='w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6'>
        <ImagePlus className='w-10 h-10 text-primary' />
      </div>
      <h1 className='text-3xl font-bold text-foreground mb-3'>AI 绘图</h1>
      <p className='text-muted-foreground mb-8'>
        描述你想要的画面，AI 将为你生成创意图片。支持上传参考图，实时在画布上编辑。
      </p>
    </div>
  )

  if (!isHistoryExpanded) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center p-8 relative'>
        {heroSection}
        {chatInputForm}

        <button
          type='button'
          onClick={() => setIsHistoryExpanded(true)}
          className='absolute right-4 top-4 z-50 p-3 bg-card/90 backdrop-blur-xl border border-primary/30 text-primary rounded-2xl shadow-[0_0_40px_rgba(0,242,255,0.15)] hover:shadow-[0_0_60px_rgba(0,242,255,0.25)] hover:border-primary/50 hover:scale-105 transition-all duration-300'
          title='历史对话'
        >
          <History className='w-5 h-5' />
        </button>
      </div>
    )
  }

  return (
    <div className='flex-1 flex relative'>
      <div className='flex-1 flex flex-col items-center justify-center p-8'>
        {heroSection}
        {chatInputForm}
      </div>

      <div className='absolute right-4 top-4 bottom-4 z-50 w-80 flex flex-col bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.3)] transition-all duration-300'>
        <div className='flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center'>
              <History className='w-4 h-4 text-primary' />
            </div>
            <span className='text-sm font-medium text-foreground'>历史对话</span>
          </div>
          <button
            type='button'
            onClick={() => setIsHistoryExpanded(false)}
            className='p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors'
            title='收起'
          >
            <History className='w-4 h-4' />
          </button>
        </div>

        <ConversationList />
      </div>
    </div>
  )
}
