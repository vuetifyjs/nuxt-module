<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/vuetifyjs/nuxt-module/raw/main/hero-dark.svg" />
  <img alt="vuetify-nuxt-module - Zero-config Nuxt Module for Vuetify" src='https://github.com/vuetifyjs/nuxt-module/raw/main/hero.svg' alt="vuetify-nuxt-module - Zero-config Nuxt Module for Vuetify"><br>
</picture>
<p>Zero-config Nuxt Module for Vuetify</p>
</div>

<p align='center'>
<a href='https://www.npmjs.com/package/vuetify-nuxt-module' target="__blank">
<img src='https://img.shields.io/npm/v/vuetify-nuxt-module?color=33A6B8&label=' alt="NPM version">
</a>
<a href="https://www.npmjs.com/package/vuetify-nuxt-module" target="__blank">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/vuetify-nuxt-module?color=476582&label=">
</a>
<a href="https://nuxt.vuetifyjs.com/" target="__blank">
    <img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20guides&color=2e859c" alt="Docs & Guides">
</a>
<br>
<a href="https://github.com/vuetifyjs/nuxt-module" target="__blank">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/userquin/vuetify-nuxt-module?style=social">
</a>
</p>

<br>

## 🚀 Features

- 📖 [**Documentation & guides**](https://nuxt.vuetifyjs.com/)
- 👌 **Zero-Config**: sensible built-in default [Vuetify](https://vuetifyjs.com/) configuration for common use cases
- 🔌 **Extensible**: expose the ability to customize the Vuetify configuration via [Nuxt Runtime Hooks](https://nuxt.com/docs/guide/going-further/hooks#usage-with-plugins)
- ⚡ **Fully Tree Shakable**: by default, only the needed Vuetify components are imported
- 🛠️ **Versatile**: custom Vuetify [directives](https://vuetifyjs.com/en/getting-started/installation/#manual-steps) and [labs components](https://vuetifyjs.com/en/labs/introduction/) registration
- ✨ **Configurable Styles**: configure your variables using [Vuetify SASS Variables](https://vuetifyjs.com/en/features/sass-variables/) 
- 💥 **SSR**: automatic SSR detection and configuration including [HTTP Client hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints)
- 🔩 **Nuxt Layers and Module Hooks**: load your Vuetify configuration using [Nuxt Layers](https://nuxt.com/docs/getting-started/layers#layers) or using a custom module via `vuetify:registerModule` [Nuxt Module Hook](https://nuxt.com/docs/guide/going-further/hooks#nuxt-hooks-build-time)
- 📥 **Vuetify Configuration File**: configure your Vuetify options using a custom `vuetify.config` file, no dev server restart needed
- 🔥 **Pure CSS Icons**: no more font/js icons, use the new `unocss-mdi` icon set or build your own with UnoCSS Preset Icons
- 😃 **Icon Fonts**: configure the [icon font](https://vuetifyjs.com/en/features/icon-fonts/) you want to use, the module will automatically import it for you using CDN or local dependencies
- 🎭 **SVG Icons**: ready to use [@mdi/js](https://www.npmjs.com/package/@mdi/js) and [@fortawesome/vue-fontawesome](https://www.npmjs.com/package/@fortawesome/vue-fontawesome) SVG icons packs
- 📦 **Multiple Icon Sets**: register [multiple icon sets](https://vuetifyjs.com/en/features/icon-fonts/#multiple-icon-sets)
- 🌍 **I18n Ready**: install [@nuxtjs/i18n](https://i18n.nuxtjs.org/) Nuxt module, and you're ready to use Vuetify [internationalization](https://vuetifyjs.com/en/features/internationalization/) features
- 📆 **Date Components**: use Vuetify components [that require date functionality](https://vuetifyjs.com/en/features/dates/) installing and configuring one of the [@date-io](https://github.com/dmtrKovalenko/date-io#projects) adapters
- 💬 **Auto-Import Vuetify Locale Messages**: add [Vuetify Locale Messages](https://vuetifyjs.com/en/features/internationalization/#getting-started) adding just the locales you want to use, no more imports needed
- ⚙️ **Auto-Import Vuetify Composables**: you don't need to import Vuetify composables manually, they are automatically imported for you
- 🎨 **Vuetify Blueprints**: use [Vuetify Blueprints](https://vuetifyjs.com/en/features/blueprints/) to quickly scaffold components
- 👀 **Nuxt DevTools**: ready to inspect your Vuetify styles with the [Nuxt DevTools](https://github.com/nuxt/devtools) inspector
- 🦾 **Type Strong**: written in [TypeScript](https://www.typescriptlang.org/)

## 📦 Install

> Requires Vite, will not work with Webpack

```bash
npx nuxi@latest module add vuetify-nuxt-module
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/userquin/vuetify-nuxt-module)

## 🦄 Usage

> `vuetify-nuxt-module` is strongly opinionated and has a built-in default configuration out of the box. You can use it without any configuration, and it will work for most use cases.

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

Read the [📖 documentation](https://nuxt.vuetifyjs.com/) for a complete guide on how to configure and use this module.

## 👀 Full config

Check out the [types](https://github.com/vuetifyjs/nuxt-module/blob/main/src/types.ts).

The virtual modules can be found in [configuration.d.ts](https://github.com/vuetifyjs/nuxt-module/blob/main/configuration.d.ts) file.

## 📄 License

[MIT](https://github.com/vuetifyjs/nuxt-module/blob/main/LICENSE) License &copy; 2023-PRESENT [Joaquín Sánchez](https://github.com/userquin)
