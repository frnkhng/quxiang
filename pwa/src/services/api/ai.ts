import apiClient from './client'
import type { AIConversation, AIMessage } from '@/domain/types'

export interface ChatRequest {
  profileId: string
  message: string
  conversationId?: string
}

export interface ChatResponse {
  message: AIMessage
  conversationId: string
}

export const aiApi = {
  async chat(data: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post('/ai/chat', data)
    return response.data
  },

  async getConversations(profileId: string): Promise<AIConversation[]> {
    const response = await apiClient.get('/ai/conversations', {
      params: { profileId },
    })
    return response.data
  },

  async getConversation(id: string): Promise<AIConversation> {
    const response = await apiClient.get(`/ai/conversations/${id}`)
    return response.data
  },
}
