import { FolderOpen, LogOut, Sparkles, Tag } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useLogout } from '@/features/auth'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  const navItems = [
    {
      path: '/portfolio',
      icon: FolderOpen,
      label: '作品集',
      description: 'AI创作结果',
    },
    {
      path: '/tools',
      icon: Sparkles,
      label: '工具箱',
      description: 'AI工具',
    },
    {
      path: '/materials',
      icon: Tag,
      label: '素材库',
      description: '素材管理',
    },
  ]

  const handleLogout = () => {
    logoutMutation.mutate()
    navigate('/login', { replace: true })
  }

  return (
    <aside className='fixed left-0 top-0 bottom-0 z-50 w-64 bg-background/95 backdrop-blur-xl border-r border-border flex flex-col'>
      {/* Logo Section */}
      <div className='p-6 border-b border-border'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex-shrink-0'>
            <Sparkles className='w-5 h-5 text-cyan-400' />
          </div>
          <div className='overflow-hidden whitespace-nowrap max-w-48 opacity-100'>
            <h1 className='text-lg font-bold text-foreground'>智绘工坊</h1>
            <p className='text-xs text-muted-foreground'>AI 创作平台</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className='flex-1 px-3 py-4 space-y-1 overflow-y-auto'>
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group',
                isActive
                  ? 'bg-gradient-to-br from-sidebar-active/20 to-teal-500/20 text-cyan-400 border border-sidebar-active/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'scale-110')} />
              <div className='flex-1 overflow-hidden whitespace-nowrap max-w-48 opacity-100'>
                <div className='text-sm font-medium'>{item.label}</div>
                <div className='text-xs text-muted-foreground'>{item.description}</div>
              </div>
              {isActive && (
                <div className='absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse' />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer - Logout & Collapse */}
      <div className='p-3 space-y-1'>
        {/* Logout Button */}
        <button
          type='button'
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300',
            'text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30'
          )}
          title='退出登录'
        >
          <LogOut className='w-5 h-5 flex-shrink-0' />
          <span className='text-sm font-medium flex-1 text-left overflow-hidden whitespace-nowrap max-w-48 opacity-100'>
            退出登录
          </span>
        </button>
      </div>
    </aside>
  )
}
