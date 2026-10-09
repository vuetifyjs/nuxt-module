import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  vuetify: {
    vuetifyOptions: {
      date: { adapter: 'string' },
    },
  },
})
