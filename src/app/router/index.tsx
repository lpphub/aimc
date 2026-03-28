import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/pages/base'
import { Layout } from '@/shared/components/layout'
import { AuthGuard } from './guard'

const Login = lazy(() => import('@/pages/Login'))
const Landing = lazy(() => import('@/pages/Landing'))
const Projects = lazy(() => import('@/pages/Projects'))
const Materials = lazy(() => import('@/pages/Materials'))
const Creations = lazy(() => import('@/pages/Creations'))
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
    element: (
      <AuthGuard requireAuth>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { path: '/creations', element: <Creations /> },
      { path: '/materials', element: <Materials /> },
      { path: '/projects', element: <Projects /> },
      { path: '/canvas', element: <CanvasGenerator /> },
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
