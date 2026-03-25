import { LoginForm, LoginProvider, RegisterForm } from '@/features/auth'

export default function LoginPage() {
  return (
    <div className='relative min-h-screen flex flex-col bg-background font-sans selection:bg-primary/20 selection:text-primary'>
      {/* Top Navigation */}
      <nav className='fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-transparent backdrop-blur-xl border-b border-white/5 shadow-glow-primary-sm'>
        <div className='text-2xl font-bold tracking-tighter text-primary uppercase'>AIMC</div>
        <div />
      </nav>

      {/* Main Content */}
      <main className='relative flex-1 flex items-center justify-center overflow-hidden pt-20 pb-12 px-6'>
        {/* Grid pattern overlay */}
        <div
          className='absolute inset-0 opacity-5'
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(132,148,149,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(132,148,149,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Blur orbs */}
        <div className='absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full' />
        <div className='absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary-container/5 blur-[120px] rounded-full' />

        {/* Card Container */}
        <div className='relative w-full max-w-md'>
          <div className='bg-card/40 backdrop-blur-2xl p-10 rounded-2xl border border-border/15 shadow-glow-elevation overflow-hidden'>
            {/* Top Accent Gradient */}
            <div className='absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary/40 via-secondary-container/40 to-transparent' />

            <div className='relative z-10'>
              <LoginProvider>
                <LoginForm />
                <RegisterForm />
              </LoginProvider>
            </div>
          </div>

          {/* Decorative Corner Borders */}
          <div className='absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-primary/20 rounded-tr-3xl pointer-events-none' />
          <div className='absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-secondary-container/20 rounded-bl-3xl pointer-events-none' />
        </div>
      </main>

      {/* Footer */}
      <footer className='w-full py-12 border-t border-white/5 bg-background'>
        <div className='flex flex-col md:flex-row justify-between items-center px-12 w-full gap-8'>
          <div className='text-primary font-bold tracking-widest text-sm uppercase'>AIMC</div>
          <div className='flex gap-8'>
            <a
              className='text-muted-foreground hover:text-primary transition-colors text-[10px] tracking-widest uppercase'
              href='/privacy'
            >
              Privacy Policy
            </a>
            <a
              className='text-muted-foreground hover:text-primary transition-colors text-[10px] tracking-widest uppercase'
              href='/terms'
            >
              Terms of Service
            </a>
            <a
              className='text-muted-foreground hover:text-primary transition-colors text-[10px] tracking-widest uppercase'
              href='/security'
            >
              Security
            </a>
          </div>
          <div className='text-[10px] tracking-widest uppercase text-muted-foreground'>
            © 2026 AIMC. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  )
}
