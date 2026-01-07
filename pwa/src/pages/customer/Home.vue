<template>
  <div class="customer-home">
    <div class="card welcome-card">
      <h2>欢迎回来</h2>
      <p v-if="profileStore.currentProfile">{{ profileStore.currentProfile.name }}</p>
    </div>
    
    <div class="section">
      <h3>最近记录</h3>
      <div v-if="recordsStore.loading" class="loading">加载中...</div>
      <div v-else-if="recordsStore.records.length === 0" class="empty">暂无记录</div>
      <div v-else class="records-list">
        <div
          v-for="record in recordsStore.records.slice(0, 3)"
          :key="record.id"
          class="record-card card"
        >
          <h4>{{ record.title }}</h4>
          <p>{{ record.content }}</p>
          <p class="meta">{{ formatDate(record.createdAt) }}</p>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h3>快捷操作</h3>
      <div class="actions-grid">
        <button @click="$router.push('/customer/records')" class="action-btn card">
          <span>查看所有记录</span>
        </button>
        <button @click="$router.push('/customer/ai')" class="action-btn card">
          <span>咨询AI顾问</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useRecordsStore } from '@/stores/records'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const recordsStore = useRecordsStore()

onMounted(async () => {
  if (authStore.user?.profileId) {
    await profileStore.fetchProfile(authStore.user.profileId)
    await recordsStore.fetchRecords({ profileId: authStore.user.profileId })
  }
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.customer-home {
  padding: 20px 0;
}

.welcome-card {
  text-align: center;
  margin-bottom: 30px;
}

.welcome-card h2 {
  margin-bottom: 10px;
  color: #333;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  margin-bottom: 15px;
  color: #333;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.record-card h4 {
  margin-bottom: 8px;
  color: #333;
}

.record-card p {
  margin-bottom: 5px;
  color: #666;
  font-size: 14px;
}

.record-card .meta {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.action-btn {
  padding: 30px 20px;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn span {
  font-size: 16px;
  color: #333;
}

.empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}
</style>
