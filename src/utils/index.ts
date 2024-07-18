import type { AssetURLOptions, AssetURLTagConfig } from '@vue/compiler-sfc'
import defu from 'defu'
import { transformAssetUrls as vuetifyTransformAssetUrls } from 'vite-plugin-vuetify'
import type { ViteConfig } from '@nuxt/schema'
import type { VuetifyNuxtContext } from './config'

/**
 * Convert string to kebap-case
 */
export function toKebabCase(str = '') {
  if (toKebabCase.cache.has(str))
    return toKebabCase.cache.get(str)!

  const kebab = str
    .replace(/[^a-z]/gi, '-')
    .replace(/\B([A-Z])/g, '-$1')
    .toLowerCase()

  toKebabCase.cache.set(str, kebab)

  return kebab
}

toKebabCase.cache = new Map<string, string>()

/**
 * Convert string to camelCase
 */
export function camelize(str: string): string {
  if (camelize.cache.has(str))
    return camelize.cache.get(str)!

  const camel = str.replace(/-([a-z0-9])/g, g => g[1].toUpperCase())

  camelize.cache.set(str, camel)

  return camel
}

camelize.cache = new Map<string, string>()

/**
 * Convert string to PascaleCase
 */
export function pascalize(str: string): string {
  if (pascalize.cache.has(str))
    return pascalize.cache.get(str)!

  let pascal = camelize(str)
  pascal = pascal.slice(0, 1).toUpperCase() + pascal.slice(1)

  pascalize.cache.set(str, pascal)

  return pascal
}

pascalize.cache = new Map<string, string>()

export function createTransformAssetUrls(ctx: VuetifyNuxtContext, viteInlineConfig: ViteConfig) {
  const { includeTransformAssetsUrls } = ctx.moduleOptions
  if (!includeTransformAssetsUrls)
    return undefined

  let existingTransformAssetUrls = viteInlineConfig.vue?.template?.transformAssetUrls ?? {}

  let useURLOptions: AssetURLOptions | undefined
  if (typeof existingTransformAssetUrls === 'boolean') {
    existingTransformAssetUrls = {}
  }
  else if ('base' in existingTransformAssetUrls || 'includeAbsolute' in existingTransformAssetUrls || 'tags' in existingTransformAssetUrls) {
    useURLOptions = {
      base: existingTransformAssetUrls.base as string | undefined,
      includeAbsolute: existingTransformAssetUrls.includeAbsolute as boolean | undefined,
    }
    existingTransformAssetUrls = (existingTransformAssetUrls.tags ?? {}) as Record<string, string[]>
  }

  const transformAssetUrls = normalizeTransformAssetUrls(
    typeof includeTransformAssetsUrls === 'object'
      ? defu(existingTransformAssetUrls, vuetifyTransformAssetUrls, includeTransformAssetsUrls)
      : defu(existingTransformAssetUrls, vuetifyTransformAssetUrls),
  )

  if (!useURLOptions)
    return transformAssetUrls satisfies AssetURLTagConfig

  useURLOptions.tags = transformAssetUrls
  return useURLOptions
}

function normalizeTransformAssetUrls(transformAssetUrls: Record<string, string[]>) {
  /*
  We need to cover these 4 cases:

<VCard :appendAvatar="~/assets/logo.svg"/>
<v-card :append-avatar="~/assets/logo.svg" />
<VCard appendAvatar="~/assets/logo.svg"/>
<v-card append-avatar="~/assets/logo.svg" />
   */
  const names = new Set(Object.keys(transformAssetUrls))
  let kebab: string
  let pascal: string
  for (const name of names) {
    transformAssetUrls[name] = normalizeTransformAssetUrlsAttrs(transformAssetUrls[name])
    kebab = toKebabCase(name)
    pascal = pascalize(name)
    if (!names.has(kebab))
      transformAssetUrls[kebab] = [...transformAssetUrls[name]]

    if (!names.has(pascal))
      transformAssetUrls[pascal] = [...transformAssetUrls[name]]
  }

  return transformAssetUrls
}

function normalizeTransformAssetUrlsAttrs(attrs: string[]) {
  const result = new Set<string>()
  let kebab: string
  let camel: string
  let bind: boolean
  let idx: number
  for (const attr of attrs) {
    result.add(attr)
    idx = attr.indexOf(':')
    if (idx > 0)
      continue

    bind = idx === 0
    kebab = toKebabCase(bind ? attr.slice(1) : attr)
    camel = camelize(bind ? attr.slice(1) : attr)
    result.add(kebab)
    result.add(camel)
    result.add(`:${kebab}`)
    result.add(`:${camel}`)
  }

  return [...result]
}
