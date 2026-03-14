import type { AuthResp, LoginReq, RegisterReq, User } from '@/features/auth/types'
import api from '@/lib/api'

export const authApi = {
  login: (data: LoginReq) => api.post<AuthResp>('auth/login', data),
  register: (data: RegisterReq) => api.post<AuthResp>('auth/register', data),
  logout: () => api.post<void>('auth/logout'),
  me: () => api.get<User>('auth/me'),
}