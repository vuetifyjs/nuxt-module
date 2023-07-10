import type { VuetifyOptions } from 'vuetify'

export type DateAdapter = 'vuetify' | 'date-fns' | 'moment' | 'luxon' | 'dayjs' | 'js-joda' | 'date-fns-jalali' | 'jalaali' | 'hijri' | 'custom'

/**
 * Date configuration.
 */
export interface DateOptions {
  /**
   * The date adapter.
   *
   * The adapter will be picked from the dependencies.
   * When multiple `@date-io/xxxx` libraries installed in your project,
   * you should specify the adapter otherwise an error will be thrown.
   *
   * If you want to use a custom adapter, configure `adapter: 'custom'`,
   * and then add a Nuxt plugin to configure the adapter using `vuetify:configuration` hook.
   *
   * @default 'vuetify'
   */
  adapter?: DateAdapter
  /**
   * Formats.
   */
  formats?: Record<string, string>
  /**
   * Locales.
   *
   * When `@nuxtjs/i18n` Nuxt module is present, this option will be ignored, locales will be extracted from the available locales.
   */
  locale?: Record<string, any>
}

export type IconSetName = 'mdi' | 'fa' | 'fa4' | 'md' | 'mdi-svg' | 'fa-svg' | 'custom'
export type IconFontName = 'mdi' | 'fa' | 'fa4' | 'md'

export interface JSSVGIconSet {
  aliases?: Record<string, string>
}

export interface FontAwesomeSvgIconSet {
  /**
   * The libraries to import and register with the corresponding name.
   *
   * For example, to import free svg icons, `libraries` should be (the default):
   * `libraries: [[false, 'fas', '@fortawesome/free-solid-svg-icons']]
   *
   * Following with the example, the resulting import will be:
   * `import { fas } from '@fortawesome/free-solid-svg-icons'`
   *
   * @default [[false, 'fas', '@fortawesome/free-solid-svg-icons']]
   */
  libraries?: [defaultExport: boolean, name: string, library: string][]
}

export interface FontIconSet {
  name: IconFontName
  /**
   * Use CDN?
   *
   * - mdi: https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons
   * - md:  https://fonts.googleapis.com/css?family=Material+Icons
   * - fa:  https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css
   * - fa4: https://cdn.jsdelivr.net/npm/font-awesome@4.x/css/font-awesome.min.css
   *
   * @default the corresponding CDN for the icon set
   */
  cdn?: string
}

export interface IconsOptions {
  defaultSet: IconSetName
  sets?: IconFontName | IconFontName[] | FontIconSet[]
  svg?: {
    mdi?: JSSVGIconSet
    fa?: FontAwesomeSvgIconSet
  }
}

export type LabComponentName = keyof typeof import('vuetify/labs/components')
export type LabComponents = boolean | LabComponentName | LabComponentName[]
export type DirectiveName = keyof typeof import('vuetify/directives')
export type Directives = boolean | DirectiveName | DirectiveName[]

export interface VOptions extends Partial<Omit<VuetifyOptions, 'ssr' | 'directives' | 'locale' | 'date' | 'icons'>> {
  /**
   * Include the lab components?
   *
   * You can include all lab components configuring `labComponents: true`.
   *
   * You can provide an array with the names of the lab components to include.
   *
   * @see https://vuetifyjs.com/en/labs/introduction/
   *
   * @default false
   */
  labComponents?: LabComponents
  /**
   * Include the directives?
   *
   * You can include all directives configuring `directives: true`.
   *
   * You can provide an array with the names of the directives to include.
   *
   * @default false
   */
  directives?: Directives
  /**
   * Date configuration.
   *
   * When this option is configured, the `v-date-picker` lab component will be included.
   *
   * @see https://vuetifyjs.com/features/dates/
   * @see https://vuetifyjs.com/components/date-pickers/
   */
  date?: DateOptions
  /**
   * Include the icons?
   *
   * By default, `mdi` icons will be used via cdn: https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css.
   *
   * @see https://vuetifyjs.com/en/features/icon-fonts/
   */
  icons?: false | IconsOptions
}

export interface MOptions {
  /**
   * @default true
   */
  importComposables?: boolean
  /**
   * If you are using another composables that collide with the Vuetify ones,
   * enable this flag to prefix them with `V`:
   * - `useLocale` -> `useVLocale`
   * - `useDefaults` -> `useVDefaults`
   * - `useDisplay` -> `useVDisplay`
   * - `useLayout` -> `useVLayout`
   * - `useRtl` -> `useVRtl`
   * - `useTheme` -> `useVTheme`
   *
   * @default false
   */
  prefixComposables?: boolean
  /**
   * Vuetify styles.
   *
   * @see https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
   */
  styles?: true | 'none' | 'expose' | 'sass' | {
    configFile: string
  }
}

export interface ModuleOptions {
  moduleOptions?: MOptions
  /**
   * Vuetify options.
   */
  vuetifyOptions?: VOptions
}

declare module '#app' {
  // TODO: fix this issue upstream in nuxt/module-builder
  interface NuxtApp {
    $vuetify: ReturnType<typeof import('vuetify')['createVuetify']>
  }
  interface RuntimeNuxtHooks {
    'vuetify:configuration': (options: {
      isDev: boolean
      vuetifyOptions: VuetifyOptions
    }) => Promise<void> | void
  }
}
