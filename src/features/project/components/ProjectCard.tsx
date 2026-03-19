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
      className='group relative overflow-hidden bg-card border-border backdrop-blur-sm hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/10'
      onClick={onClick}
    >
      <div className='p-6'>
        <div className='mb-4 flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30'>
          <BookOpen className='h-8 w-8 text-purple-400' />
        </div>

        <h3 className='mb-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors'>
          {project.name}
        </h3>

        {project.description && (
          <p className='mb-3 text-sm text-muted-foreground line-clamp-2'>{project.description}</p>
        )}

        <div className='mb-4 flex flex-wrap gap-2'>
          {project.tags?.map(tag => (
            <Badge key={tag} className='bg-primary/20 text-primary border-primary/30'>
              #{tag}
            </Badge>
          ))}
        </div>

        <div className='mt-6 flex items-center text-sm text-muted-foreground'>
          <Calendar className='h-4 w-4 mr-1' />
          <span>{project.updatedAt}</span>
        </div>
      </div>

      <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
    </Card>
  )
}
