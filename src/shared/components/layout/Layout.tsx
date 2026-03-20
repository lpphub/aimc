import { Outlet } from 'react-router-dom'
import { Main } from './Main'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className='flex min-h-screen bg-[#0e0e0f]'>
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </div>
  )
}
