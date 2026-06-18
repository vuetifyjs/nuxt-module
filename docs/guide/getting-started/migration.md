# Migrating from 0.19.x to 1.0.0

This guide covers the changes you need to make when upgrading from `0.19.x` to `1.0.0`.

It is organized so you can work through it top to bottom:

1. **Installation changes** — what to install before anything else.
2. **Breaking option changes** — options that were removed, and require action.
3. **Deprecated options** — options that still work but should be updated.
4. **New options** — additive options you may want to adopt.
5. **Type-only changes** — annotations that changed without affecting runtime.

A condensed [checklist](#migration-checklist) is at the end.

## Installation changes

### `vuetify` is now a peer dependency

In `0.19.x` the module shipped `vuetify` as a direct dependency, so it was installed transitively. In `1.0.0`, `vuetify` is a **peer dependency** (`^3.4.0 || ^4.0.0`) — you must install it yourself.

::: code-group

```bash [pnpm]
pnpm add -D vuetify
```

```bash [npm]
npm i -D vuetify
```

```bash [yarn]
yarn add -D vuetify
```

:::

The module now supports both **Vuetify 3** and **Vuetify 4**. See the [Compatibility Matrix](/guide/getting-started/compatibility) for the supported tooling baseline (Nuxt `^3.15.0` / Nuxt 4, Vite 7, Node 22+).

::: info
Internally the module swapped `vite-plugin-vuetify` for `@vuetify/loader-shared` and `@vuetify/unplugin-styles`. No action is needed — adding `vite-plugin-vuetify` to your own Vite config was never supported (the module throws if it detects it), so nothing changes for your configuration.
:::

## Breaking option changes

These options were removed or changed type. They require action when upgrading.

### `disableVuetifyStyles` removed

Use `styles: 'none'` instead.

::: code-group

```ts [Before (0.19.x)]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      disableVuetifyStyles: true,
    },
  },
})
```

```ts [After (1.0.0)]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      styles: 'none',
    },
  },
})
```

:::

### `styles: 'sass'` removed

The `'sass'` shortcut, which loaded Vuetify's raw SASS sources so you could override variables, has been removed. To customize SASS variables, point `styles.configFile` at your settings file.

::: code-group

```ts [Before (0.19.x)]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      styles: 'sass',
    },
  },
})
```

```ts [After (1.0.0)]
export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    moduleOptions: {
      styles: {
        configFile: 'assets/settings.scss',
      },
    },
  },
})
```

:::

See [SASS Customization](/guide/styling/sass) for how to author the settings file.

## Deprecated options

These options still work in `1.0.0` but are deprecated. Update them now to avoid surprises in a future release.

### `styles.experimental.cache` → `styles.cache`

::: code-group

```ts [Before (0.19.x)]
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      styles: {
        configFile: 'assets/settings.scss',
        experimental: {
          cache: true,
        },
      },
    },
  },
})
```

```ts [After (1.0.0)]
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      styles: {
        configFile: 'assets/settings.scss',
        cache: true,
      },
    },
  },
})
```

:::

`styles.cache` also accepts an object for finer control:

```ts
styles: {
  configFile: 'assets/settings.scss',
  cache: {
    path: 'node_modules/.cache/vuetify-nuxt-module/styles',
    sassOptions: {},
  },
}
```

See [Caching](/guide/styling/caching) for details.

### `prefersColorSchemeOptions.cookieName` → `cookie.name`

The flat `cookieName` was replaced by a nested `cookie` object so you can configure the cookie's `domain`, `secure`, and `sameSite` attributes too.

::: code-group

```ts [Before (0.19.x)]
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        prefersColorScheme: true,
        prefersColorSchemeOptions: {
          cookieName: 'color-scheme',
        },
      },
    },
  },
})
```

```ts [After (1.0.0)]
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        prefersColorScheme: true,
        prefersColorSchemeOptions: {
          cookie: {
            name: 'color-scheme',
          },
        },
      },
    },
  },
})
```

:::

### `disableModernSassCompiler` deprecated

Vite 7 supports only the modern SASS compiler and API, so this flag no longer has any effect. Remove it from your config.

```ts
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      // disableModernSassCompiler: true, // [!code --] remove
    },
  },
})
```

## New options

These are additive and optional — adopt them if useful.

### `styles.cache` object form

Beyond `styles.cache: true`, you can pass `{ path?, sassOptions? }` to control the cache location and SASS options (see [Caching](/guide/styling/caching)).

### `styles: { colors, utilities }` (Vuetify 4 only)

When using **Vuetify 4**, you can toggle the standard colors palette and utilities directly:

```ts
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      styles: {
        colors: false,
        utilities: false,
      },
    },
  },
})
```

::: info
These are only available for **Vuetify 4**. On Vuetify 3, use `configFile` for style customization. See [Common Setup](/guide/styling/common-setup).
:::

### `rulesConfiguration.configFile`

The rules configuration gained a `configFile` option, and `fromLabs` is now optional:

```ts
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      enableRules: true,
      rulesConfiguration: {
        fromLabs: true,
        configFile: 'rules.config.ts',
      },
    },
  },
})
```

### `prefersColorSchemeOptions.cookie` attributes

The new `cookie` object supports `domain`, `secure`, and `sameSite` — useful for sharing the color-scheme cookie across subdomains:

```ts
export default defineNuxtConfig({
  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        prefersColorScheme: true,
        prefersColorSchemeOptions: {
          cookie: {
            name: 'color-scheme',
            domain: '.example.com',
            secure: true,
            sameSite: 'lax',
          },
        },
      },
    },
  },
})
```

## Type-only changes

These changed only at the TypeScript level. Runtime behavior is unchanged, so **no migration is required** — your existing configuration keeps working.

### `vuetifyOptions.date.formats`

The type was tightened from `Record<string, string>` to `Record<string, Intl.DateTimeFormatOptions>`. Nothing changed at runtime: the module serializes the `date` option with `JSON.stringify` and passes it to Vuetify verbatim, exactly as before.

What this means by adapter:

- **Default `vuetify` adapter:** format values should be `Intl.DateTimeFormatOptions`. Plain strings were never applied by this adapter anyway, so the previous `string` type was misleading.
- **`@date-io` adapters** (`date-fns`, `luxon`, `dayjs`, `moment`): format values are the library's token strings (e.g. `'yyyy-MM-dd'`) and still work at runtime. The new type does not cover this case, so you may need to cast (e.g. `as any`) until the typing is revisited.

## Migration checklist

- [ ] Install `vuetify` as a direct dependency (it is now a peer dependency).
- [ ] Replace `moduleOptions.disableVuetifyStyles: true` with `styles: 'none'`.
- [ ] Replace `moduleOptions.styles: 'sass'` with `styles: { configFile: '...' }`.
- [ ] Move `styles.experimental.cache` to `styles.cache`.
- [ ] Move `ssrClientHints.prefersColorSchemeOptions.cookieName` to `cookie.name`.
- [ ] Remove `moduleOptions.disableModernSassCompiler`.
