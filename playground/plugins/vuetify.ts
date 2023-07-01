export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:configuration', (isDev, vuetifyOptions) => {
    if (process.client && isDev) {
      // eslint-disable-next-line no-console
      console.log('vuetify:plugin:hook', vuetifyOptions)
    }
  })
})
