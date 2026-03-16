import { createContext, type ReactNode, useContext, useState } from 'react'

interface NavigationContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <NavigationContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}