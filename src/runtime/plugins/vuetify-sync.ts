import type { createVuetify } from 'vuetify'
import { configureVuetify } from './config'
import { defineNuxtPlugin } from '#imports'
import type { Plugin } from '#app'

const plugin: Plugin<{
  vuetify: ReturnType<typeof createVuetify>
}> = defineNuxtPlugin({
  name: 'vuetify:configuration:plugin',
  enforce: 'post',
  // @ts-expect-error i18n plugin missing on build time
  dependsOn: ['i18n:plugin'],
  // i18n runtime plugin can be async
  parallel: false,
  async setup() {
    await configureVuetify()
  },
})

export default plugin
