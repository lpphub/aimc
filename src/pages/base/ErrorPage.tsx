import { SearchX, ServerCrash, ShieldX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'

interface ErrorPageProps {
  code: string
  title: string
  description: string
  icon: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

function ErrorPage({ code, title, description, icon, action, secondaryAction }: ErrorPageProps) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4'>
      {/* Animated background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>

      <div className='relative w-full max-w-md'>
        <div className='text-center space-y-8'>
          {/* Error code */}
          <div className='relative'>
            <span
              className={cn(
                'text-[10rem] font-bold leading-none select-none',
                'bg-linear-to-br from-cyan-500/30 via-cyan-500/20 to-transparent',
                'bg-clip-text text-transparent'
              )}
            >
              {code}
            </span>
            {/* Icon overlay */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='p-4 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'>
                {icon}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='space-y-3'>
            <h1 className='text-2xl font-semibold text-white'>{title}</h1>
            <p className='text-gray-500 max-w-sm mx-auto'>{description}</p>
          </div>

          {/* Actions */}
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            {action && (
              <Button
                onClick={action.onClick}
                className='bg-linear-to-br from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600'
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant='outline'
                onClick={secondaryAction.onClick}
                className='border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotFound() {
  const navigate = useNavigate()

  return (
    <ErrorPage
      code='404'
      title='页面不存在'
      description='抱歉，您访问的页面不存在或已被移除。请检查网址是否正确。'
      icon={<SearchX size={48} strokeWidth={1.5} />}
      action={{
        label: '返回首页',
        onClick: () => navigate('/', { replace: true }),
      }}
    />
  )
}

export function Unauthorized() {
  const navigate = useNavigate()

  return (
    <ErrorPage
      code='401'
      title='未授权访问'
      description='抱歉，您没有权限访问此页面。请登录后重试。'
      icon={<ShieldX size={48} strokeWidth={1.5} />}
      action={{
        label: '前往登录',
        onClick: () => navigate('/login', { replace: true }),
      }}
      secondaryAction={{
        label: '返回首页',
        onClick: () => navigate('/', { replace: true }),
      }}
    />
  )
}

export function ServerError() {
  const navigate = useNavigate()

  return (
    <ErrorPage
      code='500'
      title='服务器错误'
      description='抱歉，服务器遇到了问题。请稍后重试或联系管理员。'
      icon={<ServerCrash size={48} strokeWidth={1.5} />}
      action={{
        label: '刷新页面',
        onClick: () => window.location.reload(),
      }}
      secondaryAction={{
        label: '返回首页',
        onClick: () => navigate('/', { replace: true }),
      }}
    />
  )
}
