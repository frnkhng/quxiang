<template>
  <div class="login-page">
    <div class="container">
      <div class="card">
        <div class="header-with-lang">
          <h1>{{ t('qr.staffLogin') }}</h1>
          <LanguageSwitcher />
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label">{{ t('auth.username') }}</label>
            <input
              v-model="username"
              type="text"
              class="form-input"
              :placeholder="t('auth.enterUsername')"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">{{ t('auth.password') }}</label>
            <input
              v-model="password"
              type="password"
              class="form-input"
              :placeholder="t('auth.enterPassword')"
              required
            />
          </div>
          
          <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>
          
          <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
            {{ authStore.loading ? t('common.loading') : t('auth.login') }}
          </button>
        </form>
        
        <p style="margin-top: 20px;">
          <a href="/q">{{ t('common.back') }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')

async function handleLogin() {
  const success = await authStore.login(username.value, password.value)
  if (success) {
    const roleRoutes: Record<string, string> = {
      HQ: '/hq',
      STAFF: '/staff',
      CUSTOMER: '/customer/home',
    }
    router.push(roleRoutes[authStore.user?.role || 'STAFF'])
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  max-width: 450px;
  width: 100%;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
  color: #333;
  white-space: nowrap;
}

.btn {
  width: 100%;
}

a {
  color: #1890ff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.header-with-lang {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.header-with-lang h1 {
  margin: 0;
  flex: 1;
  min-width: 0;
}
</style>
