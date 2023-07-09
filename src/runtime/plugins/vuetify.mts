import { configureVuetify } from './config'
import { defineNuxtPlugin } from '#imports'
import { useNuxtApp } from '#app'

export default defineNuxtPlugin({
  name: 'vuetify:configuration:plugin',
  enforce: 'pre',
  setup() {
    useNuxtApp().hook('app:created', configureVuetify)
  },
})
