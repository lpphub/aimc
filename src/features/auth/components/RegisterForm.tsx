import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, Shield, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import type { ApiError } from '@/lib/api'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useRegister } from '../hooks'
import { LoginStateEnum, useLoginStateContext } from './LoginProvider'

const registerSchema = z
  .object({
    username: z.string().min(1, '请输入用户名').min(2, '用户名至少2位'),
    email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
    password: z.string().min(1, '请输入密码').min(6, '密码至少6位'),
    confirmPassword: z.string().min(1, '请确认密码'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次密码不一致',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { loginState, backToLogin } = useLoginStateContext()
  const registerMutation = useRegister()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  if (loginState !== LoginStateEnum.REGISTER) return null

  const handleFinish = async (values: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync(values)
      navigate('/tools', { replace: true })
    } catch (error) {
      const { message } = error as ApiError
      toast.error('注册失败', { description: message })
    }
  }

  const isLoading = registerMutation.isPending

  return (
    <>
      {/* Back Button */}
      <button
        type='button'
        onClick={backToLogin}
        className='absolute -top-2 -left-2 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
      >
        <ArrowLeft className='w-4 h-4' />
        <span className='text-xs'>返回</span>
      </button>

      {/* Header */}
      <div className='mb-10 text-center'>
        <h1 className='text-4xl font-bold tracking-tight text-foreground mb-3'>开启创作之旅</h1>
        <p className='text-muted-foreground text-sm tracking-wide'>加入 AIMC，释放您的 AI 创造力</p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(handleFinish)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Username */}
          <div className='space-y-2'>
            <label className='block text-[10px] uppercase tracking-widest text-muted-foreground ml-1'>
              用户名
            </label>
            <div className='relative group'>
              <User className='absolute left-4 top-1/2 -translate-y-1/2 text-muted h-4 w-4 group-focus-within:text-primary transition-colors' />
              <Input
                type='text'
                placeholder='您的用户名'
                {...form.register('username')}
                className='h-11 pl-12 bg-background border-none focus:ring-1 focus:ring-primary/50 rounded-sm text-sm text-foreground placeholder:text-muted transition-all'
              />
            </div>
            {form.formState.errors.username && (
              <p className='text-destructive text-xs pl-1'>
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className='space-y-2'>
            <label className='block text-[10px] uppercase tracking-widest text-muted-foreground ml-1'>
              邮箱
            </label>
            <div className='relative group'>
              <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-muted h-4 w-4 group-focus-within:text-primary transition-colors' />
              <Input
                type='email'
                placeholder='example@domain.com'
                {...form.register('email')}
                className='h-11 pl-12 bg-background border-none focus:ring-1 focus:ring-primary/50 rounded-sm text-sm text-foreground placeholder:text-muted transition-all'
              />
            </div>
            {form.formState.errors.email && (
              <p className='text-destructive text-xs pl-1'>{form.formState.errors.email.message}</p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Password */}
          <div className='space-y-2'>
            <label className='block text-[10px] uppercase tracking-widest text-muted-foreground ml-1'>
              密码
            </label>
            <div className='relative group'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-muted h-4 w-4 group-focus-within:text-primary transition-colors' />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                {...form.register('password')}
                className='h-11 pl-12 pr-12 bg-background border-none focus:ring-1 focus:ring-primary/50 rounded-sm text-sm text-foreground placeholder:text-muted transition-all'
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

          {/* Confirm Password */}
          <div className='space-y-2'>
            <label className='block text-[10px] uppercase tracking-widest text-muted-foreground ml-1'>
              确认密码
            </label>
            <div className='relative group'>
              <Shield className='absolute left-4 top-1/2 -translate-y-1/2 text-muted h-4 w-4 group-focus-within:text-primary transition-colors' />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='••••••••'
                {...form.register('confirmPassword')}
                className='h-11 pl-12 pr-12 bg-background border-none focus:ring-1 focus:ring-primary/50 rounded-sm text-sm text-foreground placeholder:text-muted transition-all'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
              >
                {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className='text-destructive text-xs pl-1'>
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className='flex items-start gap-3 py-2'>
          <div className='flex items-center h-5'>
            <input
              id='terms'
              type='checkbox'
              className='w-4 h-4 rounded-sm border-none bg-card text-primary focus:ring-primary focus:ring-offset-background'
            />
          </div>
          <label
            htmlFor='terms'
            className='text-xs text-muted-foreground leading-tight cursor-pointer'
          >
            我同意{' '}
            <a href='/terms' className='text-primary hover:underline transition-all'>
              服务条款
            </a>{' '}
            和{' '}
            <a href='/privacy' className='text-primary hover:underline transition-all'>
              隐私政策
            </a>
          </label>
        </div>

        {/* Submit */}
        <Button
          type='submit'
          disabled={isLoading}
          className='w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl active:scale-95 transition-all duration-200 shadow-glow-primary hover:shadow-glow-primary-md tracking-tight disabled:opacity-50'
        >
          {isLoading ? (
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              注册中...
            </>
          ) : (
            '注册'
          )}
        </Button>

        {/* Login Link */}
        <div className='text-center'>
          <p className='text-xs text-muted-foreground'>
            已有账号？
            <button
              type='button'
              onClick={backToLogin}
              className='text-primary font-medium hover:text-primary/80 transition-colors ml-1 cursor-pointer'
            >
              返回登录
            </button>
          </p>
        </div>
      </form>

      {/* System Status Decoration */}
      <div className='absolute bottom-4 right-8 opacity-20 pointer-events-none'>
        <span className='text-[8px] tracking-[0.2em] text-foreground uppercase'>
          {'System Status: Ready // AIGC_AUTH_v2.0'}
        </span>
      </div>
    </>
  )
}
