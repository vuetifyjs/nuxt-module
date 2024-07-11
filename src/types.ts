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
   * - mdi: https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css
   * - md:  https://fonts.googleapis.com/css?family=Material+Icons
   * - fa:  https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css
   * - fa4: https://cdn.jsdelivr.net/npm/font-awesome@4.x/css/font-awesome.min.css
   *
   * @default the corresponding CDN for the icon set
   */
  cdn?: string
}

export interface UnoCCSMdiIconSet {
  collapse?: string
  complete?: string
  cancel?: string
  close?: string
  delete?: string
  clear?: string
  success?: string
  info?: string
  warning?: string
  error?: string
  prev?: string
  next?: string
  checkboxOn?: string
  checkboxOff?: string
  checkboxIndeterminate?: string
  delimiter?: string
  sortAsc?: string
  sortDesc?: string
  expand?: string
  menu?: string
  subgroup?: string
  dropdown?: string
  radioOn?: string
  radioOff?: string
  edit?: string
  ratingEmpty?: string
  ratingFull?: string
  ratingHalf?: string
  loading?: string
  first?: string
  last?: string
  unfold?: string
  file?: string
  plus?: string
  minus?: string
  calendar?: string
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
  /**
   * Override the default mdi icons.
   *
   * Icon names should include the prefix and the collection, for example:
   * - home: i-<collection>:<icon>
   */
  unocssIcons?: UnoCCSMdiIconSet
  unocssAdditionalIcons?: Record<string, string>
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
  /**
   * Configure the SSR options.
   *
   * This option is only used when SSR is enabled in your Nuxt configuration.
   */
  ssr?: {
    clientWidth: number
    clientHeight?: number
  }
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
   * From v0.15.0, the module will include all the Vuetify directives by default.
   * If you want the old behavior, you can enable `useOldDirectivesBehavior` in the module options.
   *
   * Any directive not included in the list will be ignored by the Vuetify Vite Plugin.
   *
   * @default true
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
   * By default, `mdi` icons will be used via cdn: https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css.
   *
   * @see https://vuetifyjs.com/en/features/icon-fonts/
   */
  icons?: false | IconsOptions
}

export interface MOptions {
  /**
   * From v0.15.0, the module will include all the Vuetify directives by default.
   *
   * Check `directives` in Vuetify Options.
   *
   * @default false
   */
  useOldDirectivesBehavior?: boolean
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
   * - `useGoTo` -> `useVGoTo`
   *
   * @default false
   */
  prefixComposables?: boolean
  /**
   * Vuetify styles.
   *
   * If you want to use configFile on SSR, you have to disable `experimental.inlineSSRStyles` in nuxt.config.
   *
   * @see https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin
   * @see https://github.com/userquin/vuetify-nuxt-module/issues/78 and https://github.com/userquin/vuetify-nuxt-module/issues/74
   */
  styles?: true | 'none' | 'sass' | {
    configFile: string
  }
  /**
   * Add Vuetify Vite Plugin `transformAssetsUrls`?
   *
   * @default true
   */
  includeTransformAssetsUrls?: boolean | Record<string, string[]>
  /**
   * Vuetify SSR client hints.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Client_hints
   */
  ssrClientHints?: {
    /**
     * Should the module reload the page on first request?
     *
     * @default false
     */
    reloadOnFirstRequest?: boolean
    /**
     * Enable `Sec-CH-Viewport-Width` and `Sec-CH-Viewport-Height` headers?
     *
     * @see https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-width
     * @see https://wicg.github.io/responsive-image-client-hints/#sec-ch-viewport-height
     *
     * @default false
     */
    viewportSize?: boolean
    /**
     * Enable `Sec-CH-Prefers-Color-Scheme` header?
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Color-Scheme
     *
     * @default false
     */
    prefersColorScheme?: boolean
    /**
     * The options for `prefersColorScheme`, `prefersColorScheme` must be enabled.
     *
     * If you want the module to handle the color scheme for you, you should configure this option, otherwise you'll need to add your custom implementation.
     */
    prefersColorSchemeOptions?: {
      /**
       * The name for the cookie.
       *
       * @default 'color-scheme'
       */
      cookieName?: string
      /**
       * The name for the dark theme.
       *
       * @default 'dark'
       */
      darkThemeName?: string
      /**
       * The name for the light theme.
       *
       * @default 'light'
       */
      lightThemeName?: string
      /**
       * Use the browser theme only?
       *
       * This flag can be used when your application provides a custom dark and light themes,
       * but will not provide a theme switcher, that's, using by default the browser theme.
       *
       * @default false
       */
      useBrowserThemeOnly?: boolean
    }
    /**
     * Enable `Sec-CH-Prefers-Reduced-Motion` header?
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Reduced-Motion
     *
     * @default false
     */
    prefersReducedMotion?: boolean
  }
}

export interface VuetifyModuleOptions {
  moduleOptions?: MOptions
  /**
   * Vuetify options.
   *
   * You can inline the configuration or specify a file path:
   * `vuetifyOptions: './vuetify.options.ts'`
   *
   * The path should be relative to the root folder.
   */
  vuetifyOptions?: string | VOptions
}

export interface InlineModuleOptions extends Omit<VuetifyModuleOptions, 'vuetifyOptions'> {
  vuetifyOptions: VOptions
}

export interface ExternalVuetifyOptions extends VOptions {
  config?: boolean
}

/**
 * Request headers received from the client in SSR.
 */
export interface SSRClientHints {
  /**
   * Is the first request the browser hits the server?
   */
  firstRequest: boolean
  /**
   * The browser supports prefer-color-scheme client hints?
   */
  prefersColorSchemeAvailable: boolean
  /**
   * The browser supports prefer-reduced-motion client hints?
   */
  prefersReducedMotionAvailable: boolean
  /**
   * The browser supports viewport-height client hints?
   */
  viewportHeightAvailable: boolean
  /**
   * The browser supports viewport-width client hints?
   */
  viewportWidthAvailable: boolean
  prefersColorScheme?: 'dark' | 'light' | 'no-preference'
  prefersReducedMotion?: 'no-preference' | 'reduce'
  viewportHeight?: number
  viewportWidth?: number
  /**
   * The theme name from the cookie.
   */
  colorSchemeFromCookie?: string
  colorSchemeCookie?: string
}

export interface SSRClientHintsConfiguration {
  enabled: boolean
  viewportSize: boolean
  prefersColorScheme: boolean
  prefersReducedMotion: boolean
  prefersColorSchemeOptions?: {
    baseUrl: string
    defaultTheme: string
    themeNames: string[]
    cookieName: string
    darkThemeName: string
    lightThemeName: string
  }
}
