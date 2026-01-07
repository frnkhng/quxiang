import { defineStore } from 'pinia'
import { ref } from 'vue'
import { aiApi } from '@/services/api/ai'
import type { AIConversation, AIMessage } from '@/domain/types'

export const useAIStore = defineStore('ai', () => {
  const conversations = ref<AIConversation[]>([])
  const currentConversation = ref<AIConversation | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function sendMessage(profileId: string, message: string, conversationId?: string) {
    try {
      loading.value = true
      error.value = null
      const response = await aiApi.chat({ profileId, message, conversationId })
      
      if (currentConversation.value?.id === response.conversationId) {
        currentConversation.value.messages.push(response.message)
      }
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to send message'
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchConversations(profileId: string) {
    try {
      loading.value = true
      error.value = null
      conversations.value = await aiApi.getConversations(profileId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch conversations'
    } finally {
      loading.value = false
    }
  }

  async function fetchConversation(id: string) {
    try {
      loading.value = true
      error.value = null
      currentConversation.value = await aiApi.getConversation(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch conversation'
    } finally {
      loading.value = false
    }
  }

  return {
    conversations,
    currentConversation,
    loading,
    error,
    sendMessage,
    fetchConversations,
    fetchConversation,
  }
})
