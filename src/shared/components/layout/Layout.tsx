import { Outlet } from 'react-router-dom'
import { Main } from './Main'
import { NavigationProvider } from './NavigationContext'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <NavigationProvider>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <Main>
          <Outlet />
        </Main>
      </div>
    </NavigationProvider>
  )
}