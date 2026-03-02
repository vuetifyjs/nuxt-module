---
outline: deep
---

# Directives

By default, the module will not register any Vuetify directive. If you need to register some directive, use `vuetifyOptions.directives` module option, it has been declared properly to have better DX.

You can register all the directives or only the ones you need: check the [directives definition](https://github.com/vuetifyjs/nuxt-module/blob/main/src/types.ts#L138-L139).

## Ignore directives <Badge type="tip" text="from v0.15.1" />

If you want to ignore some directives, you can use the `moduleOptions.ignoreDirectives` option. The module will configure the Vuetify Vite Plugin to [ignore](https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#ignoring-components-or-directives) the directives you specify.

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
