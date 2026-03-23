import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/pages/base'
import { Layout } from '@/shared/components/layout'
import { AuthGuard } from './guard'

const Login = lazy(() => import('@/pages/Login'))
const Projects = lazy(() => import('@/pages/Projects'))
const Materials = lazy(() => import('@/pages/Materials'))
const AiTools = lazy(() => import('@/pages/AiTools'))

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthGuard>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard requireAuth>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to='/projects' replace />,
      },
      {
        path: 'tools',
        element: <AiTools />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'materials',
        element: <Materials />,
      },
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
