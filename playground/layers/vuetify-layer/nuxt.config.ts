export default defineNuxtConfig({
  // since it is local, the path is relative to the playground folder
  modules: ['../src/module'],
  vuetify: {
    vuetifyOptions: {
      aliases: {
        MyAvatar: 'VAvatar',
      },
    },
  },
})
