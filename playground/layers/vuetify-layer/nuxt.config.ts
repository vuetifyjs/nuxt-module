export default defineNuxtConfig({
  modules: ['../../module'],
  vuetify: {
    vuetifyOptions: {
      aliases: {
        MyAvatar: 'VAvatar',
      },
    },
  },
})
