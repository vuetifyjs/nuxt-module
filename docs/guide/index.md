# Getting Started

## Installation

> Requires Vite, will not work with Webpack

::: code-group
  ```bash [pnpm]
  pnpm add -D vuetify-nuxt-module
  ```
  ```bash [yarn]
  yarn add -D vuetify-nuxt-module
  ```
  ```bash [npm]
  npm install -D vuetify-nuxt-module
  ```
:::

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/userquin/vuetify-nuxt-module)

## Usage

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

