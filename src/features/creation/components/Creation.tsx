import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  PenTool,
  Save,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'

const CREATION_STEPS = [
  { id: 1, label: '基础设定', icon: Settings },
  { id: 2, label: '角色建立', icon: Users },
  { id: 3, label: '剧本撰写', icon: FileText },
  { id: 4, label: '分镜拆解', icon: ImageIcon },
  { id: 5, label: '画面生成', icon: ImageIcon },
] as const

export default function CreationPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(3)
  const [content, setContent] = useState('')
  const [activeTab, setActiveTab] = useState('manual')

  const handleSave = () => {
    console.log('Saving progress...')
  }

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleNextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed'
    if (stepId === currentStep) return 'current'
    return 'pending'
  }

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000' />
      </div>

      <div className='relative z-10 flex-1 p-8'>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex items-start gap-6'>
            <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30'>
              <PenTool className='w-6 h-6 text-cyan-400' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-white mb-2 tracking-tight'>创作中心</h1>
              <p className='text-sm text-gray-500'>流水线创作，一站式体验</p>
            </div>
          </div>
        </div>

        <div className='mb-8'>
          <div className='flex items-center'>
            {CREATION_STEPS.map((step, index) => {
              const status = getStepStatus(step.id)
              const Icon = step.icon
              const isLast = index === CREATION_STEPS.length - 1

              return (
                <div key={step.id} className='flex items-center flex-1'>
                  <div className='flex flex-col items-center'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        status === 'completed'
                          ? 'bg-gradient-to-br from-cyan-500 to-teal-500 border-transparent text-white'
                          : status === 'current'
                            ? 'bg-[#0a0a0a] border-cyan-500 text-cyan-400'
                            : 'bg-[#0a0a0a] border-gray-700 text-gray-500'
                      }`}
                    >
                      {status === 'completed' ? (
                        <svg
                          className='w-5 h-5'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          aria-label='完成'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={3}
                            d='M5 13l4 4L19 7'
                          />
                        </svg>
                      ) : (
                        <Icon className='w-5 h-5' />
                      )}
                    </div>
                    <p
                      className={`text-xs font-medium mt-2 ${status === 'pending' ? 'text-gray-500' : 'text-white'}`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {!isLast && (
                    <div className='flex-1 mx-4 h-0.5'>
                      {status === 'completed' ? (
                        <div className='h-full bg-gradient-to-r from-cyan-500 to-teal-500' />
                      ) : (
                        <div className='h-full bg-gray-800' />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'manual' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <PenTool className='w-4 h-4' />
              <span>手动创作</span>
            </Button>
            <Button
              variant='ghost'
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'ai' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200'}`}
            >
              <Sparkles className='w-4 h-4' />
              <span>AI 智脑</span>
            </Button>
          </div>
        </div>

        <div className='relative bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden'>
          <div className='flex items-center justify-between px-4 py-3 border-b border-gray-800'>
            <Button variant='ghost' size='icon' className='h-8 w-8 text-gray-500 hover:text-white'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-label='添加'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
            </Button>
            <div className='text-xs text-gray-600 font-medium'>MANUAL EDITOR</div>
            <Button
              onClick={handleSave}
              className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm px-4 py-1.5 hover:from-cyan-600 hover:to-teal-600'
            >
              <Save className='w-4 h-4 mr-2' />
              保存进度
            </Button>
          </div>

          {activeTab === 'manual' ? (
            <Textarea
              placeholder='在此处开始您的剧本创作...'
              value={content}
              onChange={e => setContent(e.target.value)}
              className='min-h-[500px] bg-transparent border-0 text-white placeholder:text-gray-600 resize-none text-base leading-relaxed focus:ring-0 focus:outline-none'
            />
          ) : (
            <div className='min-h-[500px] flex items-center justify-center'>
              <div className='text-center'>
                <div className='flex justify-center mb-4'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse' />
                    <Sparkles className='relative w-16 h-16 text-cyan-400' />
                  </div>
                </div>
                <p className='text-gray-500 text-lg mb-2'>AI 智脑正在准备中...</p>
                <p className='text-gray-600 text-sm mb-4'>敬请期待更多 AI 创作功能</p>
                <Button
                  onClick={() => navigate('/ai-tools')}
                  variant='outline'
                  className='bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50'
                >
                  前往 AI 工具箱
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className='absolute bottom-4 right-4 text-xs text-gray-500 bg-[#0a0a0a] px-3 py-1.5 rounded border border-gray-800'>
              {content.length}/10000 CHARS
            </div>
          )}
        </div>

        <div className='flex items-center justify-between mt-6'>
          <Button
            variant='outline'
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className='bg-[#1a1a1a] border-gray-700 text-white hover:bg-[#2a2a2a] hover:border-gray-600'
          >
            <ChevronLeft className='mr-2 h-4 w-4' />
            上一步
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={currentStep === 5}
            className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600'
          >
            下一步
            <ChevronRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
