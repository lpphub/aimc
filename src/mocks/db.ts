import type { User } from '@/features/auth/types'
import type { Project } from '@/features/project/types'

const users: Map<string, { password: string; user: User }> = new Map()

const tokens: Map<string, string> = new Map()

const projects: Map<string, Project> = new Map()

function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function storeToken(token: string, email: string): void {
  tokens.set(token, email)
}

function getEmailByToken(token: string): string | undefined {
  return tokens.get(token)
}

function removeToken(token: string): boolean {
  return tokens.delete(token)
}

function generateId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function seedMockUsers(): void {
  const testUser: User = {
    id: 1,
    email: 'test@aimc.com',
    username: '测试用户',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
    about: '这是一个测试用户',
  }

  users.set('test@aimc.com', {
    password: '123456',
    user: testUser,
  })
}

function seedMockProjects(): void {
  const mockProjects: Project[] = [
    {
      id: 'proj_001',
      name: 'AI 漫画创作项目',
      category: '漫画',
      tag: 'AI 漫画',
      createdAt: '2024/03/10',
      updatedAt: '2024/03/15',
    },
    {
      id: 'proj_002',
      name: '智能绘本生成',
      category: '绘本',
      tag: 'AI 绘本',
      createdAt: '2024/03/08',
      updatedAt: '2024/03/12',
    },
    {
      id: 'proj_003',
      name: '角色设计合集',
      category: '设计',
      tag: '角色设计',
      createdAt: '2024/03/05',
      updatedAt: '2024/03/10',
    },
    {
      id: 'proj_004',
      name: '故事板创作',
      category: '漫画',
      tag: 'AI 漫画',
      createdAt: '2024/03/01',
      updatedAt: '2024/03/08',
    },
  ]

  for (const p of mockProjects) {
    projects.set(p.id, p)
  }
}

seedMockUsers()
seedMockProjects()

export {
  users,
  tokens,
  projects,
  generateToken,
  generateId,
  storeToken,
  getEmailByToken,
  removeToken,
}
