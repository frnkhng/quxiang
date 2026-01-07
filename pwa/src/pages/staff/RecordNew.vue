<template>
  <div class="record-new">
    <button @click="$router.back()" class="btn btn-secondary" style="margin-bottom: 20px;">
      返回
    </button>
    
    <div class="card">
      <h1>新建服务记录</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">客户档案ID</label>
          <input v-model="form.profileId" type="text" class="form-input" required />
        </div>
        
        <div class="form-group">
          <label class="form-label">类型</label>
          <select v-model="form.type" class="form-input" required>
            <option value="detection">检测</option>
            <option value="service">服务</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">标题</label>
          <input v-model="form.title" type="text" class="form-input" required />
        </div>
        
        <div class="form-group">
          <label class="form-label">内容</label>
          <textarea v-model="form.content" class="form-input" rows="6" required></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label">图片</label>
          <input type="file" @change="handleFileChange" accept="image/*" multiple />
        </div>
        
        <p v-if="recordsStore.error" class="error-message">{{ recordsStore.error }}</p>
        
        <button type="submit" class="btn btn-primary" :disabled="recordsStore.loading">
          {{ recordsStore.loading ? '创建中...' : '创建记录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecordsStore } from '@/stores/records'
import { uploadsApi } from '@/services/api/uploads'

const route = useRoute()
const router = useRouter()
const recordsStore = useRecordsStore()

const form = ref({
  profileId: '',
  type: 'service' as 'detection' | 'service',
  title: '',
  content: '',
  images: [] as string[],
})

const files = ref<File[]>([])

onMounted(() => {
  const profileId = route.query.profileId as string
  if (profileId) {
    form.value.profileId = profileId
  }
})

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    files.value = Array.from(target.files)
  }
}

async function handleSubmit() {
  if (files.value.length > 0) {
    const uploadPromises = files.value.map((file) => uploadsApi.uploadFile(file))
    form.value.images = await Promise.all(uploadPromises)
  }
  
  const record = await recordsStore.createRecord(form.value)
  if (record) {
    router.push(`/staff/profile/${form.value.profileId}`)
  }
}
</script>

<style scoped>
.record-new {
  padding: 20px 0;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

textarea {
  resize: vertical;
}

.btn {
  width: 100%;
}
</style>
