// remove this when this released and update package.json with dist dts:
// https://github.com/nuxt/module-builder/pull/194
import type { ModuleOptions, ModuleHooks, RuntimeModuleHooks } from './dist/module.js'

declare module '#app' {
  interface RuntimeNuxtHooks extends RuntimeModuleHooks {}
}

declare module '@nuxt/schema' {
  interface NuxtConfig { ['vuetify']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['vuetify']?: ModuleOptions }
  interface NuxtHooks extends ModuleHooks {}
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['vuetify']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['vuetify']?: ModuleOptions }
  interface NuxtHooks extends ModuleHooks {}
}

// copy this line from types.d.ts in the dist folder
export type { ComponentName, Components, DateAdapter, DateOptions, DirectiveName, Directives, ExternalVuetifyOptions, FontAwesomeSvgIconSet, FontIconSet, IconFontName, IconSetName, IconsOptions, InlineModuleOptions, JSSVGIconSet, LabComponentName, LabComponents, MOptions, ModuleHooks, ModuleOptions, RuntimeModuleHooks, SSRClientHints, SSRClientHintsConfiguration, UnoCCSMdiIconSet, VOptions, VuetifyLocale, VuetifyModuleOptions, default } from './dist/module.js'
