import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule, '~/modules/restart-probe'],
  ssr: true,
  vuetify: {
    moduleOptions: { styles: true },
  },
})
