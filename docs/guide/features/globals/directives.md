---
outline: deep
---

# Directives

By default, the module does not register any Vuetify directives. If you need to register specific directives, you can use the `vuetifyOptions.directives` module option, which is designed for a better developer experience.

You can register all directives or only the ones you need. Please check the [directives definition](https://github.com/vuetifyjs/nuxt-module/blob/main/src/types.ts#L138-L139) for more details.

## Ignore directives <Badge type="tip" text="from v0.15.1" />

If you wish to ignore certain directives, you can use the `moduleOptions.ignoreDirectives` option. The module will then configure the Vuetify Vite Plugin to [ignore](https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#ignoring-components-or-directives) the specified directives.

## Examples

### Registering all the directives

Here is an example of registering all Vuetify directives:

::: code-group

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      directives: true
    }
  }
})
```

:::

### Registering one directive

Here is an example of registering a single Vuetify directive using either the singular name or array notation:
::: code-group

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      directives: 'Ripple' // or ['Ripple']
    }
  }
})
```

:::

### Registering multiple directives

Here is an example of registering multiple Vuetify directives using array notation:
::: code-group

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      directives: ['Ripple', 'Resize']
    }
  }
})
```

:::
