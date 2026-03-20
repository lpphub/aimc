import type { ReactNode } from 'react'

interface MainProps {
  children: ReactNode
}

export function Main({ children }: MainProps) {
  return <div className='flex-1 ml-52'>{children}</div>
}
