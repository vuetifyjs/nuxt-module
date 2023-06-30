import { createVuetify } from 'vuetify'

// import * as directives from 'vuetify/directives'
import { defineNuxtPlugin } from '#app'

const isDev = process.env.NODE_ENV === 'development'
const options = JSON.parse('<%= JSON.stringify(options) %>')

// options.directives = directives

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify(options)
  nuxtApp.vueApp.use(vuetify)

  if (!process.server && isDev) {
    // eslint-disable-next-line no-console
    console.log('Vuetify 3 initialized', vuetify)
  }

  return {
    provide: {
      vuetify,
    },
  }
})
