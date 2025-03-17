# FAQ

## Maximum call stack size exceeded error

If you're getting a `Maximum call stack size exceeded` error when starting Nuxt dev server after upgrading to the latest Nuxt version (`3.11.0+`), disable `devLogs` in your Nuxt config file:
```ts
export default defineNuxtConfig({
  features: {
    devLogs: false,
  },
})
```

This PR [fix(nuxt): support serialising rich server logs](https://github.com/nuxt/nuxt/pull/26503) should fix the error in the next Nuxt release (`v3.12.0` or `v4.0.0`).

## Vuetify styles broken with Nuxt 3.16.0

If your Vuetify styles not being applied when using Nuxt 3.16.0, you can drop this module to your modules folder:

```ts
// modules/fix-vuetify-theme-composable.ts
import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup() {
    // add vite plugin to patch vuetify theme composable
    const detectorRegexp = /\/vuetify\/lib\/composables\/theme\.m?js/
    const replaceRegexp = /children: styles.value,\s+id:/
    addVitePlugin({
      name: 'vuetify-theme-fix',
      enforce: 'pre',
      transform(code, id) {
        if (detectorRegexp.test(id)) {
          const match = code.match(replaceRegexp)
          if (match?.index) {
            return `${code.slice(0, match.index -1)}textContent${code.slice(match.index + 'children'.length)}`
          }
        }
      }
    })
  }
})
```

or, alternatively, use `unhead` in `legacy` mode; add the following `unhead` configuration to your Nuxt configuration file:

```ts
unhead: {
  legacy: true,
  renderSSRHeadOptions: {
    omitLineBreaks: false
  }
}
```

The issue should be fixed once next Vuetify version released (`> v3.7.16`) (fixed in this PR https://github.com/vuetifyjs/vuetify/pull/21106), then:
- add or update the new Vuetify version to your dependencies
- remove the module or `unhead` configuration
