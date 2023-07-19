import type { LocaleOptions, RtlOptions, VuetifyOptions } from 'vuetify'

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

export type IconSetName = 'mdi' | 'fa' | 'fa4' | 'md' | 'mdi-svg' | 'fa-svg' | 'unocss-mdi' | 'custom'
export type IconFontName = 'unocss-mdi' | 'mdi' | 'fa' | 'fa4' | 'md'

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
  /**
   * @default 'mdi'
   */
  defaultSet: IconSetName
  /**
   * The prefix for UnoCSS Preset Icons.
   *
   * @default 'i-'
   */
  unocssIconPrefix?: string
  sets?: IconFontName | IconFontName[] | FontIconSet[]
  svg?: {
    mdi?: JSSVGIconSet
    fa?: FontAwesomeSvgIconSet
  }
}

export type ComponentName = keyof typeof import('vuetify/components')
export type Components = false | ComponentName | ComponentName[]
export type DirectiveName = keyof typeof import('vuetify/directives')
export type Directives = boolean | DirectiveName | DirectiveName[]
export type LabComponentName = keyof typeof import('vuetify/labs/components')
export type LabComponents = boolean | LabComponentName | LabComponentName[]
export type VuetifyLocale = keyof typeof import('vuetify/locale')

export interface VOptions extends Partial<Omit<VuetifyOptions, | 'ssr' | 'aliases' | 'components' | 'directives' | 'locale' | 'date' | 'icons'>> {
  aliases?: Record<string, ComponentName>
  /**
   * Do you need to configure some global components?.
   *
   * @default false
   */
  components?: Components
  /**
   * Configure the locale messages, the locale, the fallback locale and RTL options.
   *
   * When `@nuxtjs/i18n` Nuxt module is present, the following options will be ignored:
   * - `locale`
   * - `fallback`
   * - `rtl`
   * - `messages`
   *
   * The adapter will be `vuetify`, if you want to use another adapter, check `date` option.
   */
  locale?: Omit<LocaleOptions, 'adapter'> & RtlOptions
  /**
   * Include locale messages?
   *
   * When `@nuxtjs/i18n` Nuxt module is present, this option will be ignored.
   *
   * You can include the locales you want to use in your application, this module will load and configure the messages for you.
   */
  localeMessages?: VuetifyLocale | VuetifyLocale[]
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

declare module '@nuxt/schema' {
  interface NuxtConfig {
    vuetify?: ModuleOptions
  }
  interface NuxtHooks {
    'vuetify:registerModule': (registerModule: (config: ModuleOptions) => void) => void
  }
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
    'vuetify:before-create': (options: {
      isDev: boolean
      vuetifyOptions: VuetifyOptions
    }) => Promise<void> | void
  }
}
