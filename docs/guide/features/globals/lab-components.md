---
outline: deep
---

# Lab Components

::: info
The module supports auto-import for [labs components](https://vuetifyjs.com/en/labs/introduction/), allowing you to use them on demand.
:::

The module supports Vuetify [labs components](https://vuetifyjs.com/en/labs/introduction/) via the `vuetifyOptions.labsComponents` module option, designed for a better developer experience.

You can register all lab components or only the ones you need. Please check the [lab component definition](https://github.com/vuetifyjs/nuxt-module/blob/main/src/types.ts#L140-L141) for more details.

## Examples

### Registering all the lab components

Here is an example of registering all Vuetify lab components:
::: code-group

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      labComponents: true
    }
  }
})
```

:::

### Registering single lab component

Here is an example of registering a single Vuetify lab component using either the singular name or array notation:
::: code-group

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      labComponents: 'VDataTable' // or ['VDataTable']
    }
  }
})
```

:::

### Registering multiple lab components

Example registering multiple Vuetify lab components, use array notation:
::: code-group

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      labComponents: ['VDataTable', 'VDatePicker']
    }
  }
})
```

:::
