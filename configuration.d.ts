declare module 'virtual:vuetify-configuration' {
  import type { VuetifyOptions } from 'vuetify';

  export const isDev: boolean
  export const vuetifyConfiguration: () => VuetifyOptions
}

declare module '#app' {
  import type { VuetifyOptions } from 'vuetify';
  interface RuntimeNuxtHooks {
    'vuetify:configuration': (vuetifyOptions: VuetifyOptions) => void
  }
}
