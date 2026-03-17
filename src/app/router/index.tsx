import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/pages/base'
import { Layout } from '@/shared/components/layout'
import { AuthGuard } from './guard'

const Login = lazy(() => import('@/pages/Login'))
const Portfolio = lazy(() => import('@/pages/Portfolio'))
const Materials = lazy(() => import('@/pages/Materials'))
const AiTools = lazy(() => import('@/features/ai-tools').then(m => ({ default: m.AiTools })))
const ProjectDetail = lazy(() =>
  import('@/features/project').then(m => ({ default: m.ProjectDetail }))
)

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
        element: <Navigate to='/portfolio' replace />,
      },
      {
        path: 'tools',
        element: <AiTools />,
      },
      {
        path: 'portfolio',
        element: <Portfolio />,
      },
      {
        path: 'materials',
        element: <Materials />,
      },
      {
        path: 'project/:id',
        element: <ProjectDetail />,
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
