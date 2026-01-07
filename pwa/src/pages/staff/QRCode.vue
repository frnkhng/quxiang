<template>
  <div class="qr-code">
    <div class="card">
      <div class="no-print">
        <h1>{{ t('staff.storeQrCode') }}</h1>
        <p>{{ t('staff.printQrDesc') }}</p>
        <button @click="openPrintWindow" class="btn btn-primary" style="margin-bottom: 20px;">
          {{ t('staff.openPrintPage') }}
        </button>
      </div>
      
      <div class="print-only">
        <h1 style="font-size: 32px; margin-bottom: 20px;">{{ t('customer.welcomeMessage') }}</h1>
        <p style="font-size: 18px; margin-bottom: 40px;">{{ t('customer.scanQrMessage') }}</p>
      </div>
      
      <div class="qr-display">
        <canvas ref="qrCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import QRCode from 'qrcode'

const { t } = useI18n()
const authStore = useAuthStore()
const qrCanvas = ref<HTMLCanvasElement | null>(null)

const qrUrl = computed(() => {
  const baseUrl = window.location.origin
  const storeId = authStore.user?.storeId || 'store-001'
  return `${baseUrl}/q?store=${storeId}`
})

onMounted(async () => {
  if (qrCanvas.value) {
    try {
      await QRCode.toCanvas(qrCanvas.value, qrUrl.value, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    } catch (err) {
      console.error('Failed to generate QR code:', err)
    }
  }
})

async function openPrintWindow() {
  try {
    // Generate QR code as data URL first
    const storeId = authStore.user?.storeId || 'store-001'
    const qrUrlValue = `${window.location.origin}/q?store=${storeId}`
    
    const qrDataUrl = await QRCode.toDataURL(qrUrlValue, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    // Open print window with the generated QR code image
    const printWindow = window.open('', '_blank', 'width=800,height=900')
    if (!printWindow) return
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${t('staff.storeQrCode')}</title>
        <style>
          body {
            margin: 0;
            padding: 40px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          h1 {
            font-size: 32px;
            margin-bottom: 20px;
            text-align: center;
            color: #333;
          }
          p {
            font-size: 18px;
            margin-bottom: 40px;
            text-align: center;
            color: #666;
          }
          img {
            border: 2px solid #e8e8e8;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <h1>${t('customer.welcomeMessage')}</h1>
        <p>${t('customer.scanQrMessage')}</p>
        <img src="${qrDataUrl}" alt="QR Code" />
        <script>
          window.onload = function() {
            setTimeout(() => window.print(), 500);
          };
        <\/script>
      </body>
      </html>
    `)
    printWindow.document.close()
  } catch (err) {
    console.error('Failed to generate QR code:', err)
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

canvas {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.print-only {
  display: none;
}

@media print {
  .no-print {
    display: none;
  }
  
  .print-only {
    display: block;
  }
}
</style>
