# Vuetify Locale Messages

You can load [Vuetify Locale Messages](https://vuetifyjs.com/en/features/internationalization/#getting-started) using the `vuetifyOptions.loadMessages` module configuration option, you don't need to configure a Nuxt Plugin with the `vuetify:before-create` hook, the module will import them for you, it has been declared properly to have better DX.

::: warning
When `@nuxtjs/i18n` Nuxt module is present, `vuetifyOptions.loadMessages` module configuration option will be ignored.
:::

Using the example in [Vuetify I18n](https://vuetifyjs.com/en/features/internationalization/#getting-started) documentation:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'vuetify-nuxt-module'
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      locale: {
        locale: 'zhHans',
        fallback: 'sv',
      },
      loadMessages: ['zhHans', 'pl'],
      /* other vuetify options */
    }
  }
})
```

Previous configuration will load and configure `zhHans` and `pl` Vuetify messages.

If you have more messages than the default ones provided by Vuetify, you can add them to the locale messages entry or add them adding a new Nuxt plugin registering them in the `vuetify:before-create` hook (remember to merge the messages).

Following with the Vuetify example:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'vuetify-nuxt-module'
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      locale: {
        locale: 'zhHans',
        fallback: 'sv',
        messages: {
          sv: {
            /* your custom messages here */
          }
        }
      },
      loadMessages: ['zhHans', 'pl'],
      /* other vuetify options */
    }
  }
})
```

This module will merge the messages for you, so you don't need to worry about it.

If you want to load your custom messages from a Nuxt Plugin:
```ts
// Your own translation file
import sv from './i18n/vuetify/sv'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
    vuetifyOptions.locale.messages.sv = sv
  })
})
```
