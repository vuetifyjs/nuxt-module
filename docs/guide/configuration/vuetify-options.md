# Vuetify Options

You can register Vuetify options using a separate file. Please ensure the file path is relative to the root folder.

Support for Nuxt Layers is also available; the module scans for `vuetify.config` files with the following extensions: `js`, `mjs`, `cjs`, `ts`, `cts`, and `mts`.

During development, the module monitors Vuetify configuration files, focusing on those outside `node_modules`.

::: warning CAVEATS
Modifying the Vuetify configuration during development may trigger a full page reload (sometimes 2-3 times) to invalidate virtual modules without restarting the server. Improvements to this process are planned for future versions.

With SSR and external configuration, the Nuxt dev server restarts due to lack of server-side HMR support in Nuxt.
:::

For example, you can configure:
::: code-group

```ts [nuxt.config.ts]
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    'vuetify-nuxt-module'
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: './vuetify.config.ts' // <== you can omit it
  }
})
```

:::

and then use `defineVuetifyConfiguration` in your `vuetify.config` file:

::: code-group

```ts [vuetify.config.ts]
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  /* vuetify options */
})
```

:::

or just using object notation:

::: code-group

```ts [vuetify.config.ts]
import type { ExternalVuetifyOptions } from 'vuetify-nuxt-module'

export default {
  /* vuetify options */
} satisfies ExternalVuetifyOptions
```

:::

If you prefer, you can omit `vuetifyOptions` and add one of the following files; the module will load it automatically:
- `vuetify.config.js`
- `vuetify.config.cjs`
- `vuetify.config.mjs`
- `vuetify.config.ts`
- `vuetify.config.cts`
- `vuetify.config.mts`

To prevent the module from loading your configuration file, you can set `config: false` in your configuration:
::: code-group

```ts [vuetify.config.ts]
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  config: false
  /* other vuetify options */
})
```

:::
or using object notation:

::: code-group

```ts [vuetify.config.ts]
import type { ExternalVuetifyOptions } from 'vuetify-nuxt-module'

export default {
  config: false
  /* vuetify options */
} satisfies ExternalVuetifyOptions
```

:::
