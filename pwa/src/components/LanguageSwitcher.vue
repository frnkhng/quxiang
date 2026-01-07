<template>
  <div class="language-switcher">
    <button 
      @click="switchLanguage('ja')" 
      :class="{ active: locale === 'ja' }"
      class="lang-btn"
    >
      日本語
    </button>
    <button 
      @click="switchLanguage('zh')" 
      :class="{ active: locale === 'zh' }"
      class="lang-btn"
    >
      中文
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const switchLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('language', lang)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.lang-btn:hover {
  background: #f5f5f5;
}

.lang-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}
</style>
