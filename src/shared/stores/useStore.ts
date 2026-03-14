import { create } from 'zustand'
import type { Project } from '@/features/project/types'

interface StoreState {
  projects: Project[]
  currentProject: Project | null
  activeTab: 'home' | 'ai-tools' | 'creation'
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (project: Project | null) => void
  setActiveTab: (tab: 'home' | 'ai-tools' | 'creation') => void
}

export const useStore = create<StoreState>((set) => ({
  projects: [],
  currentProject: null,
  activeTab: 'home',

  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  deleteProject: (id) => set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),

  setCurrentProject: (project) => set({ currentProject: project }),

  setActiveTab: (tab) => set({ activeTab: tab }),
}))
