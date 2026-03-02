export default defineNuxtRouteMiddleware(to => {
  if (import.meta.client) {
    console.log('global middleware', to.path, useNuxtApp().$vuetify)
  }
})
