import type { createVuetify } from 'vuetify'
import { configureVuetify } from './config'
import { defineNuxtPlugin, useNuxtApp } from '#imports'
import type { Plugin } from '#app'

const plugin: Plugin<{
  vuetify: ReturnType<typeof createVuetify>
}> = defineNuxtPlugin({
  name: 'vuetify:configuration:plugin',
  enforce: 'post',
  // i18n runtime plugin is async
  parallel: false,
  setup() {
    useNuxtApp().hook('app:created', configureVuetify)
  },
})

export default plugin
