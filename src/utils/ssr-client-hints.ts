import type { MOptions } from '../types'
import type { VuetifyNuxtContext } from './config'

export type ResolvedClientHints = Required<MOptions['ssrClientHints']> & {
  enabled: boolean
}

export function prepareSSRClientHints(ctx: VuetifyNuxtContext) {
  if (!ctx.isSSR || ctx.isNuxtPrepare || ctx.isNuxtGenerate) {
    return {
      enabled: false,
      viewportSize: false,
      prefersColorScheme: false,
      prefersReducedMotion: false,
    } satisfies ResolvedClientHints
  }

  const { ssrClientHints } = ctx.moduleOptions

  const clientHints: ResolvedClientHints = {
    enabled: false,
    viewportSize: ssrClientHints?.viewportSize ?? false,
    prefersColorScheme: ssrClientHints?.prefersColorScheme ?? false,
    prefersReducedMotion: ssrClientHints?.prefersReducedMotion ?? false,
  }

  clientHints.enabled = clientHints.viewportSize || clientHints.prefersColorScheme || clientHints.prefersReducedMotion

  return clientHints
}
