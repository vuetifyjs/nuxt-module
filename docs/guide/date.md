# Date Support

:::warning
Right now you can only use Vuetify adapter, there is a bug and will not work, I'm working on it: https://github.com/userquin/vuetify-nuxt-module/pull/9#issuecomment-1620023814.
:::

Use Vuetify components [that require date functionality](https://vuetifyjs.com/en/features/dates/) installing and configuring one of the [@date-io](https://github.com/dmtrKovalenko/date-io#projects) adapters.

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

If you also have `@nuxtjs/i18n` module installed, `vuetifyOptions.date.locale` and `vuetifyOptions.date.rtl` options will be automatically configured, beware, the configured `locale` entry will be ignored.

If you want to use a custom date adapter, you can configure it using `vuetifyOptions.date.adapter = 'custom'`, and then:
- add a Nuxt Plugin and add the `vuetify:configuration` hook to configure your Vuetify options
- you can import the `virtual:vuetify-date-configuration` module, you will have access to the configuration:
  ```ts
  import { adapter, dateConfiguration, i18n } from 'virtual:vuetify-date-configuration'
  ```

Check out [vuetify-date](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/runtime/plugins/vuetify-date.ts) plugin and the [date module](https://github.com/userquin/vuetify-nuxt-module/blob/main/src/runtime/plugins/date.ts) for an example of a custom date adapter and how to access to the configuration.
