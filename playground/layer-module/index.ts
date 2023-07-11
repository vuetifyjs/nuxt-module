import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup(_options, nuxt) {
    nuxt.hook('vuetify:registerModule', (register: any) => register({
      vuetifyOptions: {
        aliases: {
          MyBtn: 'VBtn',
        },
      },
    }))
  },
})
