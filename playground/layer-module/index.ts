import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup(_options, nuxt) {
    nuxt.hook('vuetify:registerModule', registerModule => registerModule({
      vuetifyOptions: {
        aliases: {
          MyBtn: 'VBtn',
        },
      },
    }))
  },
})
