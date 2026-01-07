<template>
  <div class="records-list">
    <div class="header">
      <h1>服务记录</h1>
      <button @click="$router.push('/staff/records/new')" class="btn btn-primary">
        新建记录
      </button>
    </div>
    
    <div v-if="recordsStore.loading" class="loading">加载中...</div>
    
    <div v-else-if="recordsStore.records.length === 0" class="empty">
      暂无服务记录
    </div>
    
    <div v-else class="records-grid">
      <div v-for="record in recordsStore.records" :key="record.id" class="record-card card">
        <h3>{{ record.title }}</h3>
        <p>{{ record.content }}</p>
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

const recordsStore = useRecordsStore()
const authStore = useAuthStore()

onMounted(() => {
  recordsStore.fetchRecords({
    storeId: authStore.user?.storeId,
  })
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.records-list {
  padding: 20px 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
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
  margin-top: 10px;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}
</style>
