import en from './locales/en'
import es from './locales/es'
import ar from './locales/ar'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    messages: {
      en,
      es,
      ar,
    },
  }
})
