import { createContext, type ReactNode, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Layers, LogOut, PenTool, Sparkles } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useLogout } from '@/features/auth'
import { cn } from '@/lib/utils'
import { useStore } from '@/shared/stores/useStore'

// Navigation Context
interface NavigationContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a Layout')
  }
  return context
}

// Sidebar Component
function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { setActiveTab } = useStore()
  const { isCollapsed, toggleSidebar } = useNavigation()
  const logoutMutation = useLogout()

  const navItems = [
    {
      path: '/',
      icon: Layers,
      label: '作品库',
      description: '项目概览',
    },
    {
      path: '/creation',
      icon: PenTool,
      label: '创作中心',
      description: '流水线创作',
    },
    {
      path: '/ai-tools',
      icon: Sparkles,
      label: 'AI 工具箱',
      description: '单点工具',
    },
  ]

  const handleLogout = () => {
    logoutMutation.mutate()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-gray-800 transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex-shrink-0">
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div
            className={cn(
              'overflow-hidden whitespace-nowrap transition-all duration-300',
              isCollapsed ? 'max-w-0 opacity-0' : 'max-w-48 opacity-100'
            )}
          >
            <h1 className="text-lg font-bold text-white">智绘工坊</h1>
            <p className="text-xs text-gray-500">AI 创作平台</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setActiveTab(item.path as 'home' | 'ai-tools' | 'creation')}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-500 hover:text-white hover:bg-gray-800/50 border border-transparent'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'scale-110')} />
              <div
                className={cn(
                  'flex-1 overflow-hidden whitespace-nowrap transition-all duration-300',
                  isCollapsed ? 'max-w-0 opacity-0' : 'max-w-48 opacity-100'
                )}
              >
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-gray-600">{item.description}</div>
              </div>
              {isActive && !isCollapsed && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer - Logout & Collapse */}
      <div className="p-3 border-t border-gray-800 space-y-1">
        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300',
            'text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30'
          )}
          title="退出登录"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span
            className={cn(
              'text-sm font-medium flex-1 text-left overflow-hidden whitespace-nowrap transition-all duration-300',
              isCollapsed ? 'max-w-0 opacity-0' : 'max-w-48 opacity-100'
            )}
          >
            退出登录
          </span>
        </button>

        {/* Collapse Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300',
            'text-gray-500 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-700/30'
          )}
          title={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 flex-shrink-0" />
              <span
                className={cn(
                  'text-sm font-medium flex-1 text-left overflow-hidden whitespace-nowrap transition-all duration-300',
                  isCollapsed ? 'max-w-0 opacity-0' : 'max-w-48 opacity-100'
                )}
              >
                收起
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

// Main Component
function Main({ children }: { children: ReactNode }) {
  const { isCollapsed } = useNavigation()

  return (
    <div className={cn('flex-1 transition-all duration-300', isCollapsed ? 'ml-20' : 'ml-64')}>
      {children}
    </div>
  )
}

// Layout Component
export function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <NavigationContext.Provider value={{ isCollapsed, toggleSidebar }}>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <Main>
          <Outlet />
        </Main>
      </div>
    </NavigationContext.Provider>
  )
}