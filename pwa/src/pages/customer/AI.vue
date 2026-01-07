<template>
  <div class="customer-ai">
    <h1>AI健康顾问</h1>
    
    <div class="chat-container card">
      <div class="messages" ref="messagesContainer">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['message', msg.role === 'user' ? 'user-message' : 'assistant-message']"
        >
          <div class="message-content">{{ msg.content }}</div>
          <div class="message-time">{{ formatTime(msg.createdAt) }}</div>
        </div>
        <div v-if="aiStore.loading" class="message assistant-message">
          <div class="message-content">正在思考...</div>
        </div>
      </div>
      
      <form @submit.prevent="handleSend" class="input-form">
        <input
          v-model="inputMessage"
          type="text"
          class="form-input"
          placeholder="输入您的问题..."
          :disabled="aiStore.loading"
        />
        <button type="submit" class="btn btn-primary" :disabled="aiStore.loading || !inputMessage">
          发送
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAIStore } from '@/stores/ai'
import { useAuthStore } from '@/stores/auth'
import type { AIMessage } from '@/domain/types'

const authStore = useAuthStore()
const aiStore = useAIStore()
const inputMessage = ref('')
const messages = ref<AIMessage[]>([])
const messagesContainer = ref<HTMLElement>()

onMounted(async () => {
  if (authStore.user?.profileId && aiStore.currentConversation) {
    messages.value = aiStore.currentConversation.messages
  }
})

async function handleSend() {
  if (!inputMessage.value.trim() || !authStore.user?.profileId) return
  
  const userMessage: AIMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: inputMessage.value,
    createdAt: new Date().toISOString(),
  }
  
  messages.value.push(userMessage)
  const messageText = inputMessage.value
  inputMessage.value = ''
  
  await nextTick()
  scrollToBottom()
  
  const response = await aiStore.sendMessage(
    authStore.user.profileId,
    messageText,
    aiStore.currentConversation?.id
  )
  
  if (response) {
    messages.value.push(response.message)
    await nextTick()
    scrollToBottom()
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.customer-ai {
  padding: 20px 0;
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.user-message {
  align-self: flex-end;
  align-items: flex-end;
}

.assistant-message {
  align-self: flex-start;
  align-items: flex-start;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
}

.user-message .message-content {
  background: #1890ff;
  color: white;
}

.assistant-message .message-content {
  background: #f0f0f0;
  color: #333;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.input-form {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
}

.input-form .form-input {
  flex: 1;
}

.input-form .btn {
  width: auto;
  padding: 10px 24px;
}
</style>
