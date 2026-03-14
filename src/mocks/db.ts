import type { User } from '@/features/auth/types'

// 模拟数据库
const users: Map<string, { password: string; user: User }> = new Map()

// token 存储 (token -> email 映射)
const tokens: Map<string, string> = new Map()

// 生成简单的 token
function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

// 存储 token 与用户关联
function storeToken(token: string, email: string): void {
  tokens.set(token, email)
}

// 根据 token 获取用户邮箱
function getEmailByToken(token: string): string | undefined {
  return tokens.get(token)
}

// 移除 token (登出时使用)
function removeToken(token: string): boolean {
  return tokens.delete(token)
}

// 初始化测试账户
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

// 自动初始化
seedMockUsers()

export {
  users,
  tokens,
  generateToken,
  storeToken,
  getEmailByToken,
  removeToken,
}