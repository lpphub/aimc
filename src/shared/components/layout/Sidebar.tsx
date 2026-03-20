import { Clock, FolderOpen, Settings, Sparkles, Tag, X } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useLogout } from '@/features/auth'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  const navItems = [
    {
      path: '/tools',
      icon: Sparkles,
      label: '工具箱',
    },
    {
      path: '/materials',
      icon: FolderOpen,
      label: '素材库',
    },
    {
      path: '/portfolio',
      icon: Clock,
      label: '项目日志',
    },
  ]

  const handleLogout = () => {
    logoutMutation.mutate()
    navigate('/login', { replace: true })
  }

  return (
    <aside className='fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest border-r border-primary-container/10 flex flex-col py-6 z-50 shadow-[0_0_40px_rgba(0,242,255,0.06)]'>
      <div className='px-6 mb-10'>
        <div className='text-xl font-bold tracking-tighter text-primary mb-1'>
          AIGC Toolset
        </div>
        <div className='text-[0.6875rem] font-bold tracking-[0.1em] uppercase text-on-surface-variant'>
          The Synthetic Architect
        </div>
      </div>

      <nav className='flex-1 px-3 space-y-1'>
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-4 px-4 py-3 transition-all rounded-xl group',
                isActive
                  ? 'bg-surface-container-high text-primary border-r-4 border-primary shadow-[0px_0px_15px_rgba(0,242,255,0.2)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform',
                  !isActive && 'group-hover:scale-110'
                )}
              />
              <span className='font-medium text-sm'>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className='px-6 mt-auto space-y-4'>
        <button
          type='button'
          className='w-full bg-surface-container-high border border-primary-container/20 text-primary font-bold py-3 rounded-xl uppercase tracking-tighter text-xs hover:bg-primary-container/5 transition-all active:scale-[0.98]'
        >
          New Project
        </button>

        <div className='pt-6 border-t border-outline-variant/10 flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full border border-primary-container/20 bg-gradient-to-br from-primary to-tertiary' />
          <div className='overflow-hidden flex-1'>
            <div className='text-xs font-bold text-on-surface truncate'>管理员</div>
            <div className='text-[10px] text-on-surface-variant truncate'>专业版计划</div>
          </div>
          <button
            type='button'
            onClick={handleLogout}
            className='text-on-surface-variant hover:text-primary cursor-pointer transition-colors'
            title='设置'
          >
            <Settings className='w-4 h-4' />
          </button>
        </div>
      </div>
    </aside>
  )
}
