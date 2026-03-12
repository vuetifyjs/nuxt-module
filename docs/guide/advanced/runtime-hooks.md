# Nuxt Runtime Hooks

This module configures and registers Vuetify using Nuxt plugins via the `vuetify:configuration` runtime hook.

The `vuetify:configuration` hook is intended for internal use and should not be used by third-party plugins or directly from your application.
This module exposes only the necessary Nuxt plugins to configure Vuetify based on the options you've set in your application:
- [icons](/guide/features/icons/): This Nuxt plugin is always registered. You can write your own Nuxt plugin via the `vuetifyOptions.icons.defaultSet = 'custom'` Nuxt configuration option. An example using UnoCSS can be found in [Adding a new Vuetify icon set](/guide/features/icons/unocss-preset-icons#adding-a-new-vuetify-icon-set), where you can replace the icons with your custom ones.
- [i18n](/guide/features/i18n): This Nuxt plugin is registered only when the `@nuxtjs/i18n` module is configured.
- [date](/guide/features/date): This Nuxt plugin is registered only when the `vuetifyOptions.date` Nuxt configuration option is configured.

If you need to update the Vuetify configuration before `createVuetify` is called and the plugin is registered, you can use the `vuetify:before-create` hook in your Nuxt Plugin:
::: code-group

```ts [plugins/vuetify.ts]
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
    // update vuetifyOptions
  })
})
```

:::

If you need to access the Vuetify instance after it has been created, you can use the `vuetify:ready` hook in your Nuxt Plugin:
::: code-group

```ts [plugins/vuetify.ts]
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:ready', (vuetify) => {
    // your logic here
  })
})
```

:::
