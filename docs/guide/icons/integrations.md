# Integrations

Vuetify supports custom icon sets using Vue icons libraries. This section is about how to integrate the following icon libraries with `vuetify-nuxt-module`:
- [unplugin-icons/nuxt](https://github.com/unplugin/unplugin-icons)
- [Iconify for Vue](https://iconify.design/docs/icon-components/vue/)
- [Nuxt Icon](https://github.com/nuxt-modules/icon)
- [Vue Phosphor Icons](https://github.com/phosphor-icons/vue)

Please refer to the Vuetify documentation for more information about [custom icon sets](https://vuetifyjs.com/en/features/icon-fonts/#creating-a-custom-icon-set), all the examples in this page using a custom icon set implementation.

Once the custom icon set is implemented, you need to configure `vuetify-nuxt-module` to use it:
- add `icons.defaultSet = 'custom'` in your `vuetify.config.ts` file or in the `vuetifyOptions` object in your `nuxt.config.ts` file
- register the custom icon set in the Vuetify options via a new Nuxt plugin using the `vuetify:before-create` hook
- register the custom icon component in the Vue application via previous Nuxt plugin using `vuetify:ready` hook: this step is optional, only required if you want to use the custom icon component in your application

If you want to use another icon set library, you should change the corresponding icon set implementation in the examples below: `unplugin-icons`, Iconify Vue and Nuxt Icon using material design icons from Iconify icons.

You can also use multiple icon sets, check [multiple-icon-sets](/guide/icons/#multiple-icon-sets) and [Vuetify documentation](https://vuetifyjs.com/en/features/icon-fonts/#multiple-icon-sets).

## unplugin-icons/nuxt

You can check this [repo using material design icons](https://github.com/userquin/vuetify-nuxt-unplugin-icons-integration), using `unplugin-icons/nuxt` Nuxt module:
- default icon set in [nuxt.config.ts](https://github.com/userquin/vuetify-nuxt-unplugin-icons-integration/blob/main/nuxt.config.ts) configuration file
- custom icon set in [unplugin-icons/index.ts](https://github.com/userquin/vuetify-nuxt-unplugin-icons-integration/blob/main/unplugin-icons/index.ts) icon set
- custom icon set registration in [plugins/custom-icons.ts](https://github.com/userquin/vuetify-nuxt-unplugin-icons-integration/blob/main/plugins/custom-icons.ts) plugin

You can run this repo in Stackblitz, check the [README file](https://github.com/userquin/vuetify-nuxt-unplugin-icons-integration).

::: warning
Not all icons have been included, you will need to review the [unplugin-icons/index.ts](https://github.com/userquin/vuetify-nuxt-unplugin-icons-integration/blob/main/unplugin-icons/index.ts) file including the icons you want to use.
:::

## Iconify for Vue

You can check an [example in Stackblitz using material design icons](https://stackblitz.com/edit/nuxt-starter-al4k5x):
- default icon set in [vuetify.config.ts](https://stackblitz.com/edit/nuxt-starter-al4k5x?file=vuetify.config.ts) configuration file
- custom icon set in [iconify/index.ts](https://stackblitz.com/edit/nuxt-starter-al4k5x?file=iconify%2Findex.ts) icon set
- custom icon set registration in [plugins/custom-icons.ts](https://stackblitz.com/edit/nuxt-starter-al4k5x?file=plugins%2Fcustom-icons.ts) plugin
- custom icon component registration in [plugins/custom-icons.ts](https://stackblitz.com/edit/nuxt-starter-al4k5x?file=plugins%2Fcustom-icons.ts) plugin

::: warning
Not all icons have been included, you will need to review the [iconify/index.ts](https://stackblitz.com/edit/nuxt-starter-al4k5x?file=iconify%2Findex.ts) file including the icons you want to use.

Iconify for Vue is client side only, the icons will be rendered only on the client (you will see the icons loaded once the component requests them to the [Iconify API](https://iconify.design/docs/api/)).
:::

## Nuxt Icon

You can check this [repo using material design icons](https://github.com/userquin/vuetify-nuxt-icon-integration):
- default icon set in [nuxt.config.ts](https://github.com/userquin/vuetify-nuxt-icon-integration/blob/main/nuxt.config.ts) configuration file
- custom icon set in [nuxt-icon-set/common.ts](https://github.com/userquin/vuetify-nuxt-icon-integration/blob/main/nuxt-icon-set/common.ts) icon set
- custom icon set registration in [plugins/custom-icons.ts](https://github.com/userquin/vuetify-nuxt-icon-integration/blob/main/plugins/custom-icons.ts) plugin
- you can choose between `Icon` or `IconCSS`, check previous plugin file

You can run this repo in Stackblitz, check the [README file](https://github.com/userquin/vuetify-nuxt-icon-integration).

## Vue Phosphor Icons

You can check an [example in Stackblitz](https://stackblitz.com/edit/nuxt-starter-cgbvrr):
- default icon set in [vuetify.config.ts](https://stackblitz.com/edit/nuxt-starter-cgbvrr?file=vuetify.config.ts) configuration file
- custom icon set in [phosphor/index.ts](https://stackblitz.com/edit/nuxt-starter-cgbvrr?file=phosphor%2Findex.ts) icon set
- custom icon set registration in [plugins/custom-icons.ts](https://stackblitz.com/edit/nuxt-starter-cgbvrr?file=plugins%2Fcustom-icons.ts) plugin
- custom icon component registration in [plugins/custom-icons.ts](https://stackblitz.com/edit/nuxt-starter-cgbvrr?file=plugins%2Fcustom-icons.ts) plugin

::: warning
Not all icons have been included, you will need to review the [phosphor/index.ts](https://stackblitz.com/edit/nuxt-starter-cgbvrr?file=phosphor%2Findex.ts) file including the icons you want to use.
:::
