import { createVuetify } from 'vuetify'
import { isDev, vuetifyConfiguration } from 'virtual:vuetify-configuration'
import { defineNuxtPlugin, useNuxtApp } from '#app'

export default defineNuxtPlugin({
  name: 'vuetify:configuration:plugin',
  enforce: 'post',
  parallel: false,
  async setup() {
    const nuxtApp = useNuxtApp()
    const vuetifyOptions = vuetifyConfiguration()

    await nuxtApp.hooks.callHook('vuetify:configuration', { isDev, vuetifyOptions })

    const vuetify = createVuetify(vuetifyOptions)

    nuxtApp.vueApp.use(vuetify)

    if (process.client && isDev) {
      // eslint-disable-next-line no-console
      console.log('Vuetify 3 initialized', vuetify)
    }

    return {
      provide: {
        vuetify,
      },
    }
  },
})
