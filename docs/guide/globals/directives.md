---
outline: deep
---

# Directives

By default, the module will not register any Vuetify directive. If you need to register some directive, use `vuetifyOptions.directives` module option, it has been declared properly to have better DX.

You can register all the directives or only the ones you need: check the [directives definition](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts#L82-L83).

## Examples

### Registering all the directives

Example registering all the Vuetify directives:

```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      directives: true
    }
  }
})
```

### Registering one directive

Example registering a single Vuetify directive, use singular name or array notation:
```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      directives: 'Ripple' // or ['Ripple']
    }
  }
})
```

### Registering multiple directives

Example registering multiple Vuetify directives, use array notation:
```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      directives: ['Ripple', 'Resize']
    }
  }
})
```
