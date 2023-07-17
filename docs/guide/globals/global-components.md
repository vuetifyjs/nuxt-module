---
outline: deep
---

# Global Components

If you need to add some global component, use `vuetifyOptions.components` module option, it has been declared properly to have better DX.

Check the [components definition](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts#L89-L90).

You can also provide [Aliasing & Virtual Components](https://vuetifyjs.com/en/features/aliasing/#virtual-component-defaults) via `vuetifyOptions.aliases` module option to register components with a different name, only available for global components. The components require to be registered globally.

## Examples

### Register single component

Example registering a Vuetify global component, use singular name or array notation:
```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      components: 'VDialog' // or ['VDialog']
    }
  }
})
```

### Register multiple components

Example registering multiple global components, use array notation:
```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      components: ['VDialog', 'VSheet']
    }
  }
})
```

### Aliasing global component

Example registering a Vuetify global component with a different name (aliases):
```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      aliases: {
        MyButton: 'VBtn'
      }
    }
  }
})
```

The above example is equivalent to:
```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      aliases: {
        MyButton: 'VBtn'
      },
      components: 'VBtn'
    }
  }
})
```
