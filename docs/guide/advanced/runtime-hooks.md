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

## Dynamic CSP nonce

Vuetify can add a `nonce` attribute to the `<style>` tag it injects for the theme via the [`theme.cspNonce`](https://vuetifyjs.com/en/features/theme/) option. Setting it in `vuetifyOptions` at build time only allows a **static** nonce, which doesn't work with modules like [nuxt-security](https://nuxt-security.vercel.app/) that generate a **per-request** nonce for the `Content-Security-Policy` header.

Because `vuetify:before-create` runs on every SSR request, right before `createVuetify`, you can read the per-request nonce and assign it dynamically:

::: code-group

```ts [plugins/vuetify.ts]
import { defineNuxtPlugin, useRequestEvent } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
    if (import.meta.server) {
      // nuxt-security stores the per-request nonce on the H3 event context
      const nonce = useRequestEvent()?.context.security?.nonce
      if (nonce) {
        vuetifyOptions.theme ||= {}
        vuetifyOptions.theme.cspNonce = nonce
      }
    }
  })
})
```

:::

::: tip
The accessor for the nonce depends on the module providing it; with nuxt-security it lives at `event.context.security.nonce`. No Nitro hook is required — the runtime `vuetify:before-create` hook already gives you a mutable `vuetifyOptions` per request.
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
