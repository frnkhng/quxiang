<template>
  <div class="otp-page">
    <div class="container">
      <div class="card">
        <div class="header-with-lang">
          <h1>{{ t('qr.customerLogin') }}</h1>
          <LanguageSwitcher />
        </div>
        
        <form v-if="!otpSent" @submit.prevent="handleRequestOTP">
          <div class="form-group">
            <label class="form-label">{{ t('auth.phone') }}</label>
            <input
              v-model="phone"
              type="tel"
              class="form-input"
              :placeholder="t('auth.enterPhone')"
              required
            />
          </div>
          
          <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>
          
          <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
            {{ authStore.loading ? t('common.loading') : t('auth.requestOtp') }}
          </button>
        </form>
        
        <form v-else @submit.prevent="handleVerifyOTP">
          <div class="form-group">
            <label class="form-label">{{ t('auth.otp') }}</label>
            <input
              v-model="code"
              type="text"
              class="form-input"
              :placeholder="t('auth.enterOtp')"
              maxlength="4"
              required
            />
          </div>
          
          <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>
          
          <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
            {{ authStore.loading ? t('common.loading') : t('auth.verifyOtp') }}
          </button>
          
          <button
            type="button"
            class="btn btn-secondary"
            style="margin-top: 10px;"
            @click="otpSent = false"
          >
            {{ t('auth.requestOtp') }}
          </button>
        </form>
        
        <p style="margin-top: 20px; text-align: center;">
          <a href="/q">{{ t('common.back') }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const phone = ref('')
const code = ref('')
const otpSent = ref(false)
const storeId = ref<string>()

onMounted(() => {
  storeId.value = route.query.store as string
})

async function handleRequestOTP() {
  const success = await authStore.requestOTP(phone.value, storeId.value)
  if (success) {
    otpSent.value = true
  }
}

async function handleVerifyOTP() {
  const success = await authStore.verifyOTP(phone.value, code.value, storeId.value)
  if (success) {
    router.push('/customer/home')
  }
}
</script>

<style scoped>
.otp-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  max-width: 400px;
  width: 100%;
}

h1 {
  margin-bottom: 30px;
  text-align: center;
  color: #333;
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

.btn-secondary:hover {
  background: #5a6268;
}

.header-with-lang {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-with-lang h1 {
  margin: 0;
}
</style>
