import { configureVuetify } from './config'
import { defineNuxtPlugin } from '#imports'
import { useNuxtApp } from '#app'

export default defineNuxtPlugin({
  name: 'vuetify:configuration:plugin',
  enforce: 'post',
  parallel: false,
  setup() {
    useNuxtApp().hook('app:created', configureVuetify)
  },
})
