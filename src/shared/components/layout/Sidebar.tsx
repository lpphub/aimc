import { Clock, FolderOpen, Image, LogOut, Sparkles } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useLogout } from '@/features/auth'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useLogout()

  const navItems = [
    {
      path: '/creations',
      icon: Sparkles,
      label: '工具箱',
    },
    {
      path: '/canvas',
      icon: Image,
      label: 'AI绘图',
    },
    {
      path: '/materials',
      icon: FolderOpen,
      label: '素材库',
    },
    {
      path: '/projects',
      icon: Clock,
      label: '项目',
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className='fixed left-0 top-0 h-screen w-64 bg-background border-r border-primary/10 flex flex-col py-6 z-50 shadow-[0_0_40px_rgba(0,242,255,0.06)]'>
      <div className='px-6 mb-10'>
        <div className='text-xl font-bold tracking-tighter text-primary mb-1'>AIMC</div>
        <div className='text-[0.6875rem] font-bold tracking-widest uppercase text-muted-foreground'>
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
                  : 'text-muted-foreground hover:bg-surface-container-high/50 hover:text-primary'
              )}
            >
              <Icon
                className={cn('w-5 h-5 transition-transform', !isActive && 'group-hover:scale-110')}
              />
              <span className='font-medium text-sm'>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className='px-6 mt-auto space-y-4'>
        <div className='pt-6 border-t border-border/10 flex items-center'>
          <div className='overflow-hidden flex-1'>
            <div className='text-xs text-foreground truncate'>管理员</div>
          </div>
          <button
            type='button'
            onClick={handleLogout}
            className='text-muted-foreground hover:text-primary cursor-pointer transition-colors'
            title='退出登录'
          >
            <LogOut className='w-4 h-4' />
          </button>
        </div>
      </div>
    </aside>
  )
}
