# Global Components

If you need to add some global component, use `vuetifyOptions.components` module option, it has been declared properly to have better DX.

Check the [components definition](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/types.ts#L80-L81).

You can also provide [Aliasing & Virtual Components](https://vuetifyjs.com/en/features/aliasing/#virtual-component-defaults) via `vuetifyOptions.aliases` module option to register components with a different name, only available for global components. The components require to be registered globally.
