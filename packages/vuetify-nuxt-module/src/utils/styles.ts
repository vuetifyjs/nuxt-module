import type { Nuxt } from '@nuxt/schema'
import type { MOptions } from '../types'
import { existsSync } from 'node:fs'
import { isAbsolute, resolve } from 'pathe'

/**
 * Vuetify 4 ships the establishing cascade-layer order in
 * `vuetify/lib/styles/generic/_layers.scss`, but in treeshaking modes the
 * per-component styles are injected on demand by `@vuetify/unplugin-styles` —
 * each carrying its own `@layer vuetify-components { … }` block. Their DOM
 * order is decided by injection sequence (non-deterministic in dev, chunk
 * order in prod), so `vuetify-components` can be declared before `vuetify-core`,
 * making `vuetify-core.reset` (`button { font: inherit }`) outrank
 * `.v-btn--size-*`. See #381.
 *
 * Flattened to its top-level order, which is all that decides the reported
 * race (core vs components).
 */
const VUETIFY4_CASCADE_LAYERS = '@layer vuetify-core,vuetify-components,vuetify-overrides,vuetify-utilities,vuetify-final;'

/**
 * Establishing layer-order `<style>` to inline into the SSR'd `<head>` so the
 * cascade-layer priority is parsed before any runtime-injected component style.
 *
 * Vuetify 4 only: v3's layers are opt-in (since 3.8), use different names, and
 * live under a single top-level `vuetify` layer (no top-level race to fix).
 * Skipped for `styles: 'none'`/`false`, where the consumer owns the cascade.
 *
 * `cascadeLayers` lets a consumer redefine the order — e.g. to slot a custom
 * layer between Vuetify's — since a flat establishing statement freezes the
 * named layers contiguously (later-declared new layers can only append). Pass
 * `false` to opt out and manage the order yourself; omit it for Vuetify's
 * default order.
 */
export function resolveCascadeLayersHeadStyle (
  styles: MOptions['styles'],
  cascadeLayers: MOptions['cascadeLayers'],
  isVuetify4: boolean,
): { innerHTML: string, tagPriority: number } | undefined {
  if (!isVuetify4 || styles === 'none' || (styles as unknown) === false || cascadeLayers === false) {
    return undefined
  }
  const innerHTML = Array.isArray(cascadeLayers)
    ? (cascadeLayers.length > 0 ? `@layer ${cascadeLayers.join(',')};` : undefined)
    : VUETIFY4_CASCADE_LAYERS
  return innerHTML === undefined ? undefined : { innerHTML, tagPriority: -100 }
}

/**
 * Resolve and append the establishing cascade-layer `<style>` to the SSR'd
 * `<head>`, if applicable. Thin wrapper over {@link resolveCascadeLayersHeadStyle}
 * so the decision stays pure and testable while keeping the caller branch-free.
 */
export function applyCascadeLayersHeadStyle (
  nuxt: Nuxt,
  styles: MOptions['styles'],
  cascadeLayers: MOptions['cascadeLayers'],
  isVuetify4: boolean,
): void {
  const style = resolveCascadeLayersHeadStyle(styles, cascadeLayers, isVuetify4)
  if (!style) {
    return
  }
  nuxt.options.app.head.style ??= []
  nuxt.options.app.head.style.push(style)
}

export function resolveVuetifyConfigFile (configFile: string, nuxt: Nuxt) {
  if (typeof configFile === 'string' && !isAbsolute(configFile)) {
    for (const layer of nuxt.options._layers) {
      const resolved = resolve(layer.config.srcDir, configFile)
      if (existsSync(resolved)) {
        return resolved
      }
    }
  }
  return configFile
}
