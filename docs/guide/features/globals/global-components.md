---
outline: deep
---

# Global Components

If you need to add global components, you can use the `vuetifyOptions.components` module option, which is designed for a better developer experience.

Please check the [components definition](https://github.com/vuetifyjs/nuxt-module/blob/main/src/types.ts#L136-L137) for more details.

You can also provide [Aliasing & Virtual Components](https://vuetifyjs.com/en/features/aliasing/#virtual-component-defaults) via the `vuetifyOptions.aliases` module option to register components with a different name. Note that this is available only for globally registered components.

## Examples

### Register single component

Here is an example of registering a Vuetify global component using either the singular name or array notation:
::: code-group

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      components: 'VDialog' // or ['VDialog']
    }
  }
})
```

:::

### Register multiple components

Here is an example of registering multiple global components using array notation:
::: code-group

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      components: ['VDialog', 'VSheet']
    }
  }
})
```

:::

### Aliasing global component

Here is an example of registering a Vuetify global component with a different name (alias):
::: code-group

```ts [nuxt.config.ts]
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

:::

The above example is equivalent to:
::: code-group

```ts [nuxt.config.ts]
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

:::
