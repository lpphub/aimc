import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/pages/base'
import { Layout } from '@/shared/components/layout'
import { AuthGuard } from './guard'

const Login = lazy(() => import('@/pages/Login'))
const Landing = lazy(() => import('@/pages/Landing'))
const AiDraw = lazy(() => import('@/pages/AiDraw'))
const Generator = lazy(() => import('@/pages/Generator'))
const Tools = lazy(() => import('@/pages/Tools'))
const Materials = lazy(() => import('@/pages/Materials'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: (
      <AuthGuard>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: '/canvas/:conversationId',
    element: (
      <AuthGuard requireAuth>
        <Generator />
      </AuthGuard>
    ),
  },
  {
    element: (
      <AuthGuard requireAuth>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { path: '/canvas', element: <AiDraw /> },
      { path: '/tools', element: <Tools /> },
      { path: '/materials', element: <Materials /> },
    ],
  },
  {
    path: '/401',
    element: <Unauthorized />,
  },
  {
    path: '/500',
    element: <ServerError />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
