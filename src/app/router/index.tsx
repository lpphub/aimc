import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/pages/base'
import { Layout } from '@/shared/components/layout'
import { AuthGuard } from './guard'

const Login = lazy(() => import('@/pages/Login'))
const Landing = lazy(() => import('@/pages/Landing'))
const Materials = lazy(() => import('@/pages/Materials'))
const Tools = lazy(() => import('@/pages/Tools'))
const CanvasGenerator = lazy(() => import('@/pages/CanvasGenerator'))

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
    path: '/canvas',
    element: (
      <AuthGuard requireAuth>
        <CanvasGenerator />
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