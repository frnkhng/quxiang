<template>
  <div class="install-page">
    <div class="container">
      <div class="card">
        <div class="header-with-lang">
          <h1>{{ t('install.title') }}</h1>
          <LanguageSwitcher />
        </div>

        <!-- In-App Browser Warning -->
        <div v-if="device.isInAppBrowser" class="warning-card">
          <div class="warning-icon">⚠️</div>
          <h2>{{ t('install.inAppBrowser.title') }}</h2>
          <p>{{ t(`install.inAppBrowser.${device.inAppName || 'other'}`) }}</p>
          <div class="steps">
            <div class="step">
              <span class="step-number">1</span>
              <p>{{ t('install.inAppBrowser.step1') }}</p>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <p>{{ t(`install.inAppBrowser.step2_${device.os}`) }}</p>
            </div>
          </div>
        </div>

        <!-- Android Installation -->
        <div v-else-if="device.os === 'android'" class="install-guide">
          <div class="icon-large">📱</div>
          <h2>{{ t('install.android.title') }}</h2>
          <p>{{ t('install.android.description') }}</p>

          <!-- Show install button if prompt is available -->
          <button 
            v-if="showInstallButton" 
            @click="handleInstall"
            class="btn btn-primary btn-large"
          >
            {{ t('install.android.installButton') }}
          </button>

          <!-- Manual steps if no prompt -->
          <div v-else class="steps">
            <div class="step">
              <span class="step-number">1</span>
              <p>{{ t('install.android.step1') }}</p>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <p>{{ t('install.android.step2') }}</p>
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <p>{{ t('install.android.step3') }}</p>
            </div>
          </div>

          <div v-if="installStatus === 'installing'" class="status-message">
            {{ t('install.android.installing') }}
          </div>
          <div v-if="installStatus === 'success'" class="status-message success">
            {{ t('install.android.success') }}
          </div>
        </div>

        <!-- iOS Installation -->
        <div v-else-if="device.os === 'ios'" class="install-guide">
          <div class="icon-large">📱</div>
          <h2>{{ t('install.ios.title') }}</h2>
          <p v-if="device.browser !== 'safari'" class="warning-text">
            {{ t('install.ios.safariOnly') }}
          </p>
          <p v-else>{{ t('install.ios.description') }}</p>

          <div class="steps">
            <div class="step">
              <span class="step-number">1</span>
              <div class="step-content">
                <p>{{ t('install.ios.step1') }}</p>
                <div class="icon-demo">⬆️</div>
              </div>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <div class="step-content">
                <p>{{ t('install.ios.step2') }}</p>
                <div class="icon-demo">➕</div>
              </div>
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <div class="step-content">
                <p>{{ t('install.ios.step3') }}</p>
              </div>
            </div>
          </div>

          <button @click="handleIOSComplete" class="btn btn-secondary">
            {{ t('install.ios.completeButton') }}
          </button>
        </div>

        <!-- Desktop -->
        <div v-else class="install-guide">
          <div class="icon-large">💻</div>
          <h2>{{ t('install.desktop.title') }}</h2>
          <p>{{ t('install.desktop.description') }}</p>
          
          <button 
            v-if="showInstallButton" 
            @click="handleInstall"
            class="btn btn-primary btn-large"
          >
            {{ t('install.desktop.installButton') }}
          </button>

          <div v-else class="steps">
            <div class="step">
              <span class="step-number">1</span>
              <p>{{ t('install.desktop.step1') }}</p>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <p>{{ t('install.desktop.step2') }}</p>
            </div>
          </div>
        </div>

        <!-- Skip button -->
        <button @click="skipInstall" class="btn btn-text">
          {{ t('install.skip') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { detectDevice, type DeviceInfo } from '@/utils/device'
import { analytics } from '@/services/analytics'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const device = ref<DeviceInfo>(detectDevice())
const showInstallButton = ref(false)
const installStatus = ref<'idle' | 'installing' | 'success'>('idle')
const installStartTime = ref<number>(0)

let deferredPrompt: any = null

onMounted(() => {
  // Track page view
  analytics.trackInstallPageView(device.value.os, device.value.browser)

  // Check if already in standalone mode
  if (device.value.isStandalone) {
    router.push('/app')
    return
  }

  // Listen for beforeinstallprompt (Android/Desktop Chrome)
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})

function handleBeforeInstallPrompt(e: Event) {
  e.preventDefault()
  deferredPrompt = e
  showInstallButton.value = true
  analytics.trackInstallPromptShown(device.value.os)
}

async function handleInstall() {
  if (!deferredPrompt) return

  installStatus.value = 'installing'
  installStartTime.value = Date.now()

  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice

  if (outcome === 'accepted') {
    analytics.trackInstallAccepted(device.value.os)
    installStatus.value = 'success'
  } else {
    installStatus.value = 'idle'
  }

  deferredPrompt = null
}

function handleAppInstalled() {
  const duration = Date.now() - installStartTime.value
  analytics.trackInstallCompleted(device.value.os, duration)
  
  installStatus.value = 'success'
  
  // Redirect to app after short delay
  setTimeout(() => {
    window.location.href = '/app'
  }, 1500)
}

function handleIOSComplete() {
  // User claims they completed installation
  // Redirect to app (will check standalone mode there)
  router.push('/app')
}

function skipInstall() {
  // Go directly to login/app
  const storeId = route.query.store as string
  if (storeId) {
    router.push({ path: '/otp', query: { store: storeId } })
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.install-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 500px;
  width: 100%;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.header-with-lang {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-with-lang h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.warning-card {
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.warning-card h2 {
  color: #856404;
  margin: 0 0 12px 0;
  font-size: 20px;
}

.warning-card p {
  color: #856404;
  margin-bottom: 20px;
}

.warning-text {
  color: #dc3545;
  font-weight: 500;
  margin-bottom: 16px;
}

.install-guide {
  text-align: center;
}

.icon-large {
  font-size: 64px;
  margin-bottom: 16px;
}

.install-guide h2 {
  color: #333;
  margin: 0 0 12px 0;
  font-size: 22px;
}

.install-guide > p {
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.steps {
  margin: 24px 0;
  text-align: left;
}

.step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  flex-shrink: 0;
  margin-right: 12px;
}

.step-content {
  flex: 1;
}

.step p {
  margin: 0;
  color: #333;
  line-height: 1.5;
}

.icon-demo {
  font-size: 32px;
  margin-top: 8px;
}

.btn-large {
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 600;
  margin: 20px 0;
}

.btn-text {
  background: none;
  color: #666;
  text-decoration: underline;
  margin-top: 16px;
}

.btn-text:hover {
  background: none;
  color: #333;
}

.status-message {
  margin-top: 16px;
  padding: 12px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 8px;
  font-weight: 500;
}

.status-message.success {
  background: #d4edda;
  color: #155724;
}
</style>
