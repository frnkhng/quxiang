import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/services/api/auth'
import type { User } from '@/domain/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function checkAuth() {
    try {
      loading.value = true
      error.value = null
      user.value = await authApi.me()
      return true
    } catch (err) {
      user.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  async function login(username: string, password: string) {
    try {
      loading.value = true
      error.value = null
      user.value = await authApi.login({ username, password })
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function requestOTP(phone: string, storeId?: string) {
    try {
      loading.value = true
      error.value = null
      await authApi.requestOTP({ phone, storeId })
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to send OTP'
      return false
    } finally {
      loading.value = false
    }
  }

  async function verifyOTP(phone: string, code: string, storeId?: string) {
    try {
      loading.value = true
      error.value = null
      user.value = await authApi.verifyOTP({ phone, code, storeId })
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Invalid OTP'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      user.value = null
    }
  }

  return {
    user,
    loading,
    error,
    checkAuth,
    login,
    requestOTP,
    verifyOTP,
    logout,
  }
})
