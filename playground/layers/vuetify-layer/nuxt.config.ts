export default defineNuxtConfig({
  modules: ['../../../src/module'],
  vuetify: {
    vuetifyOptions: {
      aliases: {
        MyAvatar: 'VAvatar',
      },
    },
  },
})
