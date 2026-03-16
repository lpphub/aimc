import { BookOpen, ChevronRight, Grid3x3, Users } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'

export default function ProjectDetailPage() {
  const handleOpenCharacters = () => console.log('Open character library')
  const handleEnterPipeline = () => console.log('Enter pipeline')
  const handleCreateChapter = () => {
    console.log('Create new chapter')
  }

  return (
    <div className='flex min-h-screen flex-col relative overflow-hidden bg-[#0a0a0a]'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000' />
      </div>

      <div className='relative z-10 flex-1 p-8'>
        <div className='mb-6'>
          <div className='flex items-start justify-between mb-6'>
            <div className='flex items-start gap-6'>
              <div className='flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 shadow-lg shadow-purple-500/10'>
                <BookOpen className='h-10 w-10 text-purple-400' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white mb-3 tracking-tight'>test</h1>
                <div className='flex items-center gap-4'>
                  <Badge className='bg-purple-500/20 text-purple-400 border-purple-500/30 backdrop-blur-sm'>
                    漫画
                  </Badge>
                  <span className='text-sm text-gray-500'>更新: 2026/3/12</span>
                </div>
              </div>
            </div>

            <div className='flex gap-3'>
              <Button
                variant='outline'
                onClick={handleOpenCharacters}
                className='bg-gray-900/50 border-gray-700/30 text-white hover:bg-gray-800/50 hover:border-gray-600/50 backdrop-blur-sm transition-all duration-300'
              >
                <Users className='mr-2 h-4 w-4' />
                角色库
              </Button>
              <Button
                onClick={handleEnterPipeline}
                className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40'
              >
                进入流水线
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        <div className='flex gap-6 h-[calc(100vh-350px)]'>
          <div className='w-80 flex-shrink-0'>
            <Card className='h-full bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm'>
              <div className='p-4 border-b border-gray-700/30'>
                <h2 className='text-lg font-semibold text-white'>章节目录</h2>
              </div>
              <div className='flex-1 flex items-center justify-center p-8'>
                <div className='text-center'>
                  <div className='flex justify-center mb-4'>
                    <div className='w-12 h-12 rounded-full bg-gray-800/50 border border-gray-700/30 flex items-center justify-center'>
                      <BookOpen className='w-6 h-6 text-gray-600' />
                    </div>
                  </div>
                  <p className='text-gray-500 text-lg mb-2'>暂无章节</p>
                  <Button
                    onClick={handleCreateChapter}
                    variant='outline'
                    className='mt-4 bg-transparent border-gray-700/30 text-gray-400 hover:text-white hover:border-gray-600/50 hover:bg-gray-800/30 backdrop-blur-sm transition-all duration-300'
                  >
                    <ChevronRight className='mr-2 h-4 w-4' />
                    创建新章节
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <Separator orientation='vertical' className='h-auto bg-gray-700/20' />

          <div className='flex-1'>
            <Card className='h-full bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm'>
              <div className='p-4 border-b border-gray-700/30'>
                <h2 className='text-lg font-semibold text-white'>分镜工作台</h2>
              </div>
              <div className='flex-1 flex items-center justify-center p-8'>
                <div className='text-center'>
                  <div className='flex justify-center mb-4'>
                    <div className='relative'>
                      <div className='absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse' />
                      <div className='relative w-24 h-24 rounded-2xl bg-gray-800/50 border border-gray-700/30 flex items-center justify-center'>
                        <Grid3x3 className='w-12 h-12 text-gray-600' />
                      </div>
                    </div>
                  </div>
                  <p className='text-gray-500 text-lg mb-2'>该章节暂无分镜</p>
                  <p className='text-gray-600 text-sm mb-4'>前往创建新的分镜内容</p>
                  <Button
                    onClick={handleCreateChapter}
                    className='bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40'
                  >
                    前往创建
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
