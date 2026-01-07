<template>
  <div class="customer-layout">
    <nav class="navbar">
      <div class="container">
        <h2>{{ t('customer.title') }}</h2>
        <div class="nav-right">
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
    
    <nav class="bottom-nav">
      <router-link to="/customer/home" class="nav-item">
        <span>{{ t('customer.home') }}</span>
      </router-link>
      <router-link to="/customer/records" class="nav-item">
        <span>{{ t('customer.records') }}</span>
      </router-link>
      <router-link to="/customer/ai" class="nav-item">
        <span>{{ t('customer.ai') }}</span>
      </router-link>
      <router-link to="/customer/settings" class="nav-item">
        <span>{{ t('customer.settings') }}</span>
      </router-link>
    </nav>
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
.customer-layout {
  min-height: 100vh;
  padding-bottom: 60px;
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

.nav-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.main-content {
  padding: 20px 0;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  text-decoration: none;
  padding: 5px 15px;
  font-size: 14px;
}

.nav-item.router-link-active {
  color: #1890ff;
}
</style>
