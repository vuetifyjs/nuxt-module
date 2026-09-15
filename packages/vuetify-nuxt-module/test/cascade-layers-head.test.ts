import { describe, expect, it } from 'vitest'
import { resolveCascadeLayersHeadStyle } from '../src/utils/styles'

// The establishing statement Vuetify 4 ships in `generic/_layers.scss`, flattened
// to its top-level order. Pinning this before any runtime-injected component
// <style> guarantees `vuetify-components` outranks `vuetify-core.reset`.
const V4_STATEMENT = '@layer vuetify-core,vuetify-components,vuetify-overrides,vuetify-utilities,vuetify-final;'

describe('resolveCascadeLayersHeadStyle', () => {
  describe('Vuetify 4 — default order (cascadeLayers undefined)', () => {
    it('emits the establishing layer order for styles: { configFile }', () => {
      const style = resolveCascadeLayersHeadStyle({ configFile: 'settings.scss' }, undefined, true)
      expect(style).toEqual({ innerHTML: V4_STATEMENT, tagPriority: -100 })
    })

    it('emits it for styles: true', () => {
      expect(resolveCascadeLayersHeadStyle(true, undefined, true)).toEqual({ innerHTML: V4_STATEMENT, tagPriority: -100 })
    })

    it('emits it for the default (styles undefined)', () => {
      expect(resolveCascadeLayersHeadStyle(undefined, undefined, true)).toEqual({ innerHTML: V4_STATEMENT, tagPriority: -100 })
    })

    it('emits it for object styles without configFile', () => {
      expect(resolveCascadeLayersHeadStyle({ colors: false, utilities: false }, undefined, true)).toEqual({ innerHTML: V4_STATEMENT, tagPriority: -100 })
    })

    it('keeps vuetify-core before vuetify-components so the reset cannot win', () => {
      const style = resolveCascadeLayersHeadStyle(true, undefined, true)!
      const core = style.innerHTML.indexOf('vuetify-core')
      const components = style.innerHTML.indexOf('vuetify-components')
      expect(core).toBeGreaterThanOrEqual(0)
      expect(core).toBeLessThan(components)
    })
  })

  describe('Vuetify 4 — custom order (cascadeLayers array)', () => {
    it('injects the user-defined order so a layer can sit between Vuetify layers', () => {
      const order = ['vuetify-core', 'vuetify-components', 'my-overrides', 'vuetify-overrides', 'vuetify-utilities', 'vuetify-final']
      const style = resolveCascadeLayersHeadStyle(true, order, true)
      expect(style).toEqual({
        innerHTML: '@layer vuetify-core,vuetify-components,my-overrides,vuetify-overrides,vuetify-utilities,vuetify-final;',
        tagPriority: -100,
      })
    })

    it('treats an empty array as nothing to establish', () => {
      expect(resolveCascadeLayersHeadStyle(true, [], true)).toBeUndefined()
    })
  })

  describe('opt-out', () => {
    it('does not emit when cascadeLayers is false', () => {
      expect(resolveCascadeLayersHeadStyle(true, false, true)).toBeUndefined()
    })

    it('does not emit when styles is "none" (user owns the cascade)', () => {
      expect(resolveCascadeLayersHeadStyle('none', undefined, true)).toBeUndefined()
    })

    it('does not emit when styles is false', () => {
      expect(resolveCascadeLayersHeadStyle(false as never, undefined, true)).toBeUndefined()
    })

    it('cascadeLayers: false wins even with a custom-looking styles object', () => {
      expect(resolveCascadeLayersHeadStyle({ configFile: 'settings.scss' }, false, true)).toBeUndefined()
    })
  })

  describe('Vuetify 3 (different, opt-in layers)', () => {
    it('never emits the v4 statement, even with configFile', () => {
      expect(resolveCascadeLayersHeadStyle({ configFile: 'settings.scss' }, undefined, false)).toBeUndefined()
    })

    it('never emits even when a custom order is given', () => {
      expect(resolveCascadeLayersHeadStyle(true, ['a', 'b'], false)).toBeUndefined()
    })
  })
})
