export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:configuration', (vuetifyOptions) => {
    console.log('vuetify:plugin:hook', vuetifyOptions)
  })
})
