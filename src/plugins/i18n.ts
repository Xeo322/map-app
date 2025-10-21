import { createI18n } from 'vue-i18n'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'

const getDefaultLocale = (): string => {
  if (typeof window === 'undefined') return 'en'

  return localStorage.getItem('locale') ||
    (navigator.language.startsWith('ru') ? 'ru' : 'en')
}

export default createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: { ru, en }
})
