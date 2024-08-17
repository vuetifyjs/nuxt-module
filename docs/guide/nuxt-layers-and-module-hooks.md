---
outline: deep
---

# Nuxt Layers and Module Hooks

You can load your Vuetify configuration using [Nuxt Layers](https://nuxt.com/docs/getting-started/layers#layers) or using a custom module via `vuetify:registerModule` [Nuxt Module Hook](https://nuxt.com/docs/guide/going-further/hooks#nuxt-hooks-build-time).

::: warning
If you're **NOT** using Nuxt `^3.8.1+`, you should use `// @ts-expect-error` when using the `vuetify:registerModule` nuxt module hook, TypeScript will complain.
:::

## Nuxt Layers

Follow the [installation instructions](/guide/) for `vuetify-nuxt-module` in your layer. Then extend that layer in your other project:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['my-awesome-vuetify-layer'],
})
```

## Nuxt Module Hook

You can use a custom module to load your Vuetify configuration:
```ts
// Nuxt config file
import MyVuetifyModule from './modules/my-vuetify-module'

export default defineNuxtConfig({
  modules: [MyVuetifyModule, 'vuetify-nuxt-module']
})
```

and your module will load your configuration via `vuetify:registerModule` Nuxt hook:
```ts
// modules/my-vuetify-module
export default defineNuxtModule({
  setup(_options, nuxt) {
    // If you're using Nuxt < 3.8.1, you should add a ts-expect-error here
    nuxt.hook('vuetify:registerModule', register => register({
      moduleOptions: {
        /* module specific options */
      },
      vuetifyOptions: {
        /* vuetify options */
      },
    }))
  },
})
```
