export default defineNuxtConfig({
  modules: ['../../src/module'],
  // @ts-expect-error just ignore types
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
