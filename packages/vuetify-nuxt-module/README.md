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

> 📖 Full [**documentation & guides**](https://nuxt.vuetifyjs.com/)

- 👌 **Zero-Config**: sensible built-in default [Vuetify](https://vuetifyjs.com/) configuration for common use cases
- ⚡ **Fully Tree Shakable**: by default, only the Vuetify components you use are imported
- 🪄 **Auto-Import**: Vuetify components and composables are auto-imported — no manual imports needed
- 🔌 **Extensible**: customize the Vuetify configuration via [Nuxt Runtime Hooks](https://nuxt.com/docs/guide/going-further/hooks#usage-with-plugins), [Nuxt Layers](https://nuxt.com/docs/getting-started/layers#layers), the `vuetify:registerModule` [module hook](https://nuxt.com/docs/guide/going-further/hooks#nuxt-hooks-build-time), or a dedicated `vuetify.config` file
- 💥 **SSR**: automatic SSR detection and configuration, including [HTTP Client Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints)
- ✨ **Configurable Styles**: configure your variables using [Vuetify SASS Variables](https://vuetifyjs.com/en/features/sass-variables/)
- 🛠️ **Directives & Labs**: optional [directives](https://vuetifyjs.com/en/getting-started/installation/#manual-steps) and [labs components](https://vuetifyjs.com/en/labs/introduction/) registration
- 🎭 **Icons**: pure-CSS icons (UnoCSS), [icon fonts](https://vuetifyjs.com/en/features/icon-fonts/) (CDN or local), SVG packs ([@mdi/js](https://www.npmjs.com/package/@mdi/js), [FontAwesome](https://www.npmjs.com/package/@fortawesome/vue-fontawesome)), and [multiple icon sets](https://vuetifyjs.com/en/features/icon-fonts/#multiple-icon-sets)
- 🌍 **I18n**: integrate [@nuxtjs/i18n](https://i18n.nuxtjs.org/) for Vuetify [internationalization](https://vuetifyjs.com/en/features/internationalization/), with auto-imported Vuetify locale messages
- 📆 **Date Components**: use Vuetify [date components](https://vuetifyjs.com/en/features/dates/) via the [@date-io](https://github.com/dmtrKovalenko/date-io#projects) adapters
- 🎨 **Blueprints**: scaffold quickly with [Vuetify Blueprints](https://vuetifyjs.com/en/features/blueprints/)
- 🦾 **Type Strong**: written in [TypeScript](https://www.typescriptlang.org/)

## 📦 Install

> Requires Vite, will not work with Webpack

`vuetify` is a peer dependency (Vuetify 3 or 4) — install it alongside the module:

```bash
npm install -D vuetify
npx nuxt module add vuetify-nuxt-module
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

[MIT](https://github.com/vuetifyjs/nuxt-module/blob/main/LICENSE) License &copy; 2023-PRESENT [Vuetify, LLC](https://github.com/vuetifyjs)
