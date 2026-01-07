<template>
  <div class="qr-code">
    <div class="card">
      <h1>门店二维码</h1>
      <p>客户扫描此二维码可进入系统</p>
      
      <div class="qr-display">
        <div class="qr-placeholder">
          <p>二维码占位</p>
          <p style="font-size: 12px; margin-top: 10px;">
            实际部署时需要集成二维码生成库
          </p>
        </div>
      </div>
      
      <div class="url-box">
        <input
          :value="qrUrl"
          type="text"
          class="form-input"
          readonly
        />
        <button @click="copyUrl" class="btn btn-primary">复制链接</button>
      </div>
      
      <p v-if="copied" style="color: #52c41a; text-align: center; margin-top: 10px;">
        已复制到剪贴板
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const copied = ref(false)

const qrUrl = computed(() => {
  const baseUrl = window.location.origin
  const storeId = authStore.user?.storeId || 'STORE_ID'
  return `${baseUrl}/q?store=${storeId}`
})

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(qrUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.qr-code {
  padding: 20px 0;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 10px;
  color: #333;
  text-align: center;
}

.qr-display {
  margin: 40px 0;
  display: flex;
  justify-content: center;
}

.qr-placeholder {
  width: 300px;
  height: 300px;
  border: 2px dashed #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #fafafa;
}

.url-box {
  display: flex;
  gap: 10px;
}

.url-box input {
  flex: 1;
}
</style>
