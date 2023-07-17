---
outline: deep
---

# Getting Started

Welcome to the Vuetify Nuxt Module documentation.

You can open the vuetify-nuxt-module GitHub repo in StackBlitz to start playing with the playground:

<a href="https://stackblitz.com/github/userquin/vuetify-nuxt-module" target="_blank" rel="noopener noreferrer">
  <img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz" width="162" height="32">
</a>

## Installation

:::warning
Requires Vite, will not work with Webpack
:::

::: code-group
  ```bash [pnpm]
  pnpm add -D vuetify-nuxt-module
  ```
  ```bash [yarn]
  yarn add -D vuetify-nuxt-module
  ```
  ```bash [npm]
  npm install -D vuetify-nuxt-module
  ```
:::

## Usage

:::info
`vuetify-nuxt-module` is strongly opinionated and has a built-in default configuration out of the box. You can use it without any configuration, and it will work for most use cases.
:::

:::warning
You don't need to install any [Vuetify Vite Plugin](https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin), the module will throw an error if any Vuetify Vite Plugin is installed in your Nuxt configuration.

Check out the [Globals](/guide/globals/) entry for more info.
:::

Add `vuetify-nuxt-module` module to `nuxt.config.ts` and configure it:

```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'vuetify-nuxt-module'
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
    }
  }
})
```

## Nuxt Layers and Hooks

You can load your Vuetify configuration using [Nuxt Layers](https://nuxt.com/docs/getting-started/layers#layers) or using a custom module via `vuetify:registerModule` [Nuxt Hook](https://nuxt.com/docs/guide/going-further/hooks#nuxt-hooks-build-time).

### Nuxt Layers

Add your Vuetify configuration to a layer and then configure the module to use it:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['my-awesome-vuetify-layer'],
  modules: ['vuetify-nuxt-module']
})
```

### Nuxt Hook

You can use a custom module to load your Vuetify configuration:
```ts
// Nuxt config file
import MyVuetifyModule from './modules/my-vuetify-module'

export default defineNuxtConfig({
  modules: [MyVuetifyModule, 'vuetify-nuxt-module']
})
```

and your module will load your configuration via `vuetify:registerModule` Nuxt hook:
```ts
// modules/my-vuetify-module
export default defineNuxtModule({
  setup(_options, nuxt) {
    nuxt.hook('vuetify:registerModule', register => register({
      moduleOptions: {
        /* module specific options */
      },
      vuetifyOptions: {
        /* vuetify options */
      },
    }))
  },
})
```

## Module Options

Check out the type declaration [src/types.ts](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts).

<details>
<summary><strong>moduleOptions</strong></summary>

```ts
export interface MOptions {
  /**
   * @default true
   */
  importComposables?: boolean
  /**
   * If you are using another composables that collide with the Vuetify ones,
   * enable this flag to prefix them with `V`:
   * - `useLocale` -> `useVLocale`
   * - `useDefaults` -> `useVDefaults`
   * - `useDisplay` -> `useVDisplay`
   * - `useLayout` -> `useVLayout`
   * - `useRtl` -> `useVRtl`
   * - `useTheme` -> `useVTheme`
   *
   * @default false
   */
  prefixComposables?: boolean
  /**
   * Vuetify styles.
   *
   * @see https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
   */
  styles?: true | 'none' | 'expose' | 'sass' | {
    configFile: string
  }
}
```
</details>

<details>
<summary><strong>vuetifyOptions</strong></summary>

```ts
export interface VOptions extends Partial<Omit<VuetifyOptions, 'ssr' | 'aliases' | 'components' | 'directives' | 'locale' | 'date' | 'icons'>> {
  aliases?: Record<string, ComponentName>
  /**
   * Do you need to configure some global components?.
   *
   * @default false
   */
  components?: Components
  /**
   * Configure the locale messages, the locale, the fallback locale and RTL options.
   *
   * When `@nuxtjs/i18n` Nuxt module is present, the following options will be ignored:
   * - `locale`
   * - `fallback`
   * - `rtl`
   *
   * The adapter will be `vuetify`, if you want to use another adapter, check `date` option.
   */
  locale?: Omit<LocaleOptions, 'adapter'> & RtlOptions
  /**
   * Include the lab components?
   *
   * You can include all lab components configuring `labComponents: true`.
   *
   * You can provide an array with the names of the lab components to include.
   *
   * @see https://vuetifyjs.com/en/labs/introduction/
   *
   * @default false
   */
  labComponents?: LabComponents
  /**
   * Include the directives?
   *
   * You can include all directives configuring `directives: true`.
   *
   * You can provide an array with the names of the directives to include.
   *
   * @default false
   */
  directives?: Directives
  /**
   * Date configuration.
   *
   * When this option is configured, the `v-date-picker` lab component will be included.
   *
   * @see https://vuetifyjs.com/features/dates/
   * @see https://vuetifyjs.com/components/date-pickers/
   */
  date?: DateOptions
  /**
   * Include the icons?
   *
   * By default, `mdi` icons will be used via cdn: https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css.
   *
   * @see https://vuetifyjs.com/en/features/icon-fonts/
   */
  icons?: false | IconsOptions
}
```
</details>

## Nuxt Plugin Hooks

This module configures and registers Vuetify using Nuxt plugins via `vuetify:configuration` hook.

`vuetify:configuration` hook is for internal use and not meant to be used by third-party plugins or directly from your application.
This module will expose only the necessary Nuxt plugins to configure Vuetify using the options you've configured in your application:
- [icons](/guide/icons/): this Nuxt plugin is always registered, you can write your own Nuxt plugin via `vuetifyOptions.icons.defaultSet = 'custom'` Nuxt configuration option, you have an example using UnoCSS in [Adding a new Vuetify icon set](/icons/unocss-preset-icons).
- [i18n](/guide/i18n): this Nuxt plugin will be only registered when `@nuxtjs/i18n` module is configured.
- [date](/guide/date): this Nuxt plugin will be only registered when `vuetifyOptions.date` Nuxt configuration option is configured.

If you need to update the Vuetify configuration before calling `createVuetify` and registering the plugin, you can use the `vuetify:before-create` hook in your Nuxt Plugin:
```ts
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
    // update vuetifyOptions
  })
})
```

## Vuetify Composables

No more Vuetify composables manual imports, auto import is enabled by default:
- [useDate](https://vuetifyjs.com/en/api/use-date/)
- [useDefaults](https://vuetifyjs.com/en/api/use-defaults/)
- [useDisplay](https://vuetifyjs.com/en/api/use-display/)
- [useLayout](https://vuetifyjs.com/en/api/use-layout/)
- [useLocale](https://vuetifyjs.com/en/api/use-locale/)
- [useRtl](https://vuetifyjs.com/en/api/use-rtl/)
- [useTheme](https://vuetifyjs.com/en/api/use-theme/)

You can disable auto-import using `moduleOptions.importComposables: false`.

If you are using another composables that collide with the Vuetify ones, enable `moduleOptions.prefixComposables: true` to prefix them with `V`:
- `useLocale` => `useVLocale`
- `useDefaults` => `useVDefaults`
- `useDisplay` => `useVDisplay`
- `useLayout` => `useVLayout`
- `useRtl` => `useVRtl`
- `useTheme` => `useVTheme`


## Vuetify Blueprints

The module supports Vuetify Blueprints, just add it to the `vuetifyOptions.blueprint` module option, but with some limitations:
- `ssr` will be ignored, this flag can be only configured internally by the module via the Nuxt ssr option
- `components` will be ignored, configure them using the `vuetifyOptions.components` module option
- `directives` will be ignored, configure them using the `vuetifyOptions.directives` module option
- `locale` will be ignored, configure it using the `vuetifyOptions.locale` module option
- `date` will be ignored, configure it using the `vuetifyOptions.date` module option
- `icons` will be ignored, configure it using the `vuetifyOptions.icons` module option

