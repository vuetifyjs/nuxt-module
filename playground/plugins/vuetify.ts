export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:configuration', (vuetifyOptions) => {
    // eslint-disable-next-line no-console
    console.log('vuetify:plugin:hook', vuetifyOptions)
  })
})
