import type { User } from '@/features/auth/types'
import type { Material, TagGroup } from '@/features/materials/types'
import type { Work } from '@/features/portfolio/types'
import type { CreationRecord, Project, Template } from '@/features/project/types'

const users: Map<string, { password: string; user: User }> = new Map()

const tokens: Map<string, string> = new Map()

const projects: Map<string, Project> = new Map()

const templates: Map<string, Template> = new Map()

const records: Map<string, CreationRecord> = new Map()

const mockWorks: Work[] = [
  {
    id: '1',
    projectId: 'p1',
    projectName: '夏季新品推广',
    type: 'image',
    content: 'https://picsum.photos/512/512?random=1',
    prompt: '赛博朋克风格的街道',
    engine: 'gemini',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    projectId: 'p1',
    projectName: '夏季新品推广',
    type: 'video',
    content: 'https://example.com/video.mp4',
    prompt: '机器人在城市中行走',
    engine: 'veo',
    createdAt: '2024-03-14T14:30:00Z',
  },
  {
    id: '3',
    type: 'text',
    content: '在遥远的未来，人类与AI和谐共存...',
    prompt: '写一段科幻小说开头',
    createdAt: '2024-03-13T09:00:00Z',
  },
]

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
      id: 'p1',
      name: '夏季新品推广',
      description: '为小红书和抖音生成营销素材',
      tags: ['小红书', '短视频'],
      presetTemplateIds: ['t1', 't3'],
      createdAt: '2026-03-16',
      updatedAt: '2026-03-16',
    },
    {
      id: 'p2',
      name: '品牌宣传',
      description: '品牌形象宣传素材',
      tags: ['品牌', '宣传'],
      presetTemplateIds: ['t2'],
      createdAt: '2026-03-15',
      updatedAt: '2026-03-15',
    },
  ]

  for (const p of mockProjects) {
    projects.set(p.id, p)
  }
}

function seedMockTemplates(): void {
  const mockTemplates: Template[] = [
    { id: 't1', name: '文案模板A', type: 'copy', content: '模板内容A...' },
    { id: 't2', name: '文案模板B', type: 'copy', content: '模板内容B...' },
    { id: 't3', name: '图片模板A', type: 'image', content: '图片描述...' },
    { id: 't4', name: '视频模板A', type: 'video', content: '视频脚本...' },
  ]

  for (const t of mockTemplates) {
    templates.set(t.id, t)
  }
}

function seedMockRecords(): void {
  const mockRecords: CreationRecord[] = [
    {
      id: 'r1',
      projectId: 'p1',
      type: 'copy',
      title: '夏季新品文案',
      content: '炎炎夏日，新品上市...',
      createdAt: '2026-03-16',
    },
    {
      id: 'r2',
      projectId: 'p1',
      type: 'image',
      title: '产品主图',
      content: 'https://example.com/image.jpg',
      createdAt: '2026-03-16',
    },
  ]

  for (const r of mockRecords) {
    records.set(r.id, r)
  }
}

seedMockUsers()
seedMockProjects()
seedMockTemplates()
seedMockRecords()

export {
  users,
  tokens,
  projects,
  templates,
  records,
  mockWorks,
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
