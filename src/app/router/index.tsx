import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { NotFound, ServerError, Unauthorized } from '@/pages/base'
import { Layout } from '@/shared/components/layout'
import { AuthGuard } from './guard'

// 懒加载页面组件
const Login = lazy(() => import('@/pages/Login'))
const Home = lazy(() => import('@/pages/Home'))
const Creation = lazy(() => import('@/pages/Creation'))
const AiTools = lazy(() => import('@/pages/AiTools'))
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
        element: <Home />,
      },
      {
        path: 'creation',
        element: <Creation />,
      },
      {
        path: 'ai-tools',
        element: <AiTools />,
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
