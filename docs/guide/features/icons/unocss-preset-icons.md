# UnoCSS Preset Icons

You can use Pure CSS Icons via [UnoCSS Preset Icons](https://unocss.dev/presets/icons). To get started, install the [UnoCSS Nuxt Module](https://unocss.dev/integrations/nuxt) and enable [UnoCSS Preset Icons](https://unocss.dev/presets/icons).

Once the UnoCSS Nuxt Module and UnoCSS Preset Icons are installed and configured, you need to install the icon collections you wish to use.

UnoCSS Preset Icons use [Iconify](https://iconify.design/) as their icon data source. You need to install the corresponding icon set in `devDependencies` following the `@iconify-json/*` pattern. For example, `@iconify-json/mdi` for [Material Design Icons](https://materialdesignicons.com/), `@iconify-json/tabler` for [Tabler](https://tabler-icons.io/). You can refer to [Icônes](https://icones.js.org/) or [Iconify](https://icon-sets.iconify.design/) for all available collections.

## Using UnoCSS Preset Icons

UnoCSS Preset Icons allows you to use any icon via `v-icon`. You need to register the `mdi` icon set to allow Vuetify to configure the icon via the `class` attribute:
```vue
<v-icon class="i-mdi:home"></v-icon>
```

or in any Vuetify component that allows icon configuration:
```vue
<v-checkbox true-icon="i-mdi:account"></v-checkbox>
```

You can also use any icon directly in your HTML markup:

```html
<div class="i-mdi:home"></div>
```

## `unocss-mdi` icon set

This module provides a new icon set for Vuetify called `unocss-mdi`. The `unocss-mdi` icon set uses the [@iconify-json/mdi](https://icon-sets.iconify.design/mdi/) collection.

In order to use the `unocss-mdi` icon set, you will need to:
- Install the `@iconify-json/mdi` package as a dev dependency.
- Install the `@unocss/nuxt` package as a dev dependency and enable UnoCSS Preset Icons: [UnoCSS Nuxt Integration](https://unocss.dev/integrations/nuxt).

To configure UnoCSS, add a `unocss.config.ts` file to your project root folder and register the icons preset:
::: code-group

```ts [unocss.config.ts]
import { defineConfig, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetIcons({
      scale: 1.2, // scale the icons
    }),
  ]
})
```

:::

In your Nuxt configuration file, add the UnoCSS Nuxt module and configure the `unocss-mdi` icon set:
::: code-group

```ts [nuxt.config.ts]
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@unocss/nuxt', 'vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'unocss-mdi'
      }
    }
  }
})
```

:::

If you are not using the default UnoCSS Preset Icons [prefix](https://unocss.dev/presets/icons#prefix), you can configure it using the `icons.unocssIconPrefix` option in your Nuxt configuration file:
::: code-group

```ts [nuxt.config.ts]
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@unocss/nuxt', 'vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'unocss-mdi',
        unocssIconPrefix: 'myprefix-'
      }
    }
  }
})
```

:::

If you want to change the default icons in the `unocss-mdi` icon set, you can override any icon using the `icons.unocssIcons` option in your Vuetify options. This way, you don't need to write a custom plugin. Remember to add the prefix and the collection name to the icon name:
::: code-group

```ts [nuxt.config.ts]
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@unocss/nuxt', 'vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'unocss-mdi',
        unocssIcons: {
          // default is i-mdi:close-circle
          delete: 'i-mdi:close-circle-outline',
          // even from another collection, default is i-mdi:chevron-up
          collapse: 'i-tabler:chevron-up'
        }
      }
    }
  }
})
```

:::

You can also add additional icons using the `icons.unocssAdditionalIcons` option in your Vuetify options, don't forget to add the prefix and the collection name to the icon name. Additional icons will override the default icons, you should try to avoid overriding them using this option.

## Adding a new Vuetify icon set

This module provides the `mdi` icons via `unocss-mdi` icon set. `unocss-mdi` icon set will use the [@iconify-json/mdi](https://icon-sets.iconify.design/mdi/) collection, but you can use another icon set by installing the corresponding `@iconify-json/*` packages and configuring Vuetify to use it:
- configure the default set to use `custom`: `vuetify.vuetifyOptions.icons.defaultSet = 'custom'` in your nuxt config file
- create a new Nuxt Plugin to configure the new icon set
- add `@unocss-include` comment to the plugin file: this comment will be used by UnoCSS to include the icons
- register `vuetify-configuration` hook in your plugin
- register the new icon set aliases in the `vuetify-configuration` hook

This is a Nuxt Plugin example using [@iconify-json/mdi](https://icon-sets.iconify.design/mdi/) collection (manual `unocss-mdi` icon set replacement), replace the icons using your new collection:
```ts
// @unocss-include DON'T FORGET TO ADD THIS COMMENT
import { mdi } from 'vuetify/iconsets/mdi'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:configuration', ({ vuetifyOptions }) => {
    vuetifyOptions.icons = {
      defaultSet: 'mdi',
      sets: { mdi },
      aliases: {
        collapse: 'i-mdi:chevron-up',
        complete: 'i-mdi:check',
        cancel: 'i-mdi:close-circle',
        close: 'i-mdi:close',
        delete: 'i-mdi:close-circle',
        // delete (e.g. v-chip close)
        clear: 'i-mdi:close-circle',
        success: 'i-mdi:check-circle',
        info: 'i-mdi:information',
        warning: 'i-mdi:alert-circle',
        error: 'i-mdi:close-circle',
        prev: 'i-mdi:chevron-left',
        next: 'i-mdi:chevron-right',
        checkboxOn: 'i-mdi:checkbox-marked',
        checkboxOff: 'i-mdi:checkbox-blank-outline',
        checkboxIndeterminate: 'i-mdi:minus-box',
        delimiter: 'i-mdi:circle',
        // for carousel
        sortAsc: 'i-mdi:arrow-up',
        sortDesc: 'i-mdi:arrow-down',
        expand: 'i-mdi:chevron-down',
        menu: 'i-mdi:menu',
        subgroup: 'i-mdi:menu-down',
        dropdown: 'i-mdi:menu-down',
        radioOn: 'i-mdi:radiobox-marked',
        radioOff: 'i-mdi:radiobox-blank',
        edit: 'i-mdi:pencil',
        ratingEmpty: 'i-mdi:star-outline',
        ratingFull: 'i-mdi:star',
        ratingHalf: 'i-mdi:star-half-full',
        loading: 'i-mdi:cached',
        first: 'i-mdi:page-first',
        last: 'i-mdi:page-last',
        unfold: 'i-mdi:unfold-more-horizontal',
        file: 'i-mdi:paperclip',
        plus: 'i-mdi:plus',
        minus: 'i-mdi:minus',
        calendar: 'i-mdi:calendar'
      }
    }
  })
})
```
