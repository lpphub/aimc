import {
  ArrowRight,
  Brain,
  FileScan,
  FileUp,
  Globe,
  Image,
  Menu,
  MessageSquare,
  Send,
  Share,
  Share2,
  TrendingUp,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'

const navLinks = [
  { id: 'features', label: '功能特性', href: '#features' },
  { id: 'workflow', label: '操作流程', href: '#workflow' },
  { id: 'about', label: '关于我们', href: '#about' },
]

const steps = [
  {
    number: '01',
    icon: FileUp,
    title: '上传素材',
    description: '拖入原始产品图、参考灵感或基础文案，让系统感知您的品牌基因。',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI 创作',
    description: 'Lumina 引擎深度解析，并行生成数十组不同风格的创意方案供您选择。',
  },
  {
    number: '03',
    icon: Share,
    title: '一键分发',
    description: '根据多平台规格自动裁剪适配，直接推送至您的店铺管理后台或社交媒体。',
  },
]

const footerLinks = {
  product: {
    title: '产品功能',
    links: ['文案引擎', '海报合成', '视觉感知', 'API 集成'],
  },
  support: {
    title: '帮助与支持',
    links: ['隐私政策', '服务条款', '开发者文档', '联系支持'],
  },
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('features')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <div className='relative min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary'>
      {/* Top Navigation */}
      <nav className='fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl transition-colors border-b border-border/5'>
        <div className='flex justify-between items-center px-6 md:px-10 py-4 md:py-6 max-w-screen-2xl mx-auto'>
          <div className='text-xl md:text-2xl font-bold tracking-tighter text-primary'>AIMC</div>

          <div className='hidden md:flex items-center space-x-10'>
            {navLinks.map(link => (
              <a
                key={link.id}
                className={cn(
                  'text-sm tracking-tight transition-colors',
                  activeLink === link.id
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground hover:text-primary'
                )}
                href={link.href}
                onClick={() => setActiveLink(link.id)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className='hidden md:flex items-center space-x-6'>
            {isAuthenticated ? (
              <Button className='rounded-full' onClick={() => navigate('/tools')}>
                进入控制台
              </Button>
            ) : (
              <Button className='rounded-full' onClick={() => navigate('/login')}>
                登录
              </Button>
            )}
          </div>

          <button
            className='md:hidden text-muted-foreground hover:text-primary transition-colors'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type='button'
          >
            {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className='md:hidden bg-card/95 backdrop-blur-xl border-t border-border/10'>
            <div className='px-6 py-4 space-y-4'>
              {navLinks.map(link => (
                <a
                  key={link.id}
                  className={cn(
                    'block py-2 text-sm transition-colors',
                    activeLink === link.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  )}
                  href={link.href}
                  onClick={() => {
                    setActiveLink(link.id)
                    setMobileMenuOpen(false)
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div className='pt-4 border-t border-border/10 space-y-3'>
                {isAuthenticated ? (
                  <Button
                    className='w-full rounded-full'
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/tools')
                    }}
                  >
                    进入控制台
                  </Button>
                ) : (
                  <Button
                    className='w-full rounded-full'
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/login')
                    }}
                  >
                    登录
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className='relative'>
        {/* Hero Section */}
        <section className='relative min-h-screen flex items-center justify-center pt-20 overflow-hidden'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.08)_0%,transparent_60%)]' />

          <div className='relative z-10 max-w-7xl mx-auto px-10 text-center'>
            <span className='block text-primary text-xs font-medium tracking-[0.4em] uppercase mb-10 opacity-80'>
              The Synthetic Architect
            </span>

            <h1 className='text-5xl md:text-8xl font-bold tracking-tight leading-none mb-12 text-foreground'>
              <span className='text-transparent bg-clip-text bg-linear-to-b from-primary to-secondary'>
                AI 创意创作平台
              </span>
            </h1>

            <p className='text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed font-light tracking-wide'>
              融合视觉感知与生成式 AI，让创意触手可及。
            </p>

            <div className='flex justify-center'>
              <Button
                size='lg'
                className='text-lg px-12 py-6 rounded-full shadow-glow-primary-lg hover:shadow-glow-primary-lg-hover transition-all group'
                onClick={() => navigate(isAuthenticated ? '/tools' : '/login')}
              >
                {isAuthenticated ? '进入控制台' : '立即开启'}
                <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='py-32 px-6 md:px-10 bg-background'>
          <div className='max-w-screen-2xl mx-auto'>
            <div className='mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8'>
              <div>
                <h2 className='text-4xl md:text-5xl font-bold tracking-tight mb-4'>
                  智元生产力矩阵
                </h2>
                <p className='text-muted-foreground text-lg'>
                  从感知到合成，重定义每一个像素的商业价值。
                </p>
              </div>
              <div className='hidden md:block h-px grow bg-linear-to-r from-border/30 to-transparent ml-12' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
              {/* Feature 1: Marketing */}
              <div className='md:col-span-8 bg-card/60 backdrop-blur-xl border border-border/10 p-10 rounded-xl flex flex-col justify-between group hover:border-primary/20 transition-all duration-500 relative'>
                <TrendingUp className='w-8 h-8 text-primary/50 absolute top-8 right-8 opacity-5 group-hover:opacity-20 transition-opacity' />
                <div>
                  <span className='inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-8'>
                    AI ENGINE
                  </span>
                  <h3 className='text-2xl md:text-3xl font-bold mb-6'>营销文案生成</h3>
                  <p className='text-muted-foreground leading-relaxed max-w-lg mb-8'>
                    融合神经语言模型与顶级营销策略，针对不同电商平台自动优化语调、痛点与钩子。
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <span className='text-primary font-bold'>高转化率电商文案引擎</span>
                  <TrendingUp className='w-5 h-5 text-primary' />
                </div>
              </div>

              {/* Feature 2: OCR */}
              <div className='md:col-span-4 bg-surface-container-high p-10 rounded-xl border border-border/10 flex flex-col justify-between hover:bg-card transition-colors'>
                <div>
                  <FileScan className='w-12 h-12 text-secondary mb-8' />
                  <h3 className='text-2xl font-bold mb-4'>视觉字符感知 (OCR)</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    精准提取复杂素材中的视觉文本，支持多种语言与艺术字体识别。
                  </p>
                </div>
                <div className='mt-8 pt-8 border-t border-border/10'>
                  <span className='text-secondary text-sm font-bold tracking-widest uppercase'>
                    Precision: 99.8%
                  </span>
                </div>
              </div>

              {/* Feature 3: Poster */}
              <div className='md:col-span-5 bg-surface-container-high p-10 rounded-xl border border-border/10 relative overflow-hidden group'>
                <div className='relative z-10 h-full flex flex-col justify-end'>
                  <Image className='w-10 h-10 text-primary/50 mb-6' />
                  <h3 className='text-2xl font-bold mb-4'>高阶海报合成</h3>
                  <p className='text-muted-foreground'>
                    极具冲击力的品牌视觉，秒级生成商用级大片。
                  </p>
                </div>
              </div>

              {/* Feature 4: Finetune */}
              <div className='md:col-span-7 bg-card/60 backdrop-blur-xl p-10 rounded-xl border border-border/10 flex flex-col justify-center'>
                <div className='flex items-start gap-8'>
                  <div className='bg-primary/10 p-6 rounded-full shrink-0'>
                    <MessageSquare className='w-8 h-8 text-primary' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold mb-4'>对话式微调</h3>
                    <p className='text-muted-foreground leading-relaxed mb-6'>
                      像与资深设计师沟通一样，通过自然语言指令反复调优生成结果，直到完美契合品牌调性。
                    </p>
                    <div className='bg-background p-4 rounded-lg flex items-center gap-4 text-sm font-mono border border-border/20'>
                      <span className='text-primary'>&gt;</span>
                      <span className='text-muted-foreground'>
                        "让背景色更深一点，增加一些霓虹质感"
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id='workflow' className='py-32 px-6 md:px-10 relative'>
          <div className='max-w-screen-2xl mx-auto'>
            <div className='text-center mb-24'>
              <h2 className='text-4xl md:text-5xl font-bold tracking-tight mb-4'>
                极简操作，重塑效能
              </h2>
              <p className='text-muted-foreground'>从灵感到分发，仅需三个关键环节。</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.number} className='relative group'>
                    <div className='absolute -top-12 -left-4 text-7xl font-black text-foreground/5 pointer-events-none'>
                      {step.number}
                    </div>

                    <div className='relative z-10 bg-surface-container-high p-10 rounded-xl border border-border/10 group-hover:border-primary/20 transition-all'>
                      <div
                        className={cn(
                          'w-16 h-16 rounded-full flex items-center justify-center mb-8',
                          index === 0 &&
                            'bg-primary text-primary-foreground shadow-glow-primary-sm',
                          index === 1 &&
                            'bg-secondary-container text-secondary shadow-glow-secondary',
                          index === 2 && 'bg-secondary text-secondary-foreground'
                        )}
                      >
                        <Icon className='w-7 h-7' />
                      </div>

                      <h4 className='text-xl font-bold mb-4 text-foreground'>{step.title}</h4>
                      <p className='text-muted-foreground'>{step.description}</p>
                    </div>

                    {index < steps.length - 1 && (
                      <div className='hidden md:block absolute top-1/2 -right-6 -translate-y-1/2 text-primary/20'>
                        <svg
                          className='w-8 h-8'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 8l4 4m0 0l-4 4m4-4H3'
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-40 px-6 md:px-10 relative overflow-hidden'>
          <div className='absolute inset-0 bg-background' />
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-primary/5 rounded-full blur-[120px]' />

          <div className='relative z-10 max-w-4xl mx-auto text-center'>
            <h2 className='text-4xl md:text-6xl font-bold mb-10 tracking-tight leading-tight'>
              释放您的
              <br />
              AI 创作潜能
            </h2>

            <p className='text-muted-foreground text-xl mb-16 max-w-2xl mx-auto'>
              加入创作者社区，用 AI 赋能每一个创意灵感。让想象不再受限。
            </p>

            <div className='flex flex-col md:flex-row items-center justify-center gap-6'>
              <Button
                size='lg'
                className='w-full md:w-auto text-lg px-12 py-6 rounded-full shadow-glow-primary-lg hover:shadow-glow-primary-lg-hover transition-all'
                onClick={() => navigate(isAuthenticated ? '/tools' : '/login')}
              >
                {isAuthenticated ? '进入控制台' : '立即开始免费试用'}
              </Button>
              <Button
                variant='outline'
                size='lg'
                className='w-full md:w-auto text-lg px-12 py-6 rounded-full'
              >
                联系销售顾问
              </Button>
            </div>

            <p className='mt-8 text-muted-foreground/60 text-sm'>无需信用卡。14天全功能试用。</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='bg-background w-full border-t border-border/10'>
        <div className='w-full px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 max-w-screen-2xl mx-auto'>
          <div className='md:col-span-1'>
            <span className='text-xl font-bold text-primary mb-4 block'>AIMC</span>
            <p className='text-muted-foreground text-sm leading-relaxed max-w-xs'>
              新一代 AI 创意创作平台，让每一个灵感都能被看见。The Synthetic Architect.
            </p>
          </div>

          <div className='md:col-span-1'>
            <h5 className='text-foreground font-bold mb-6'>{footerLinks.product.title}</h5>
            <ul className='space-y-4'>
              {footerLinks.product.links.map(link => (
                <li key={link}>
                  <button
                    type='button'
                    className='text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-300 block text-left'
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className='md:col-span-1'>
            <h5 className='text-foreground font-bold mb-6'>{footerLinks.support.title}</h5>
            <ul className='space-y-4'>
              {footerLinks.support.links.map(link => (
                <li key={link}>
                  <button
                    type='button'
                    className='text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-300 block text-left'
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className='md:col-span-1'>
            <h5 className='text-foreground font-bold mb-6'>订阅通讯</h5>
            <p className='text-muted-foreground text-sm mb-6'>获取最新的 AI 设计趋势与产品更新。</p>
            <div className='flex gap-2'>
              <input
                className='bg-background border border-border/20 rounded px-4 py-2 w-full text-sm focus:border-primary outline-none transition-colors'
                placeholder='您的邮箱'
                type='email'
              />
              <button
                className='bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90 transition-colors'
                type='button'
              >
                <Send className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>

        <div className='max-w-screen-2xl mx-auto px-6 md:px-10 py-8 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-4'>
          <span className='text-sm tracking-wide text-muted-foreground'>
            © 2024 AIMC. The Synthetic Architect. 保留所有权利。
          </span>
          <div className='flex gap-6'>
            <button
              type='button'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              <Globe className='w-5 h-5' />
            </button>
            <button
              type='button'
              className='text-muted-foreground hover:text-primary transition-colors'
            >
              <Share2 className='w-5 h-5' />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
