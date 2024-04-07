---
outline: deep
---

# Getting Started

Welcome to the Vuetify Nuxt Module documentation.

::: warning Breaking Changes
From `v0.10.0` version, this module requires `Nuxt v3.9.0+`.

From `v0.7.0` version, this module requires `Nuxt v3.6.5+`.
:::

You can open the vuetify-nuxt-module GitHub repo in StackBlitz to start playing with the playground:

<a href="https://stackblitz.com/github/userquin/vuetify-nuxt-module" target="_blank" rel="noopener noreferrer">
  <img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz" width="162" height="32">
</a>

## Installation

::: warning
Requires Vite, will not work with Webpack
:::
```bash
npx nuxi@latest module add vuetify-nuxt-module
```

## Usage

::: info
`vuetify-nuxt-module` is strongly opinionated and has a built-in default configuration out of the box. You can use it without any configuration, and it will work for most use cases.
:::

::: warning
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

## Module Options

Check out the type declaration [src/types.ts](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts).

<details>
<summary><strong>Vuetify Nuxt Module Options</strong></summary>

```ts
export interface ModuleOptions {
  moduleOptions?: MOptions
  /**
   * Vuetify options.
   *
   * You can inline the configuration or specify a file path:
   * `vuetifyOptions: './vuetify.options.ts'`
   *
   * The path should be relative to the root folder.
   */
  vuetifyOptions?: string | VOptions
}
```
</details>

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
   * If you want to use configFile on SSR, you have to disable `experimental.inlineSSRStyles` in nuxt.config.
   *
   * @see https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
   * @see https://github.com/userquin/vuetify-nuxt-module/issues/78 and https://github.com/userquin/vuetify-nuxt-module/issues/74
   */
  styles?: true | 'none' | 'sass' | {
    configFile: string
  }
  /**
   * Add Vuetify Vite Plugin `transformAssetsUrls`?
   *
   * You can extend the Vuetify `transformAssetsUrls`.
   *
   * @default true
   */
  includeTransformAssetsUrls?: boolean | Record<string, string[]>
  /**
   * Vuetify SSR client hints.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints
   */
  ssrClientHints?: {
    /**
     * Should the module reload the page on first request?
     *
     * @default false
     */
    reloadOnFirstRequest?: boolean
    /**
     * Enable `Sec-CH-Viewport-Width` and `Sec-CH-Viewport-Height` headers?
     *
     * @see https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-width
     * @see https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-height
     *
     * @default false
     */
    viewportSize?: boolean
    /**
     * Enable `Sec-CH-Prefers-Color-Scheme` header?
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Color-Scheme
     *
     * @default false
     */
    prefersColorScheme?: boolean
    /**
     * The options for `prefersColorScheme`, `prefersColorScheme` must be enabled.
     *
     * If you want the module to handle the color scheme for you, you should configure this option, otherwise you'll need to add your custom implementation.
     */
    prefersColorSchemeOptions?: {
      /**
       * The name for the cookie.
       *
       * @default 'color-scheme'
       */
      cookieName?: string
      /**
       * The name for the dark theme.
       *
       * @default 'dark'
       */
      darkThemeName?: string
      /**
       * The name for the light theme.
       *
       * @default 'light'
       */
      lightThemeName?: string
      /**
       * Use the browser theme only?
       *
       * This flag can be used when your application provides a custom dark and light themes,
       * but will not provide a theme switcher, that's, using by default the browser theme.
       *
       * @default false
       */
      useBrowserThemeOnly?: boolean
    }
    /**
     * Enable `Sec-CH-Prefers-Reduced-Motion` header?
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Reduced-Motion
     *
     * @default false
     */
    prefersReducedMotion?: boolean
  }
}
```
</details>

<details>
<summary><strong>vuetifyOptions</strong></summary>

```ts
export interface VOptions extends Partial<Omit<VuetifyOptions, 'ssr' | 'aliases' | 'components' | 'directives' | 'locale' | 'date' | 'icons'>> {
  /**
   * Configure the SSR options.
   *
   * This option is only used when SSR is enabled in your Nuxt configuration.
   */
  ssr?: {
    clientWidth: number
    clientHeight?: number
  }

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
   * - `messages`
   *
   * The adapter will be `vuetify`, if you want to use another adapter, check `date` option.
   */
  locale?: Omit<LocaleOptions, 'adapter'> & RtlOptions
  /**
   * Include locale messages?
   *
   * When `@nuxtjs/i18n` Nuxt module is present, this option will be ignored.
   *
   * You can include the locales you want to use in your application, this module will load and configure the messages for you.
   */
  localeMessages?: VuetifyLocale | VuetifyLocale[]
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
