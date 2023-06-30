import { createVuetify } from 'vuetify'
import { vuetifyConfiguration } from 'virtual:vuetify-configuration'
import { defineNuxtPlugin } from '#app'

const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify(vuetifyConfiguration())
  nuxtApp.vueApp.use(vuetify)

  if (!process.server && isDev) {
    // eslint-disable-next-line no-console
    console.log('Vuetify 3 initialized', vuetify)
  }

  return {
    provide: {
      vuetify,
    },
  }
})
