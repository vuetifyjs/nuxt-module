# UnoCSS Preset Icons

You can use Pure CSS SVG Icons via [UnoCSS Preset Icons](https://unocss.dev/presets/icons).
- [UnoCSS Nuxt Module](https://unocss.dev/integrations/nuxt)
- [UnoCSS Preset Icons](https://unocss.dev/presets/icons)

Once UnoCSS Nuxt Module and the UnoCSS Preset Icons installed and configured, you need to install the icons collections you want to use.

UnoCSS Preset Icons use [Iconify](https://iconify.design/) as their data source of icons. You need to install the corresponding icon set in `devDependencies` by following the `@iconify-json/*` pattern. For example, `@iconify-json/mdi` for [Material Design Icons](https://materialdesignicons.com/), `@iconify-json/tabler` for [Tabler](https://tabler-icons.io/). You can refer to [Icônes](https://icones.js.org/) or [Iconify](https://icon-sets.iconify.design/) for all available collections.

## Using UnoCSS Preset Icons

UnoCSS Preset Icons will allow you to use any icon in any component or any html markup, you only need to register the `mdi` icon set to allow Vuetify to configure the icon via `class`:
```vue
<v-icon class="i-mdi:home"></v-icon>
```

or directly in your html markup:

```html
<div class="i-mdi:home"></div>
```

## `unocss-mdi` icon set

This module provides a new icon set for Vuetify: the `unocss-mdi` icon set. The `unocss-mdi` icon set will use the [@iconify-json/mdi](https://icon-sets.iconify.design/mdi/) collection.

You can configure it using the default set:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'unocss-mdi'
      }
    }
  }
})
```

If you're not using the default UnoCSS Preset Icons [prefix](https://unocss.dev/presets/icons#prefix), you can configure it using the `icons.unocssIconPrefix` option in your Nuxt configuration file:
```ts
// Nuxt config file
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
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

## Using another icon set

This module provides the `mdi` icons via `unocss-mdi` icon set. `unocss-mdi` icon set will use the [@iconify-json/mdi](https://icon-sets.iconify.design/mdi/) collection, but you can use another icon set by installing the corresponding `@iconify-json/*` package and configuring Vuetify to use it:
- configure the default set to use `custom`: `vuetify.vuetifyOptions.icons.defaultSet = 'custom'` in your nuxt config file
- create a new Nuxt Plugin to configure the new icon set
- add `@unocss-include` comment to the plugin file: this comment will be used by UnoCSS to include the icons
- register `vuetify-configuration` hook in your plugin
- register the new icon set aliases in the `vuetify-configuration` hook

This is a Nuxt Plugin example using [@iconify-json/mdi](https://icon-sets.iconify.design/mdi/) collection (manual `unocss-mdi` icon set replacement), replace the icons using your new collection:
```ts
// @unocss-include DON'T FORGET TO ADD THIS COMMENT
import { mdi } from 'vuetify/lib/iconsets/mdi'
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
