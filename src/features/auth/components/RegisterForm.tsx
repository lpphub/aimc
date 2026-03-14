import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Mail, Lock, User, Sparkles, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
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
      navigate('/', { replace: true })
    } catch (error) {
      console.error('注册失败:', error)
    }
  }

  const isLoading = registerMutation.isPending

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl blur-xl animate-pulse" />
          {/* Icon container */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 backdrop-blur-sm">
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            创建账号
          </span>
        </h1>
        <p className="text-gray-500 text-sm">加入智绘工坊，释放创意潜能</p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(handleFinish)} className="space-y-4">
        {/* Username Field */}
        <div className="space-y-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center">
              <User className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <Input
                type="text"
                placeholder="用户名"
                {...form.register('username')}
                className="h-12 pl-12 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-purple-500/20 backdrop-blur-sm"
              />
            </div>
          </div>
          {form.formState.errors.username && (
            <p className="text-red-400 text-xs pl-1">{form.formState.errors.username.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <Input
                type="email"
                placeholder="邮箱地址"
                {...form.register('email')}
                className="h-12 pl-12 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-purple-500/20 backdrop-blur-sm"
              />
            </div>
          </div>
          {form.formState.errors.email && (
            <p className="text-red-400 text-xs pl-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="密码"
                {...form.register('password')}
                className="h-12 pl-12 pr-12 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-purple-500/20 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {form.formState.errors.password && (
            <p className="text-red-400 text-xs pl-1">{form.formState.errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="确认密码"
                {...form.register('confirmPassword')}
                className="h-12 pl-12 pr-12 bg-gray-900/50 border-gray-700/50 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-purple-500/20 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-red-400 text-xs pl-1">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              注册中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              注册
            </>
          )}
        </Button>

        {/* Login Link */}
        <div className="text-center pt-4">
          <span className="text-gray-500 text-sm">已有账号？</span>
          <button
            type="button"
            onClick={backToLogin}
            className="ml-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
          >
            返回登录
          </button>
        </div>
      </form>

      {/* Back button */}
      <button
        type="button"
        onClick={backToLogin}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">返回</span>
      </button>

      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}