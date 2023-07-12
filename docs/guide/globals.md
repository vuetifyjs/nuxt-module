# Global Components, Directives, and Lab Components

The module will enable automatic tree shaking for Vuetify components.

:::info
You don't need to install any Vuetify Vite Plugin (the module will throw an error if any Vuetify Vite Plugin is installed in your Nuxt configuration):
- the module will provide auto-import support via `vuetify/dist/json/importMap.json` json file and Nuxt `components:extend` hook.
- the module will register a custom Vite Plugin for Vuetify styles: it is just a copy from the original Vuetify Vite Styles Plugin, changing some virtual names mappings and handling SSR flags.
:::

## Global Components

If you need to add some global component, use `vuetifyOptions.components` module option, it has been declared properly to have better DX.

Check the [components definition](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts#L80-L81).

You can also provide [Aliasing & Virtual Components](https://vuetifyjs.com/en/features/aliasing/#virtual-component-defaults) via `vuetifyOptions.aliases` module option to register components with a different name, only available for global components. The components require to be registered globally.

## Directives

By default, the module will not register any Vuetify directive. If you need to register some directive, use `vuetifyOptions.directives` module option, it has been declared properly to have better DX.

You can register all the directives or only the ones you need: check the [directives definition](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts#L82-L83).

## Lab Components

The module provides support to use Vuetify [labs components](https://vuetifyjs.com/en/labs/introduction/) via `vuetifyOptions.labsComponents` module option, it has been declared properly to have better DX.

You can register all the labs components or only the ones you need: check the [labsComponent definition](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts#L84-L85).
