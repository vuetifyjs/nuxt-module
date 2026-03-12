# Vuetify Blueprints

The module supports Vuetify Blueprints. You can enable them by adding the `vuetifyOptions.blueprint` module option. Please note the following limitations:
- The `ssr` option is ignored; this flag is managed internally by the module based on the Nuxt `ssr` option.
- The `components` option is ignored; please configure components using the `vuetifyOptions.components` module option.
- The `directives` option is ignored; please configure directives using the `vuetifyOptions.directives` module option.
- The `locale` option is ignored; please configure it using the `vuetifyOptions.locale` module option.
- The `date` option is ignored; please configure it using the `vuetifyOptions.date` module option.
- The `icons` option is ignored; please configure it using the `vuetifyOptions.icons` module option.
- The `aliases` option only supports defining aliases with [strings](/guide/features/globals/global-components.html#aliasing-global-component). Using a component type will result in an error (`Cannot start nuxt: Unexpected token '.'`).
