# Server Side Rendering (SSR)

Vuetify Nuxt Module supports [SSR](https://nuxt.com/docs/api/configuration/nuxt-config#ssr) out of the box. It will automatically detect if you are using SSR and configure Vuetify accordingly.

## Vuetify SASS Variables

If you are customising Vuetify SASS Variables via [configFile](https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#customising-variables) module option with SSR enabled, you have to disable `experimental.inlineSSRStyles` in your Nuxt config file, otherwise you will get an error when building your application:
```ts
// Nuxt config file
export default defineNuxtConfig({
  ssr: true,
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      /* other module options */
      styles: { configFile: '/settings.scss' }
    },
    vuetifyOptions: {
      /* vuetify options */
    }  
  },
  experimental: {
    inlineSSRStyles: false
  }
})
```
