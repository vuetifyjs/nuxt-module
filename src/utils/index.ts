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
