# Nuxt Plugin Hooks

This module configures and registers Vuetify using Nuxt plugins via `vuetify:configuration` hook.

`vuetify:configuration` hook is for internal use and not meant to be used by third-party plugins or directly from your application.
This module will expose only the necessary Nuxt plugins to configure Vuetify using the options you've configured in your application:
- [icons](/guide/icons/): this Nuxt plugin is always registered, you can write your own Nuxt plugin via `vuetifyOptions.icons.defaultSet = 'custom'` Nuxt configuration option, you have an example using UnoCSS in [Adding a new Vuetify icon set](/guide/icons/unocss-preset-icons#adding-a-new-vuetify-icon-set), replace the icons with your custom ones.
- [i18n](/guide/i18n): this Nuxt plugin will be only registered when `@nuxtjs/i18n` module is configured.
- [date](/guide/date): this Nuxt plugin will be only registered when `vuetifyOptions.date` Nuxt configuration option is configured.

If you need to update the Vuetify configuration before calling `createVuetify` and registering the plugin, you can use the `vuetify:before-create` hook in your Nuxt Plugin:
```ts
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
    // update vuetifyOptions
  })
})
```
