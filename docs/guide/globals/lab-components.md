---
outline: deep
---

# Lab Components

The module provides support to use Vuetify [labs components](https://vuetifyjs.com/en/labs/introduction/) via `vuetifyOptions.labsComponents` module option, it has been declared properly to have better DX.

You can register all the lab components or only the ones you need: check the [lab component definition](https://github.com/vuetifyjs/nuxt-module/blob/main/src/types.ts#L140-L141).

## Examples

### Registering all the lab components

Example registering all the Vuetify lab components:
```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      labComponents: true
    }
  }
})
```

### Registering single lab component

Example registering a single Vuetify lab component, use singular name or array notation:
```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      labComponents: 'VDataTable' // or ['VDataTable']
    }
  }
})
```

### Registering multiple lab components

Example registering multiple Vuetify lab components, use array notation:
```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      labComponents: ['VDataTable', 'VDatePicker']
    }
  }
})
```
