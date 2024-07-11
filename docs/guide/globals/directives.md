---
outline: deep
---

# Directives


From `v0.15.0`, the module will register all Vuetify directives. If you need to register only some directive, use `vuetifyOptions.directives` module option, it has been declared properly to have better DX.

Any directive not registered will be ignored by the Vuetify Vite Plugin.

::: info
If you want the old directives behavior, enable `useOldDirectivesBehavior` in the module options.

Check [issue #236](https://github.com/userquin/vuetify-nuxt-module/issues/236).
:::

You can register all the directives or only the ones you need: check the [directives definition](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts#L91-L92).

## Examples

### Registering all the directives

Example ignoring any Vuetify directive:

```ts
// Nuxt config file
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      directives: false
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
