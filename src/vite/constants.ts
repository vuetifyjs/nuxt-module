export const VIRTUAL_VUETIFY_CONFIGURATION = 'virtual:vuetify-configuration'
// TODO: ask Daniel Roe, I guess it is some internal nuxt module that shouldn't intercept this
// Nuxt DevTools doesn't show the virtual when using Vite's default but it does when removing virtual: prefix
// const RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION = `\0${VIRTUAL_VUETIFY_CONFIGURATION}`
export const RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION = `/@nuxt-vuetify-configuration/${VIRTUAL_VUETIFY_CONFIGURATION.slice('virtual:'.length)}`

export const VIRTUAL_VUETIFY_DATE_CONFIGURATION = 'virtual:vuetify-date-configuration'
export const RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION = `/@nuxt-vuetify-configuration/${VIRTUAL_VUETIFY_DATE_CONFIGURATION.slice('virtual:'.length)}`
export const VIRTUAL_VUETIFY_ICONS_CONFIGURATION = 'virtual:vuetify-icons-configuration'
export const RESOLVED_VIRTUAL_VUETIFY_ICONS_CONFIGURATION = `/@nuxt-vuetify-configuration/${VIRTUAL_VUETIFY_ICONS_CONFIGURATION.slice('virtual:'.length)}`
export const VIRTUAL_VUETIFY_SSR_CLIENT_HINTS_CONFIGURATION = 'virtual:vuetify-ssr-client-hints-configuration'
export const RESOLVED_VIRTUAL_VUETIFY_SSR_CLIENT_HINTS_CONFIGURATION = `/@nuxt-vuetify-configuration/${VIRTUAL_VUETIFY_SSR_CLIENT_HINTS_CONFIGURATION.slice('virtual:'.length)}`

export const RESOLVED_VIRTUAL_MODULES = [
  RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION,
  RESOLVED_VIRTUAL_VUETIFY_ICONS_CONFIGURATION,
  RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION,
  RESOLVED_VIRTUAL_VUETIFY_SSR_CLIENT_HINTS_CONFIGURATION,
]
