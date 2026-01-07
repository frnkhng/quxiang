import apiClient from './client'
import type { User } from '@/domain/types'

export interface LoginRequest {
  username: string
  password: string
}

export interface OTPRequest {
  phone: string
  storeId?: string
}

export interface OTPVerifyRequest {
  phone: string
  code: string
  storeId?: string
}

export const authApi = {
  async login(data: LoginRequest): Promise<User> {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  async requestOTP(data: OTPRequest): Promise<{ success: boolean }> {
    const response = await apiClient.post('/auth/otp/request', data)
    return response.data
  },

  async verifyOTP(data: OTPVerifyRequest): Promise<User> {
    const response = await apiClient.post('/auth/otp/verify', data)
    return response.data
  },

  async me(): Promise<User> {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}
