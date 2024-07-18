export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:before-create', ({ isDev, vuetifyOptions }) => {
    if (import.meta.client && isDev) {
      // eslint-disable-next-line no-console
      console.log('vuetify:plugin:hook', vuetifyOptions)
    }
  })
  nuxtApp.hook('vuetify:ready', () => {
    // eslint-disable-next-line no-console
    console.log('vuetify:ready')
  })
  nuxtApp.hook('vuetify:ssr-client-hints', ({ ssrClientHints }) => {
    // eslint-disable-next-line no-console
    console.log('vuetify:ssr-client-hints', ssrClientHints)
  })
})
