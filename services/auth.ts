import { apiFetch } from '@/lib/api'
import { clearSession } from '@/lib/session'

// Request types

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

// Response types

export interface AuthUser {
  id: string
  username: string
  role: 'admin' | 'user'
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface RegisterResponse {
  message: string
}

// API calls

export function login(data: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', { method: 'POST', body: data })
}

export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>('/auth/register', { method: 'POST', body: data })
}

export interface SwitchRoleResponse {
  token: string
  user: AuthUser
}

export function switchRole(): Promise<SwitchRoleResponse> {
  return apiFetch<SwitchRoleResponse>('/auth/role', { method: 'PATCH' })
}

export async function logout(): Promise<void> {
  clearSession()
}
