import { configureVuetify } from './config'
import { defineNuxtPlugin, useNuxtApp } from '#imports'

export default defineNuxtPlugin({
  name: 'vuetify:configuration:plugin',
  enforce: 'post',
  // i18n runtime plugin is async
  parallel: false,
  setup() {
    useNuxtApp().hook('app:created', configureVuetify)
  },
})
