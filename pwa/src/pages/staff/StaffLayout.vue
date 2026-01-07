<template>
  <div class="staff-layout">
    <nav class="navbar">
      <div class="container">
        <h2>{{ t('staff.title') }}</h2>
        <div class="nav-links">
          <router-link to="/staff/profiles">{{ t('staff.profiles') }}</router-link>
          <router-link to="/staff/records">{{ t('staff.records') }}</router-link>
          <router-link to="/staff/tools/qr">{{ t('staff.qrCode') }}</router-link>
          <LanguageSwitcher />
          <button @click="handleLogout" class="btn btn-secondary">{{ t('common.logout') }}</button>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push('/q')
}
</script>

<style scoped>
.staff-layout {
  min-height: 100vh;
}

.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: #f0f0f0;
}

.main-content {
  padding: 40px 0;
}
</style>
