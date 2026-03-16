import { BookOpen, Calendar } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card
      className='group relative overflow-hidden bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10'
      onClick={onClick}
    >
      <div className='p-6'>
        <div className='mb-4 flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30'>
          <BookOpen className='h-8 w-8 text-purple-400' />
        </div>

        <h3 className='mb-2 text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors'>
          {project.name}
        </h3>

        {project.description && (
          <p className='mb-3 text-sm text-gray-400 line-clamp-2'>{project.description}</p>
        )}

        <div className='mb-4 flex flex-wrap gap-2'>
          {project.tags?.map(tag => (
            <Badge key={tag} className='bg-cyan-500/20 text-cyan-400 border-cyan-500/30'>
              #{tag}
            </Badge>
          ))}
        </div>

        <div className='mt-6 flex items-center text-sm text-gray-500'>
          <Calendar className='h-4 w-4 mr-1' />
          <span>{project.updatedAt}</span>
        </div>
      </div>

      <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
    </Card>
  )
}
