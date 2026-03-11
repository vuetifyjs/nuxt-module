import MyModule from '../../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  future: {
    compatibilityVersion: 4,
  },
})
