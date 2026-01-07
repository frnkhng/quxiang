<template>
  <div class="qr-entry-page">
    <div class="container">
      <div class="card">
        <div class="header-with-lang">
          <h1>{{ t('qr.welcome') }}</h1>
          <LanguageSwitcher />
        </div>
        <p v-if="loading">{{ t('common.loading') }}</p>
        <p v-if="storeId">{{ t('qr.storeId') }}: {{ storeId }}</p>
        
        <div v-if="authStore.user">
          <p>{{ t('auth.alreadyLoggedIn') }}</p>
          <button @click="goToHome" class="btn btn-primary">{{ t('qr.enterSystem') }}</button>
        </div>
        
        <div v-else-if="!authStore.user">
          <p>{{ t('auth.pleaseLogin') }}</p>
          <button @click="goToOtp" class="btn btn-primary">{{ t('qr.customerLogin') }}</button>
          <button @click="goToStaffLogin" class="btn btn-secondary" style="margin-top: 10px;">{{ t('qr.staffLogin') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { detectDevice, saveReferralData } from '@/utils/device'
import { analytics } from '@/services/analytics'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const storeId = ref<string>()
const loading = ref(false)

onMounted(async () => {
  storeId.value = route.query.store as string
  loading.value = true
  
  // Detect device and save referral data
  const device = detectDevice()
  
  if (storeId.value) {
    saveReferralData(storeId.value, 'qr_scan')
    analytics.trackQRScan(storeId.value, device)
  }
  
  // Check if already in standalone mode (PWA installed)
  if (device.isStandalone) {
    // Already installed, check auth and route accordingly
    if (authStore.user) {
      goToHome()
    } else {
      loading.value = false
    }
    return
  }
  
  // If in-app browser or not installed, show install guide
  if (device.isInAppBrowser || !device.isStandalone) {
    router.push({
      path: '/install',
      query: {
        os: device.os,
        store: storeId.value
      }
    })
    return
  }
  
  // Default flow: check if logged in
  if (authStore.user) {
    goToHome()
  }
  loading.value = false
})

function goToHome() {
  const roleRoutes: Record<string, string> = {
    HQ: '/hq',
    STAFF: '/staff',
    CUSTOMER: '/customer/home',
  }
  router.push(roleRoutes[authStore.user?.role || 'CUSTOMER'])
}

function goToOtp() {
  router.push({
    path: '/otp',
    query: storeId.value ? { store: storeId.value } : undefined,
  })
}

function goToStaffLogin() {
  router.push('/login')
}
</script>

<style scoped>
.qr-entry-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  max-width: 400px;
  width: 100%;
  text-align: center;
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

p {
  margin-bottom: 20px;
  color: #666;
}

.btn {
  width: 100%;
  margin-bottom: 10px;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>
