import apiClient from './client'
import type { Profile } from '@/domain/types'

export interface CreateProfileRequest {
  name: string
  phone: string
  gender?: 'male' | 'female' | 'other'
  birthDate?: string
  storeId: string
}

export interface UpdateProfileRequest extends Partial<CreateProfileRequest> {
  id: string
}

export const profilesApi = {
  async list(params?: { storeId?: string; search?: string }): Promise<Profile[]> {
    const response = await apiClient.get('/profiles', { params })
    return response.data
  },

  async get(id: string): Promise<Profile> {
    const response = await apiClient.get(`/profiles/${id}`)
    return response.data
  },

  async create(data: CreateProfileRequest): Promise<Profile> {
    const response = await apiClient.post('/profiles', data)
    return response.data
  },

  async update(data: UpdateProfileRequest): Promise<Profile> {
    const { id, ...updateData } = data
    const response = await apiClient.put(`/profiles/${id}`, updateData)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/profiles/${id}`)
  },
}
