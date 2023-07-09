<p align='center'>
<img src='https://github.com/userquin/vuetify-nuxt-module/raw/main/hero.svg' alt="vuetify-nuxt-module - Zero-config Nuxt module for Vuetify"><br>
Zero-config Nuxt module for Vuetify
</p>

<p align='center'>
<a href='https://www.npmjs.com/package/vuetify-nuxt-module' target="__blank">
<img src='https://img.shields.io/npm/v/vuetify-nuxt-module?color=33A6B8&label=' alt="NPM version">
</a>
<a href="https://www.npmjs.com/package/vuetify-nuxt-module" target="__blank">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/vuetify-nuxt-module?color=476582&label=">
</a>
<!--
<a href="https://vite-pwa-org.netlify.app/frameworks/nuxt" target="__blank">
    <img src="https://img.shields.io/static/v1?label=&message=docs%20%26%20guides&color=2e859c" alt="Docs & Guides">
</a>
-->
<br>
<a href="https://github.com/userquin/vuetify-nuxt-module" target="__blank">
<img alt="GitHub stars" src="https://img.shields.io/github/stars/userquin/vuetify-nuxt-module?style=social">
</a>
</p>

<br>

## 🚀 Features

- 📖 [**Documentation & guides**](README.md#-features) (WIP)
- 👌 **Zero-Config**: sensible built-in default [Vuetify](https://vuetifyjs.com/) configuration for common use cases
- 🔩 **Extensible**: expose the ability to customize the Vuetify configuration via [Nuxt Plugin Hooks](https://nuxt.com/docs/guide/going-further/hooks#usage-with-plugins)
- ⚡ **Fully Tree Shakable**: by default, only the needed Vuetify components are imported
- 🛠️ **Versatile**: custom Vuetify [directives](https://vuetifyjs.com/en/getting-started/installation/#manual-steps) and [labs components](https://vuetifyjs.com/en/labs/introduction/) registration
- ✨ **Configurable Styles**: configure your variables using [Vuetify SASS Variables](https://vuetifyjs.com/en/features/sass-variables/) 
- 💥 **SSR**: automatic SSR detection and configuration
- 😃 **Icon Fonts**: configure the [icon font](https://vuetifyjs.com/en/features/icon-fonts/) you want to use, the module will automatically import it for you using CDN or local dependencies
- 🎨 **SVG Icons**: ready to use [@mdi/js](https://www.npmjs.com/package/@mdi/js) and [@fortawesome/vue-fontawesome](https://www.npmjs.com/package/@fortawesome/vue-fontawesome) SVG icons packs
- 📦 **Multiple Icon Sets**: register [multiple icon sets](https://vuetifyjs.com/en/features/icon-fonts/#multiple-icon-sets)
- 🌍 **I18n Ready**: install [@nuxtjs/i18n](https://v8.i18n.nuxtjs.org/) Nuxt module, and you're ready to use Vuetify [internationalization](https://vuetifyjs.com/en/features/internationalization/) features
- 📆 **Date Components**: use Vuetify components [that require date functionality](https://vuetifyjs.com/en/features/dates/) installing and configuring one of the [@date-io](https://github.com/dmtrKovalenko/date-io#projects) adapters
- 🦾 **Type Strong**: written in [TypeScript](https://www.typescriptlang.org/)

## 📦 Install

> Requires Vite, will not work with Webpack

```bash
npm i vuetify-nuxt-module -D 

# yarn 
yarn add vuetify-nuxt-module -D

# pnpm 
pnpm add vuetify-nuxt-module -D
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/userquin/vuetify-nuxt-module)

## 🦄 Usage

> `vuetify-nuxt-module` is strongly opinionated and has a built-in default configuration out of the box. You can use it without any configuration, and it will work for most use cases.

Add `vuetify-nuxt-module` module to `nuxt.config.ts` and configure it:

```ts
// nuxt.config.ts
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

## 😃 Font Icons

This module supports the following font icons libraries:
- [Material Design Icons](https://materialdesignicons.com/)
- [Material Icons](https://fonts.google.com/icons)
- [Font Awesome 4](https://fontawesome.com/v4.7.0/)
- [Font Awesome 5](https://fontawesome.com/)

By default, the module will use the `mdi` font icon library. You can change it by setting the `defaultSet` option to:
- `mdi` for [Material Design Icons](https://materialdesignicons.com/)
- `md` for [Material Icons](https://fonts.google.com/icons)
- `fa4` for [Font Awesome 4](https://fontawesome.com/v4.7.0/)
- `fa` for [Font Awesome 5](https://fontawesome.com)

To configure a font icon you only need to specify the default set:
```ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi'
    }
  }
}
```

The module will use the CDN version of the font icon. If you want to use the local version, you only need to install the corresponding dependency, the module will auto-detect it and will switch to register the font to use the local version.

The CDN used for each font icon library, you can use the `cdn` option to change it:
- [CDN for Material Design Icons (mdi)](https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css)
- [CDN for Material Icons (md)](https://fonts.googleapis.com/css?family=Material+Icons)
- [CDN for Font Awesome 4 (fa4)](https://cdn.jsdelivr.net/npm/font-awesome@4.x/css/font-awesome.min.css)
- [CDN for Font Awesome 5 (fa)](https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css)

To change the CDN for a font icon library you only need to specify the `cdn` option:
```ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi'
      sets: [{
        name: 'mdi',
        cdn: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons'  
      }]
    }
  }
}
```

## 🎨 SVG Icons

This module supports the following SVG icon libraries:
- [@mdi/js](https://www.npmjs.com/package/@mdi/js)
- [@fortawesome/fontawesome-svg-core](https://www.npmjs.com/package/@fortawesome/fontawesome-svg-core)

### mdi-svg

You only need to add `@mdi/js` dependency to your project and configure the default set:
```ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi-svg'
    }
  }
}
```

You can also add icon aliases:
```ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi-svg',
      svg: {
        mdi: {
          aliases: {
            account: 'mdiAccount'
          }  
        }
      }
    }
  }
}
```

### fa-svg

You only need to add `@fortawesome/fontawesome-svg-core`, `@fortawesome/vue-fontawesome`, and `@fortawesome/free-solid-svg-icons` dependencies to your project and configure the default set:
```ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'fa-svg'
    }
  }
}
```

You can also add more libraries and install them in your project, the module will register them for you (this is the default configuration using the above configuration):
```ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'fa-svg',
      svg: {
        fa: {
          libraries: [/* default export? */ false, /* export name */ 'fas', /* import */ '@fortawesome/free-solid-svg-icons']
        }
      }
    }
  } 
}
```

## 📦 Multiple Icon Sets

You can register multiple icons sets adding them to the sets array, don't forget to add the default set, otherwise 'mdi' will be used:
```ts
vuetify: {
  vuetifyOptions: {
    icons: {
      defaultSet: 'mdi'
      sets: [{ name: 'mdi' }, { name: 'fa' }]
    }
  }
}
```

## 🌍 I18n support

> Requires latest [@nuxtjs/i18n](https://v8.i18n.nuxtjs.org/) Nuxt module: `8.0.0.beta.13`.

You can check the playground folder, you can run it using single or multiple json files per locale:
- for single file per locale: run from root folder `pnpm install && nr dev:prepare && nr dev`
- for multiple files per locale: run from root folder `pnpm install && nr dev:prepare:multiple-json && nr dev:multiple-json`

## 📆 Date components support

Right now you can only use Vuetify adapter, there is a bug and will not work, I'm working on it: https://github.com/userquin/vuetify-nuxt-module/pull/9#issuecomment-1620023814.

To use Vuetify components [that require date functionality](https://vuetifyjs.com/en/features/dates/):
- install one of the [@date-io](https://github.com/dmtrKovalenko/date-io#projects) adapters (optional)
- configure the date entry in your Vuetify configuration:
  ```ts
  vuetifyOptions: {
    date: {
      adapter: 'vuetify' // 'vuetify' | 'date-fns' | 'moment' | 'luxon' | 'dayjs' | 'js-joda' | 'date-fns-jalali' | 'jalaali' | 'hijri' | 'custom'
    }  
  }
  ```

If you also have `@nuxtjs/i18n` module installed, `vuetifyOptions.date.locale` will be automatically configured, beware, the configured `locale` entry will be ignored.

If you want to use a custom date adapter, you can configure it using `vuetifyOptions.date.adapter = 'custom'`, and then:
- add a Nuxt Plugin and add the `vuetify:configuration` hook to configure your Vuetify options
- you can import the `virtual:vuetify-date-configuration` module, you will have access to the configuration:
  ```ts
  import { adapter, dateConfiguration, i18n } from 'virtual:vuetify-date-configuration'
  ```

Check out [vuetify-date](./src/runtime/plugins/vuetify-date.mts) plugin for an example of a custom date adapter and how to access to the configuration.

## 👀 Full config

Check out the type declaration [src/types.ts](./src/types.ts).

The virtual modules can be found in [configuration.dts](./configuration.d.ts) file.

## 📄 License

[MIT](./LICENSE) License &copy; 2023-PRESENT [Joaquín Sánchez](https://github.com/userquin)
