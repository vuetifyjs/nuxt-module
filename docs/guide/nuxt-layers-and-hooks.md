---
outline: deep
---

# Nuxt Layers and Hooks

You can load your Vuetify configuration using [Nuxt Layers](https://nuxt.com/docs/getting-started/layers#layers) or using a custom module via `vuetify:registerModule` [Nuxt Hook](https://nuxt.com/docs/guide/going-further/hooks#nuxt-hooks-build-time).

## Nuxt Layers

Add your Vuetify configuration to a layer and then configure the module to use it:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['my-awesome-vuetify-layer'],
  modules: ['vuetify-nuxt-module']
})
```

## Nuxt Hook

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
