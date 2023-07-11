export default defineNuxtConfig({
  modules: ['../module'],
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
