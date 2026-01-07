<template>
  <div class="profiles-list">
    <div class="header">
      <h1>客户档案</h1>
      <button @click="showCreateModal = true" class="btn btn-primary">新建档案</button>
    </div>
    
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        class="form-input"
        placeholder="搜索客户姓名或手机号"
        @input="handleSearch"
      />
    </div>
    
    <div v-if="profileStore.loading" class="loading">加载中...</div>
    
    <div v-else-if="profileStore.profiles.length === 0" class="empty">
      暂无客户档案
    </div>
    
    <div v-else class="profiles-grid">
      <div
        v-for="profile in profileStore.profiles"
        :key="profile.id"
        class="profile-card card"
        @click="goToProfile(profile.id)"
      >
        <h3>{{ profile.name }}</h3>
        <p>手机号: {{ profile.phone }}</p>
        <p>性别: {{ profile.gender || '未设置' }}</p>
        <p>创建时间: {{ formatDate(profile.createdAt) }}</p>
      </div>
    </div>
    
    <div v-if="showCreateModal" class="modal" @click.self="showCreateModal = false">
      <div class="modal-content card">
        <h2>新建客户档案</h2>
        <form @submit.prevent="handleCreate">
          <div class="form-group">
            <label class="form-label">姓名</label>
            <input v-model="newProfile.name" type="text" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">手机号</label>
            <input v-model="newProfile.phone" type="tel" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">性别</label>
            <select v-model="newProfile.gender" class="form-input">
              <option value="">请选择</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">出生日期</label>
            <input v-model="newProfile.birthDate" type="date" class="form-input" />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">
              取消
            </button>
            <button type="submit" class="btn btn-primary" :disabled="profileStore.loading">
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const profileStore = useProfileStore()
const authStore = useAuthStore()
const searchQuery = ref('')
const showCreateModal = ref(false)
const newProfile = ref({
  name: '',
  phone: '',
  gender: '',
  birthDate: '',
  storeId: '',
})

onMounted(() => {
  loadProfiles()
})

async function loadProfiles() {
  await profileStore.fetchProfiles({
    storeId: authStore.user?.storeId,
  })
}

function handleSearch() {
  profileStore.fetchProfiles({
    storeId: authStore.user?.storeId,
    search: searchQuery.value,
  })
}

async function handleCreate() {
  newProfile.value.storeId = authStore.user?.storeId || ''
  const profile = await profileStore.createProfile(newProfile.value)
  if (profile) {
    showCreateModal.value = false
    newProfile.value = { name: '', phone: '', gender: '', birthDate: '', storeId: '' }
    router.push(`/staff/profile/${profile.id}`)
  }
}

function goToProfile(id: string) {
  router.push(`/staff/profile/${id}`)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.profiles-list {
  padding: 20px 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.search-box {
  margin-bottom: 30px;
}

.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.profile-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.profile-card p {
  margin-bottom: 5px;
  color: #666;
  font-size: 14px;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions button {
  flex: 1;
}
</style>
