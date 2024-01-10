import type { createVuetify } from 'vuetify'
import { configureVuetify } from './config'
import { defineNuxtPlugin } from '#imports'
import type { Plugin } from '#app'

const plugin: Plugin<{
  vuetify: ReturnType<typeof createVuetify>
}> = defineNuxtPlugin({
  name: 'vuetify:configuration:plugin',
  enforce: 'post',
  async setup() {
    await configureVuetify()
  },
})

export default plugin
