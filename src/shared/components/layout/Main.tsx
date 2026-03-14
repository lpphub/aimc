import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useNavigation } from './NavigationContext'

interface MainProps {
  children: ReactNode
}

export function Main({ children }: MainProps) {
  const { isCollapsed } = useNavigation()

  return (
    <div className={cn('flex-1 transition-all duration-300', isCollapsed ? 'ml-20' : 'ml-64')}>
      {children}
    </div>
  )
}