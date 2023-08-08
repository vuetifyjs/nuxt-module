# Vuetify Configuration File

You can register Vuetify options using a file, the file path **must** be relative to the root folder.

You can also use it in Nuxt Layers, the module will scan for `vuetify.config` files with the following extensions: `js`, `mjs`, `cjs`, `ts`, `cts` and `mts`.

This module will watch Vuetify configuration files in development and only configuration files outside `node_modules`.

When any Vuetify configuration file is changed in development, this module will invalidate all virtual configuration modules. The current version of the module will send 2 or 3 full page reloads in a row, not very optimal but much better than restarting the development server, we will try to fix it in future versions.

For example, you can configure:
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
    vuetifyOptions: './vuetify.config.ts' // <== you can omit it
  }
})
```

and then use `defineVuetifyConfiguration` in your `vuetify.config` file:

```ts
// vuetify.config.ts
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  /* vuetify options */
})
```

or just using object notation:

```ts
// vuetify.config.ts
import type { ExternalVuetifyOptions } from 'vuetify-nuxt-module'

export default {
  /* vuetify options */
} satisfies ExternalVuetifyOptions
```

You can omit `vuetifyOptions`, you only need to add one of the following files, the module will load it for you:
- `vuetify.config.js`
- `vuetify.config.cjs`
- `vuetify.config.mjs`
- `vuetify.config.ts`
- `vuetify.config.cts`
- `vuetify.config.mts`

If you want the module to omit loading your configuration file, add `config: false` to your configuration:
```ts
// vuetify.config.ts
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  config: false
  /* other vuetify options */
})
```
or using object notation:

```ts
// vuetify.config.ts
import type { ExternalVuetifyOptions } from 'vuetify-nuxt-module'

export default {
  config: false
  /* vuetify options */
} satisfies ExternalVuetifyOptions
```
