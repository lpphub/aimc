import { Palette, Sparkles, Zap } from 'lucide-react'
import { LoginForm, LoginProvider, RegisterForm } from '@/features/auth'

export default function LoginPage() {
  return (
    <div className='min-h-screen flex bg-[#0a0a0a] relative overflow-hidden'>
      {/* Animated background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000' />
      </div>

      {/* Grid pattern overlay */}
      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Left side - Branding */}
      <div className='hidden lg:flex lg:w-1/2 relative items-center justify-center p-12'>
        <div className='max-w-lg'>
          {/* Logo */}
          <div className='mb-12'>
            <div className='relative inline-flex items-center justify-center w-24 h-24 mb-6'>
              <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/40 to-teal-500/40 rounded-3xl blur-2xl animate-pulse' />
              <div className='relative flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 backdrop-blur-xl'>
                <Sparkles className='w-12 h-12 text-cyan-400' />
              </div>
            </div>
            <h1 className='text-5xl font-bold mb-4'>
              <span className='bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-400 bg-clip-text text-transparent'>
                智绘工坊
              </span>
            </h1>
            <p className='text-xl text-gray-400'>AI 驱动的创意工作流平台</p>
          </div>

          {/* Features */}
          <div className='space-y-6'>
            {[
              {
                icon: Zap,
                title: '智能创作',
                desc: 'AI 辅助内容生成，提升创作效率',
              },
              {
                icon: Palette,
                title: '工作流编排',
                desc: '可视化流程设计，自动化生产',
              },
              {
                icon: Sparkles,
                title: '工具集成',
                desc: '丰富的 AI 工具箱，一站式体验',
              },
            ].map(item => (
              <div
                key={item.title}
                className='flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-800/50 backdrop-blur-sm'
              >
                <div className='flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex-shrink-0'>
                  <item.icon className='w-6 h-6 text-cyan-400' />
                </div>
                <div>
                  <h3 className='text-white font-medium mb-1'>{item.title}</h3>
                  <p className='text-gray-500 text-sm'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className='flex-1 flex items-center justify-center p-8 relative'>
        <div className='relative w-full max-w-md'>
          <LoginProvider>
            <LoginForm />
            <RegisterForm />
          </LoginProvider>
        </div>
      </div>
    </div>
  )
}
