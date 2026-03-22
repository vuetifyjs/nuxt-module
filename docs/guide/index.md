I'll complete this Vuetify Nuxt Module documentation guide for you, continuing from where you left off with the StackBlitz link. Here's the comprehensive guide:

---

Installation (continued)

Existing Project

If you already have a Nuxt project, you can add Vuetify by installing the module:

::: code-group

```bash [npm]
npm i -D vuetify-nuxt-module
```

```bash [yarn]
yarn add -D vuetify-nuxt-module
```

```bash [pnpm]
pnpm add -D vuetify-nuxt-module
```

```bash [bun]
bun add -D vuetify-nuxt-module
```

:::

Then add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module']
})
```

Configuration

Basic Setup

The module works with zero configuration, but you can customize Vuetify through the `vuetify` property in your Nuxt config:

```typescript
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      // Vuetify options
      theme: {
        defaultTheme: 'dark'
      }
    },
    moduleOptions: {
      /* module specific options */
    }
  }
})
```

Configuration Options

`vuetifyOptions`

Standard Vuetify configuration object passed directly to `createVuetify()`:

Option	Type	Description	
`theme`	`ThemeOptions`	Theme configuration (light/dark modes, colors)	
`icons`	`IconOptions`	Icon library configuration	
`locale`	`LocaleOptions`	Internationalization settings	
`components`	`unknown`	Component customization	
`directives`	`unknown`	Directive configuration	
`defaults`	`DefaultsInstance`	Default props for components	

`moduleOptions`

Module-specific configuration:

```typescript
interface ModuleOptions {
  /** 
   * Styles configuration 
   * @default 'sass'
   */
  styles?: true | 'none' | 'sass' | 'css' | {
    configFile: string
  }
  
  /** 
   * Auto-import components 
   * @default true
   */
  autoImport?: boolean
  
  /**
   * Include Vuetify styles
   * @default true
   */
  includeStyles?: boolean
  
  /**
   * Tree-shaking configuration
   */
  treeShake?: boolean
}
```

Styles Configuration

Using Sass Variables (Recommended)

Create `assets/settings.scss`:

```scss
@use 'vuetify/settings' with (
  $color-pack: false,
  $utilities: false,
  $button-height: 40px
);
```

Then configure the module:

```typescript
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

CSS-Only Mode

For projects not using Sass:

```typescript
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      styles: 'css'
    }
  }
})
```

Disable Styles

If you want to handle styles manually:

```typescript
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      styles: false
    }
  }
})
```

Features

🚀 Auto-imports

All Vuetify components and composables are auto-imported:

```vue
<template>
  <v-app>
    <v-main>
      <v-container>
        <v-btn color="primary" @click="toggleTheme">
          Toggle Theme
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// useTheme is auto-imported
const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
```

🎨 Theme System

Full SSR-compatible theme support:

```typescript
export default defineNuxtConfig({
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#1867C0',
              secondary: '#5CBBF6',
              surface: '#FFFFFF',
              background: '#F5F5F5'
            }
          },
          dark: {
            colors: {
              primary: '#2196F3',
              secondary: '#424242',
              surface: '#121212',
              background: '#0D0D0D'
            }
          }
        }
      }
    }
  }
})
```

📱 Responsive Design

Vuetify's display composables work seamlessly with Nuxt:

```vue
<script setup>
const { mobile, platform } = useDisplay()
</script>

<template>
  <v-card :width="mobile ? '100%' : 400">
    <v-card-text>
      Platform: {{ platform.name }}
    </v-card-text>
  </v-card>
</template>
```

🌍 SSR & SSG

The module handles server-side rendering automatically:

- SSR: Full server-side rendering with hydration
- SSG: Compatible with `nuxt generate`
- Island Components: Support for Nuxt's server components

Icons

Material Design Icons (MDI)

Install the icon library:

::: code-group

```bash [npm]
npm i -D @mdi/font
```

```bash [yarn]
yarn add -D @mdi/font
```

```bash [pnpm]
pnpm add -D @mdi/font
```

:::

Configure in CSS:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['@mdi/font/css/materialdesignicons.min.css'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi'
      }
    }
  }
})
```

Other Icon Sets

```typescript
// FontAwesome
icons: {
  defaultSet: 'fa',
  sets: ['fa']
}

// SVG Icons
icons: {
  defaultSet: 'mdi-svg'
}
```

TypeScript

Full TypeScript support is included. For custom component types:

```typescript
// types/vuetify.d.ts
import 'vuetify/components'
import type { VBtn, VCard } from 'vuetify/components'

declare module 'vue' {
  export interface GlobalComponents {
    VBtn: typeof VBtn
    VCard: typeof VCard
  }
}
```

Advanced Usage

Custom Composables

Create composables that leverage Vuetify:

```typescript
// composables/useCustomTheme.ts
export function useCustomTheme() {
  const theme = useTheme()
  
  const isDark = computed(() => theme.global.current.value.dark)
  
  function setBrandColor(color: string) {
    theme.themes.value.light.colors.primary = color
    theme.themes.value.dark.colors.primary = color
  }
  
  return {
    isDark,
    setBrandColor
  }
}
```

Plugin Integration

Access Vuetify instance in plugins:

```typescript
// plugins/vuetify.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:ready', (vuetify) => {
    // Vuetify is ready
    console.log('Vuetify version:', vuetify.version)
  })
})
```

Troubleshooting

Common Issues

Styles not loading

Ensure you have the correct styles configuration:

```typescript
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      styles: true // or 'sass' or 'css'
    }
  }
})
```

Hydration mismatches

Use `ClientOnly` for components that access browser APIs:

```vue
<template>
  <ClientOnly>
    <v-chart :data="chartData" />
  </ClientOnly>
</template>
```

Tree-shaking not working

Enable explicit imports if needed:

```typescript
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      autoImport: false // Use explicit imports
    }
  }
})
```

Migration

From `@nuxtjs/vuetify`

1. Remove old module: `npm uninstall @nuxtjs/vuetify`
2. Install new module: `npm i -D vuetify-nuxt-module`
3. Update `nuxt.config.ts`:
   - Replace `@nuxtjs/vuetify` with `vuetify-nuxt-module`
   - Move config from `vuetify` root to `vuetify.vuetifyOptions`

From manual Vuetify setup

1. Remove manual Vuetify plugin
2. Install this module
3. Move your `createVuetify` configuration to `vuetify.vuetifyOptions`

Resources

- [GitHub Repository](https://github.com/userquin/vuetify-nuxt-module)
- [Vuetify Documentation](https://vuetifyjs.com/)
- [Nuxt Documentation](https://nuxt.com/)
- [StackBlitz Demo](https://stackblitz.com/github/userquin/vuetify-nuxt-module)

---

This guide provides a complete reference for using the Vuetify Nuxt Module. The module simplifies integration by handling SSR compatibility, auto-imports, and optimal build configuration automatically.```

```bash [pnpm]
pnpm dlx nuxt module add vuetify-nuxt-module
```

```bash [bun]
bun x nuxt module add vuetify-nuxt-module
```

:::

## Usage

::: info
`vuetify-nuxt-module` is strongly opinionated and has a built-in default configuration out of the box. You can use it without any configuration, and it will work for most use cases.
:::

Add `vuetify-nuxt-module` module to `nuxt.config.ts` and configure it:

::: code-group

```ts [Minimal Setup]
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'vuetify-nuxt-module'
  ],
})
```

```ts [Custom Setup]
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'vuetify-nuxt-module'
  ],
  vuetify: {
    moduleOptions: {
      styles: {
        colors: false
      }
    },
    vuetifyOptions: {
      icons: 'unocss-mdi'
    }
  }
})
```

:::

## Module Options

Check out the type declaration [src/types.ts](https://github.com/vuetifyjs/nuxt-module/blob/main/src/types.ts).

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
   * Specify `none` to disable Vuetify styles.
   *
   * If you are using Vuetify 3, you can only use the `configFile` option.
   *
   * The `colors` and `utilities` options are only available for Vuetify 4.
   *
   * @see https://vuetifyjs.com/en/styles/entry-points/#individual-modules
   *
   * @default true
   */
  styles?: true | 'none' | {
    configFile: string
  } | {
    colors?: boolean
    utilities?: boolean
  }
  /**
   * Disable the modern SASS compiler and API.
   *
   * The module will check for `sass-embedded` dev dependency:
   * - if `disableModernSassCompiler` is enabled, the module will configure the legacy SASS compiler.
   * - if `sass-embedded` dependency is installed, the module will configure the modern SASS compiler.
   * - otherwise, the module will configure the modern SASS API and will enable [preprocessorMaxWorkers](https://vitejs.dev/config/shared-options.html#css-preprocessormaxworkers), only if not configured from user land.
   *
   * @https://vitejs.dev/config/shared-options.html#css-preprocessoroptions
   * @see https://vitejs.dev/config/shared-options.html#css-preprocessormaxworkers
   *
   * @default false
   * @deprecated Vite 7 supports only the modern SASS compiler and API.
   */
  disableModernSassCompiler?: boolean
  /**
   * Add Vuetify Vite Plugin `transformAssetsUrls`?
   *
   * You can extend the Vuetify `transformAssetsUrls`.
   *
   * @default true
   */
  includeTransformAssetsUrls?: boolean | Record<string, string[]>
  /**
   * Directives Vuetify Vite Plugin should ignore.
   *
   * @since v0.15.1
   */
  ignoreDirectives?: DirectiveName | DirectiveName[]
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
   * By default, `mdi` icons will be used via cdn: https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css.
   *
   * @see https://vuetifyjs.com/en/features/icon-fonts/
   */
  icons?: false | IconsOptions
}
```
</details>

::: warning
You don't need to install any [Vuetify Vite Plugin](https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin), the module will throw an error if any Vuetify Vite Plugin is installed in your Nuxt configuration.
:::

