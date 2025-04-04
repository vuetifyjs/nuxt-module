# Globals

The module will enable automatic tree shaking for Vuetify components.

You don't need to install any Vuetify Vite Plugin (the module will throw an error if any Vuetify Vite Plugin is installed in your Nuxt configuration):
- the module will provide auto-import support via `vuetify/dist/json/importMap.json` json file and Nuxt `components:extend` hook.
- the module will register a custom Vite Plugin for Vuetify styles: it is just a copy from the original Vuetify Vite Styles Plugin, changing some virtual names mappings and handling SSR flags.
- from version `v0.18.6`, the module supports [Component Labs](https://vuetifyjs.com/en/labs/introduction/) auto-import.

You can register the following Vuetify components globally:
- [Global Components](/guide/globals/global-components)
- [Directives](/guide/globals/directives)
- [Lab Components](/guide/globals/lab-components)
