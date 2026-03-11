import MyModule from '../../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  vuetify: {
    moduleOptions: {
      styles: {
        configFile: new URL('./layer-settings.scss', import.meta.url).pathname,
      },
    },
  },
})
