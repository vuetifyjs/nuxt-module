# Date Support

To use Vuetify components [that require date functionality](https://vuetifyjs.com/en/features/dates/), you can install and configure one of the [@date-io](https://github.com/dmtrKovalenko/date-io#projects) adapters.

Here are the steps to set up date functionality:
- Install one of the [@date-io](https://github.com/dmtrKovalenko/date-io#projects) adapters (optional).
- Configure the date entry in your Vuetify configuration:


```ts
vuetifyOptions: {
  date: {
    adapter: 'vuetify' // 'vuetify' | 'date-fns' | 'moment' | 'luxon' | 'dayjs' | 'js-joda' | 'date-fns-jalali' | 'jalaali' | 'hijri' | 'custom'
  }
}
```

If the `@nuxtjs/i18n` module is installed, the `vuetifyOptions.date.locale` and `vuetifyOptions.date.rtl` options will be automatically configured. Please note that any manually configured `locale` entry will be ignored in this case.

If you prefer to use a custom date adapter, you can set `vuetifyOptions.date.adapter = 'custom'` and then follow these steps:
- Add a Nuxt Plugin and use the `vuetify:configuration` hook to configure your Vuetify options.
- Import the `virtual:vuetify-date-configuration` module to access the configuration:
  
  
```ts
import { adapter, dateConfiguration, i18n } from 'virtual:vuetify-date-configuration'
```

Check out [vuetify-date](https://github.com/vuetifyjs/nuxt-module/blob/main/src/runtime/plugins/vuetify-date.ts) plugin and the [date module](https://github.com/vuetifyjs/nuxt-module/blob/main/src/runtime/plugins/date.ts) for an example of a custom date adapter and how to access to the configuration.
