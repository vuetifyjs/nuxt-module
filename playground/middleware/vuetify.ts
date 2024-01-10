export default defineNuxtRouteMiddleware((to) => {
  // eslint-disable-next-line no-console
  console.log('middleware', to.path, useNuxtApp().$vuetify)
})
