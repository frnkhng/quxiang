<template>
  <div class="profile-detail">
    <button @click="$router.back()" class="btn btn-secondary" style="margin-bottom: 20px;">
      返回
    </button>
    
    <div v-if="profileStore.loading" class="loading">加载中...</div>
    
    <div v-else-if="profileStore.currentProfile" class="card">
      <h1>{{ profileStore.currentProfile.name }}</h1>
      <div class="info-grid">
        <div class="info-item">
          <strong>手机号:</strong> {{ profileStore.currentProfile.phone }}
        </div>
        <div class="info-item">
          <strong>性别:</strong> {{ profileStore.currentProfile.gender || '未设置' }}
        </div>
        <div class="info-item">
          <strong>出生日期:</strong> {{ profileStore.currentProfile.birthDate || '未设置' }}
        </div>
        <div class="info-item">
          <strong>创建时间:</strong> {{ formatDate(profileStore.currentProfile.createdAt) }}
        </div>
      </div>
      
      <div class="actions">
        <button @click="goToNewRecord" class="btn btn-primary">新建服务记录</button>
      </div>
      
      <h2 style="margin-top: 40px;">服务记录</h2>
      <div v-if="recordsStore.loading" class="loading">加载中...</div>
      <div v-else-if="recordsStore.records.length === 0" class="empty">暂无服务记录</div>
      <div v-else class="records-list">
        <div v-for="record in recordsStore.records" :key="record.id" class="record-card card">
          <h3>{{ record.title }}</h3>
          <p>{{ record.content }}</p>
          <p class="meta">{{ record.type === 'detection' ? '检测' : '服务' }} · {{ formatDate(record.createdAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import { useRecordsStore } from '@/stores/records'

const route = useRoute()
const router = useRouter()
const profileStore = useProfileStore()
const recordsStore = useRecordsStore()

onMounted(async () => {
  const profileId = route.params.id as string
  await profileStore.fetchProfile(profileId)
  await recordsStore.fetchRecords({ profileId })
})

function goToNewRecord() {
  router.push({
    path: '/staff/records/new',
    query: { profileId: route.params.id },
  })
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.profile-detail {
  padding: 20px 0;
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.info-item {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 10px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.record-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.record-card p {
  margin-bottom: 5px;
  color: #666;
}

.record-card .meta {
  font-size: 12px;
  color: #999;
}

.empty {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}
</style>
