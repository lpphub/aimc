import type { User } from '@/features/auth/types'
import type { Material, TagGroup } from '@/features/materials/types'

const users: Map<string, { password: string; user: User }> = new Map()

const tokens: Map<string, string> = new Map()

const materials: Material[] = []

const tagGroups: TagGroup[] = [
  {
    id: 1,
    name: '默认',
    tags: [
      { id: 1, name: '风景' },
      { id: 2, name: '人物' },
    ],
  },
  {
    id: 2,
    name: '风格',
    tags: [
      { id: 3, name: '简约' },
      { id: 4, name: '复古' },
    ],
  },
]

let nextTagGroupId = 3
let nextTagId = 5

export function getNextTagGroupId(): number {
  return nextTagGroupId++
}

export function getNextTagId(): number {
  return nextTagId++
}

function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`
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

seedMockUsers()

export {
  users,
  tokens,
  materials,
  tagGroups,
  nextTagGroupId,
  nextTagId,
  generateToken,
  generateId,
  storeToken,
  getEmailByToken,
  removeToken,
}