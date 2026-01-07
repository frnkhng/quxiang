<template>
  <div class="customer-settings">
    <h1>设置</h1>
    
    <div class="card">
      <div class="setting-item">
        <strong>姓名</strong>
        <span>{{ profileStore.currentProfile?.name || '-' }}</span>
      </div>
      <div class="setting-item">
        <strong>手机号</strong>
        <span>{{ profileStore.currentProfile?.phone || '-' }}</span>
      </div>
      <div class="setting-item">
        <strong>性别</strong>
        <span>{{ profileStore.currentProfile?.gender || '未设置' }}</span>
      </div>
      <div class="setting-item">
        <strong>出生日期</strong>
        <span>{{ profileStore.currentProfile?.birthDate || '未设置' }}</span>
      </div>
    </div>
    
    <button @click="handleLogout" class="btn btn-secondary" style="margin-top: 20px; width: 100%;">
      退出登录
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useProfileStore()

onMounted(async () => {
  if (authStore.user?.profileId) {
    await profileStore.fetchProfile(authStore.user.profileId)
  }
})

async function handleLogout() {
  await authStore.logout()
  router.push('/q')
}
</script>

<style scoped>
.customer-settings {
  padding: 20px 0;
}

h1 {
  margin-bottom: 30px;
  color: #333;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item strong {
  color: #333;
}

.setting-item span {
  color: #666;
}
</style>
