import { createVuetify } from 'vuetify'
import { isDev, vuetifyConfiguration } from 'virtual:vuetify-configuration'
import { useNuxtApp } from '#imports'

export async function configureVuetify() {
  const nuxtApp = useNuxtApp()
  const vuetifyOptions = vuetifyConfiguration()

  await nuxtApp.hooks.callHook('vuetify:configuration', { isDev, vuetifyOptions })

  await nuxtApp.hooks.callHook('vuetify:before-create', { isDev, vuetifyOptions })

  const vuetify = createVuetify(vuetifyOptions)

  // @ts-expect-error Vuetify using App<any> instead of App<Element>
  nuxtApp.vueApp.use(vuetify)

  nuxtApp.provide('vuetify', vuetify)

  await nuxtApp.hooks.callHook('vuetify:ready', vuetify)

  // eslint-disable-next-line n/prefer-global/process
  if (process.client) {
    // eslint-disable-next-line no-console
    isDev && console.log('Vuetify 3 initialized', vuetify)
  }
}
