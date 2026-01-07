import apiClient from './client'
import type { Record } from '@/domain/types'

export interface CreateRecordRequest {
  profileId: string
  type: 'detection' | 'service'
  title: string
  content: string
  images?: string[]
}

export interface UpdateRecordRequest extends Partial<CreateRecordRequest> {
  id: string
}

export const recordsApi = {
  async list(params?: { profileId?: string; storeId?: string }): Promise<Record[]> {
    const response = await apiClient.get('/records', { params })
    return response.data
  },

  async get(id: string): Promise<Record> {
    const response = await apiClient.get(`/records/${id}`)
    return response.data
  },

  async create(data: CreateRecordRequest): Promise<Record> {
    const response = await apiClient.post('/records', data)
    return response.data
  },

  async update(data: UpdateRecordRequest): Promise<Record> {
    const { id, ...updateData } = data
    const response = await apiClient.put(`/records/${id}`, updateData)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/records/${id}`)
  },
}
