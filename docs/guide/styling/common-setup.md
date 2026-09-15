# Common Setup

The `styles` option in `moduleOptions` allows you to configure how Vuetify styles are handled.

## Configuration

You can configure the styles using the `styles` property in `moduleOptions`.

### Basic Usage

By default, styles are enabled (`true`). To disable them, you can set `styles` to `'none'`.

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

If you are using Vuetify 4, you can configure specific style features such as `colors` and `utilities`.

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

If you wish to customize SASS variables (Vuetify 3+), you can provide a `configFile` path. This allows you to override global and component-level variables.

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

### Cascade Layers

Vuetify 4 organizes its styles with [CSS cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer). Because component styles are injected on demand, their relative order — and therefore layer priority — would otherwise depend on injection order, which is non-deterministic in dev and chunk-dependent in production. This can let Vuetify's reset outrank component rules (for example a `<v-btn size="small">` rendering at the wrong font size).

To make it deterministic, the module inlines the establishing layer order into the SSR'd `<head>` before any component style is parsed. This happens automatically on **Vuetify 4** and needs no configuration.

The default order is:

```css
@layer vuetify-core, vuetify-components, vuetify-overrides, vuetify-utilities, vuetify-final;
```

::: info
This applies to **Vuetify 4** only and is skipped when `styles` is `'none'`. Vuetify 3's layers are opt-in, use different names, and live under a single top-level `vuetify` layer.
:::

#### Custom order

A flat `@layer` statement freezes the listed layers contiguously, so a layer you declare later can only be appended after them. If you need your own layer to sit **between** Vuetify's layers, provide the full order via `cascadeLayers`. Known Vuetify layer names are offered as autocomplete suggestions, and any custom name is allowed.

```ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      cascadeLayers: [
        'vuetify-core',
        'vuetify-components',
        'my-overrides', // beats components, loses to vuetify-overrides
        'vuetify-overrides',
        'vuetify-utilities',
        'vuetify-final'
      ]
    }
  }
})
```

Your list should include Vuetify's layers, otherwise the ordering guarantee is lost for any omitted layer.

#### Opt out

Set `cascadeLayers` to `false` to inject nothing and manage the cascade-layer order yourself.

```ts
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      cascadeLayers: false
    }
  }
})
```

#### Migrating from a manual workaround

Earlier versions had no fix for the layer-order race, so a common workaround was to declare the layer order yourself — typically an inline head style:

```ts
// no longer needed
app: {
  head: {
    style: [{
      innerHTML: '@layer vuetify-core,vuetify-components,vuetify-overrides,vuetify-utilities,vuetify-final;',
      tagPriority: -100
    }]
  }
}
```

- **If your workaround used the default order** (as above), you can simply **remove it** — the module now injects the same statement. Leaving it in place is harmless (re-declaring the same order is a no-op), just redundant.
- **If your workaround declared a custom order** to slot your own layer between Vuetify's — especially via a `css: ['~/layers.css']` file or a `@layer` line in your `configFile` SCSS — move that order to [`cascadeLayers`](#custom-order). Otherwise the module's default statement, parsed first, establishes Vuetify's layers contiguously and your custom layer can only end up after them. Alternatively, set `cascadeLayers: false` to keep your own workaround authoritative.
