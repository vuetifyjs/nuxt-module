# Common Setup

The `styles` option in `moduleOptions` allows you to configure how Vuetify styles are handled.

## Configuration

You can configure the styles using the `styles` property in `moduleOptions`.

### Basic Usage

By default, styles are enabled (`true`). To disable them, set `styles` to `'none'`.

```ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      styles: 'none'
    }
  }
})
```

### Vuetify 4 Features

If you are using Vuetify 4 (or compatible versions), you can configure specific style features like `colors` and `utilities`.

- `colors`: Enable/disable the standard colors palette. Default: `true`.
- `utilities`: Enable/disable the standard utilities. Default: `true`.

::: info
These options are only available for **Vuetify 4**. If you are using Vuetify 3, you should use the `configFile` option for customization.
:::

```ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      styles: {
        colors: false,
        utilities: false
      }
    }
  }
})
```

### SASS Customization

If you want to customize SASS variables (Vuetify 3+), you can provide a `configFile` path. This allows you to override global and component-level variables.

See [SASS Customization](/guide/styling/sass) for a detailed guide.

```ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      styles: {
        configFile: 'assets/settings.scss'
      }
    }
  }
})
```

When using `configFile`, you can also enable [Experimental Caching](/guide/styling/caching) to improve build performance.
