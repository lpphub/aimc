import { Outlet } from 'react-router-dom'
import { Main } from './Main'
import { Sidebar } from './Sidebar'

export function Layout() {
  return (
    <div className='flex min-h-screen bg-[#0a0a0a]'>
      <Sidebar />
      <Main>
        <Outlet />
      </Main>
    </div>
  )
}
