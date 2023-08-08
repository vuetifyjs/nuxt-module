# Vuetify Blueprints

The module supports Vuetify Blueprints, just add it to the `vuetifyOptions.blueprint` module option, but with some limitations:
- `ssr` will be ignored, this flag can be only configured internally by the module via the Nuxt ssr option
- `components` will be ignored, configure them using the `vuetifyOptions.components` module option
- `directives` will be ignored, configure them using the `vuetifyOptions.directives` module option
- `locale` will be ignored, configure it using the `vuetifyOptions.locale` module option
- `date` will be ignored, configure it using the `vuetifyOptions.date` module option
- `icons` will be ignored, configure it using the `vuetifyOptions.icons` module option

