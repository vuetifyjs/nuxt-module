# Vuetify Locale Messages

You can load [Vuetify Locale Messages](https://vuetifyjs.com/en/features/internationalization/#getting-started) using the `vuetifyOptions.localeMessages` module configuration option. There is no need to configure a Nuxt Plugin with the `vuetify:before-create` hook; the module will import them automatically for a better developer experience.

::: warning
When the `@nuxtjs/i18n` Nuxt module is present, the `vuetifyOptions.localeMessages` module configuration option will be ignored.
:::

Using the example from the [Vuetify I18n](https://vuetifyjs.com/en/features/internationalization/#getting-started) documentation:
::: code-group

```ts [nuxt.config.ts]
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
      localeMessages: ['zhHans', 'pl'],
      /* other vuetify options */
    }
  }
})
```

:::

The above configuration will load and configure `zhHans` and `pl` Vuetify messages.

If you have additional messages beyond the default ones provided by Vuetify, you can add them to the locale messages entry or include them by creating a new Nuxt plugin and registering them in the `vuetify:before-create` hook (remembering to merge the messages).

Following with the Vuetify example:
::: code-group

```ts [nuxt.config.ts]
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
      localeMessages: ['zhHans', 'pl'],
      /* other vuetify options */
    }
  }
})
```

:::

This module will merge the messages automatically, so you don't need to worry about manual merging.

If you prefer to load your custom messages from a Nuxt Plugin:
::: code-group

```ts [plugins/vuetify-i18n.ts]
import sv from './i18n/vuetify/sv'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
    vuetifyOptions.locale.messages.sv = sv
  })
})
```

:::
