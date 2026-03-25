import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useLogin } from '../hooks'
import { LoginStateEnum, useLoginStateContext } from './LoginProvider'

const loginSchema = z.object({
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
  password: z.string().min(1, '请输入密码').min(6, '密码至少6位'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { loginState, setLoginState } = useLoginStateContext()
  const loginMutation = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  if (loginState !== LoginStateEnum.LOGIN) return null

  const handleFinish = async (values: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync(values)
      navigate('/creations', { replace: true })
    } catch {
      toast.error('登录失败', {
        description: '请检查邮箱和密码是否正确',
      })
    }
  }

  const isLoading = loginMutation.isPending

  return (
    <>
      {/* Header */}
      <div className='mb-10 text-center'>
        <h1 className='text-4xl font-bold tracking-tight text-foreground mb-3'>欢迎回来</h1>
        <p className='text-muted-foreground text-sm tracking-wide'>登录以继续您的创作之旅</p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(handleFinish)} className='space-y-6'>
        {/* Email */}
        <div className='space-y-1.5'>
          <label className='block text-[10px] uppercase tracking-[0.15em] text-muted-foreground ml-1'>
            邮箱或用户名
          </label>
          <div className='relative'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-muted h-4 w-4' />
            <Input
              type='email'
              placeholder='name@domain.com'
              {...form.register('email')}
              className='h-12 pl-12 bg-background/80 border-none rounded-lg text-sm text-foreground placeholder:text-muted focus:ring-1 focus:ring-primary/50'
            />
          </div>
          {form.formState.errors.email && (
            <p className='text-destructive text-xs pl-1'>{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className='space-y-1.5'>
          <div className='flex justify-between items-center ml-1'>
            <label className='block text-[10px] uppercase tracking-[0.15em] text-muted-foreground'>
              密码
            </label>
            <a
              href='/forgot-password'
              className='text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 transition-colors'
            >
              忘记密码？
            </a>
          </div>
          <div className='relative'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-muted h-4 w-4' />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...form.register('password')}
              className='h-12 pl-12 pr-12 bg-background/80 border-none rounded-lg text-sm text-foreground placeholder:text-muted focus:ring-1 focus:ring-primary/50'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className='text-destructive text-xs pl-1'>
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type='submit'
          disabled={isLoading}
          className='w-full h-12 bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-widest text-sm transition-all duration-300 shadow-glow-primary hover:shadow-glow-primary-md active:scale-[0.98] uppercase rounded-xl disabled:opacity-50'
        >
          {isLoading ? (
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              登录中...
            </>
          ) : (
            <>
              <LogIn className='w-4 h-4 mr-2' />
              登录系统
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className='relative my-8 flex items-center'>
        <div className='grow border-t border-border/10' />
        <span className='mx-4 text-[10px] tracking-widest text-muted-foreground uppercase'>
          或者使用
        </span>
        <div className='grow border-t border-border/10' />
      </div>

      {/* Social Login */}
      <div className='grid grid-cols-2 gap-4'>
        <button
          type='button'
          className='flex items-center justify-center gap-3 bg-background/50 hover:bg-card border border-border/5 py-3 rounded-lg transition-all duration-200'
        >
          <MessageCircle className='w-5 h-5 text-green-500' />
          <span className='text-[12px] font-medium tracking-wide'>微信</span>
        </button>
        <button
          type='button'
          className='flex items-center justify-center gap-3 bg-background/50 hover:bg-card border border-border/5 py-3 rounded-lg transition-all duration-200'
        >
          <svg
            className='w-5 h-5'
            viewBox='0 0 24 24'
            fill='currentColor'
            role='img'
            aria-label='GitHub'
          >
            <title>GitHub</title>
            <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
          </svg>
          <span className='text-[12px] font-medium tracking-wide'>GitHub</span>
        </button>
      </div>

      {/* Footer */}
      <div className='mt-10 text-center'>
        <p className='text-[12px] text-muted-foreground tracking-wide'>
          还没有账号？
          <button
            type='button'
            onClick={() => setLoginState(LoginStateEnum.REGISTER)}
            className='text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 ml-1 cursor-pointer'
          >
            立即注册
          </button>
        </p>
      </div>
    </>
  )
}
