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
      icon: X,
      label: '工具箱',
    },
    {
      path: '/materials',
      icon: Tag,
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
    <aside className='fixed left-0 top-0 bottom-0 z-50 w-52 bg-[#0f1419] border-r border-white/5 flex flex-col'>
      <div className='p-6'>
        <div className='mb-1'>
          <h1 className='text-cyan-400 text-base font-bold tracking-wide'>AIGC Toolset</h1>
        </div>
        <p className='text-[10px] text-gray-500 uppercase tracking-widest'>
          THE SYNTHETIC ARCHITECT
        </p>
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
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              )}
            >
              <Icon className='w-4 h-4' />
              <span className='text-sm'>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className='p-4 border-t border-white/5'>
        <button
          type='button'
          className='w-full px-4 py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-sm font-medium transition-colors'
        >
          NEW PROJECT
        </button>
      </div>

      <div className='p-3 border-t border-white/5 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full bg-linear-to-br from-cyan-400 to-teal-400' />
          <span className='text-xs text-gray-400'>管理员</span>
        </div>
        <button
          type='button'
          onClick={handleLogout}
          className='p-2 hover:bg-white/5 rounded-lg transition-colors'
          title='设置'
        >
          <Settings className='w-4 h-4 text-gray-400' />
        </button>
      </div>
    </aside>
  )
}
