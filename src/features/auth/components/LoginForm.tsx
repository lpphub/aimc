import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Lock, Mail, Rocket, Sparkles } from 'lucide-react'
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
      navigate('/', { replace: true })
    } catch {
      toast.error('登录失败', {
        description: '请检查邮箱和密码是否正确',
      })
    }
  }

  const isLoading = loginMutation.isPending

  return (
    <div className='w-full max-w-md mx-auto'>
      {/* Header */}
      <div className='text-center mb-8'>
        <div className='relative inline-flex items-center justify-center w-20 h-20 mb-6'>
          {/* Glow effect */}
          <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-teal-500/30 rounded-2xl blur-xl animate-pulse' />
          {/* Icon container */}
          <div className='relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 backdrop-blur-sm'>
            <Rocket className='w-10 h-10 text-cyan-400' />
          </div>
        </div>
        <h1 className='text-3xl font-bold text-white mb-2'>
          <span className='bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent'>
            智绘工坊
          </span>
        </h1>
        <p className='text-gray-500 text-sm'>开启你的 AI 创作之旅</p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(handleFinish)} className='space-y-5'>
        {/* Email Field */}
        <div className='space-y-2'>
          <div className='relative group'>
            <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity' />
            <div className='relative flex items-center'>
              <Mail className='absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors' />
              <Input
                type='email'
                placeholder='邮箱地址'
                {...form.register('email')}
                className='h-12 pl-12 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 backdrop-blur-sm'
              />
            </div>
          </div>
          {form.formState.errors.email && (
            <p className='text-destructive text-xs pl-1'>{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className='space-y-2'>
          <div className='relative group'>
            <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity' />
            <div className='relative flex items-center'>
              <Lock className='absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors' />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='密码'
                {...form.register('password')}
                className='h-12 pl-12 pr-12 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 backdrop-blur-sm'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 text-muted-foreground hover:text-foreground transition-colors'
              >
                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
          </div>
          {form.formState.errors.password && (
            <p className='text-destructive text-xs pl-1'>
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={isLoading}
          className='w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50'
        >
          {isLoading ? (
            <>
              <Loader2 className='w-5 h-5 mr-2 animate-spin' />
              登录中...
            </>
          ) : (
            <>
              <Sparkles className='w-5 h-5 mr-2' />
              登录
            </>
          )}
        </Button>

        {/* Register Link */}
        <div className='text-center pt-4'>
          <span className='text-muted-foreground text-sm'>还没有账号？</span>
          <button
            type='button'
            onClick={() => setLoginState(LoginStateEnum.REGISTER)}
            className='ml-2 text-primary hover:text-primary/90 text-sm font-medium transition-colors'
          >
            立即注册
          </button>
        </div>
      </form>

      {/* Decorative elements */}
      <div className='absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none' />
    </div>
  )
}
