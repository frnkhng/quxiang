<template>
  <div class="customer-records">
    <h1>我的记录</h1>
    
    <div v-if="recordsStore.loading" class="loading">加载中...</div>
    
    <div v-else-if="recordsStore.records.length === 0" class="empty">
      暂无服务记录
    </div>
    
    <div v-else class="records-list">
      <div v-for="record in recordsStore.records" :key="record.id" class="record-card card">
        <h3>{{ record.title }}</h3>
        <p>{{ record.content }}</p>
        <div v-if="record.images && record.images.length > 0" class="images">
          <img
            v-for="(img, idx) in record.images"
            :key="idx"
            :src="img"
            :alt="`图片 ${idx + 1}`"
          />
        </div>
        <p class="meta">
          {{ record.type === 'detection' ? '检测' : '服务' }} · 
          {{ formatDate(record.createdAt) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRecordsStore } from '@/stores/records'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const recordsStore = useRecordsStore()

onMounted(() => {
  if (authStore.user?.profileId) {
    recordsStore.fetchRecords({ profileId: authStore.user.profileId })
  }
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.customer-records {
  padding: 20px 0;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.record-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.record-card p {
  margin-bottom: 10px;
  color: #666;
  line-height: 1.6;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin: 15px 0;
}

.images img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.record-card .meta {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}
</style>
