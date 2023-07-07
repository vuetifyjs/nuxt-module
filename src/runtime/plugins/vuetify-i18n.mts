import { createAdapter } from './i18n'
import { defineNuxtPlugin } from '#app'
import { ref } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  const isRtl = ref(false)
  nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
    const { adapter, rtl } = createAdapter(nuxtApp)
    isRtl.valuea = rtl
    vuetifyOptions.locale = vuetifyOptions.locale ?? {}
    vuetifyOptions.locale.adapter = adapter
  })
  nuxtApp.hook('vuetify:created', (vuetify) => {
    vuetify.locale.isRtl.value = isRtl.value
  })
})
