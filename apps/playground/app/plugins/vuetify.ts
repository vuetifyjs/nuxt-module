export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('vuetify:before-create', ({ isDev, vuetifyOptions }) => {
    if (import.meta.client && isDev) {
      console.log('vuetify:plugin:hook', vuetifyOptions)
    }
  })
  nuxtApp.hook('vuetify:ready', () => {
    console.log('vuetify:ready')
  })
  nuxtApp.hook('vuetify:ssr-client-hints', ({ ssrClientHints }) => {
    console.log('vuetify:ssr-client-hints', ssrClientHints)
  })
})
