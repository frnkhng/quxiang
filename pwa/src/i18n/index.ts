import { createI18n } from 'vue-i18n'
import ja from './locales/ja'
import zh from './locales/zh'

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.startsWith('zh') ? 'zh' : 'ja',
  fallbackLocale: 'ja',
  messages: {
    ja,
    zh
  }
})

export default i18n
