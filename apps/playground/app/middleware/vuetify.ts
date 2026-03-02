export default defineNuxtRouteMiddleware(to => {
  if (import.meta.client) {
    console.log('middleware', to.path, useNuxtApp().$vuetify)
  }
})
