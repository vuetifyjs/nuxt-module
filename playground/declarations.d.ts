// vuetify 3.7.1 or nuxt i18n module augmenting `@vue/runtime-core` instead `vue`
import type {
  ComponentCustomOptions as _ComponentCustomOptions,
  ComponentCustomProperties as _ComponentCustomProperties,
} from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends _ComponentCustomProperties {}
  interface ComponentCustomOptions extends _ComponentCustomOptions {}
}
