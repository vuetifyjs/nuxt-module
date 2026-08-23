import type { Nuxt, NuxtHooks } from '@nuxt/schema'

/**
 * The preset list handed to the `imports:sources` hook. Derived from the hook
 * signature so it always matches the installed Nuxt, without taking a direct
 * dependency on `unimport`.
 */
type ImportPreset = Parameters<NuxtHooks['imports:sources']>[0][number]

/** Non-`#`-prefixed sources that still belong to the framework, not to a module. */
const FRAMEWORK_SOURCES = new Set(['vue', 'vue-demi', 'vue-router'])

/**
 * Whether an auto-import source belongs to Nuxt or Vue rather than to a
 * third-party module. `#app/*` and `#build/*` are Nuxt's virtual aliases;
 * everything a module registers resolves to a package specifier or an
 * absolute path. Matches the set Nuxt itself treats as built-in when it
 * emits `NUXT_B6002`.
 */
function isFrameworkSource (from: unknown): boolean {
  return typeof from === 'string' && (from.startsWith('#') || FRAMEWORK_SOURCES.has(from))
}

function collectPreset (preset: unknown, names: Set<string>, inheritedFrom?: unknown): void {
  if (!preset || typeof preset !== 'object') {
    return
  }

  const { imports, from } = preset as { imports?: unknown, from?: unknown }
  // A PackagePreset carries `package` instead of an `imports` array.
  if (!Array.isArray(imports)) {
    return
  }

  const source = from ?? inheritedFrom

  for (const entry of imports) {
    if (typeof entry === 'string') {
      if (isFrameworkSource(source)) {
        names.add(entry)
      }
      continue
    }

    if (Array.isArray(entry)) {
      const [name, as, entryFrom] = entry as [unknown, unknown?, unknown?]
      const effective = typeof as === 'string' ? as : name
      if (typeof effective === 'string' && isFrameworkSource(entryFrom ?? source)) {
        names.add(effective)
      }
      continue
    }

    if (!entry || typeof entry !== 'object') {
      continue
    }

    if (Array.isArray((entry as { imports?: unknown }).imports)) {
      collectPreset(entry, names, source)
      continue
    }

    const { name, as, from: entryFrom } = entry as { name?: unknown, as?: unknown, from?: unknown }
    const effective = typeof as === 'string' ? as : name
    if (typeof effective === 'string' && isFrameworkSource(entryFrom ?? source)) {
      names.add(effective)
    }
  }
}

/**
 * Names already claimed by Nuxt's and Vue's own auto-import presets.
 *
 * Third-party module sources are deliberately excluded: honouring them would
 * make the module's own auto-import names depend on which modules the project
 * installed and in which order. Such a collision stays the user's call, via an
 * explicit `prefixComposables`.
 */
export function collectPresetNames (presets: readonly ImportPreset[]): Set<string> {
  const names = new Set<string>()
  for (const preset of presets) {
    collectPreset(preset, names)
  }
  return names
}

export interface ComposableImport {
  name: string
  /** Set only when the composable is renamed; absent otherwise. */
  as?: string
}

export type PrefixComposables = boolean | 'auto' | string[]

function prefixName (name: string): string {
  return name.replace(/^use/, 'useV')
}

function shouldPrefixComposable (
  name: string,
  mode: PrefixComposables,
  reserved: ReadonlySet<string>,
): boolean {
  if (Array.isArray(mode)) {
    return mode.includes(name)
  }
  if (mode === 'auto') {
    return reserved.has(name)
  }
  return mode
}

/**
 * Decide the auto-import name for each composable.
 *
 * `undefined` is treated as `'auto'` so the behaviour is identical whether the
 * default arrives through `MODULE_DEFAULTS` or the option was never set.
 */
export function resolveComposableImports (options: {
  composables: readonly string[]
  reserved: ReadonlySet<string>
  prefix: PrefixComposables | undefined
}): ComposableImport[] {
  const { composables, reserved } = options
  const mode = options.prefix ?? 'auto'

  return composables.map(name => (
    shouldPrefixComposable(name, mode, reserved)
      ? { name, as: prefixName(name) }
      : { name }
  ))
}

/** One entry of the array handed to the `imports:extend` hook. */
type ImportEntry = Parameters<NuxtHooks['imports:extend']>[0][number]

export interface RegisterComposableImportsOptions {
  /** Composable names to auto-import, already filtered by the caller. */
  composables: string[]
  prefix: PrefixComposables | undefined
  /** Turns a resolved entry into the full import descriptor Nuxt expects. */
  toImport: (entry: ComposableImport) => ImportEntry
  /** Called once, on the first regeneration that actually renames something. */
  onPrefixed?: (renames: { name: string, as: string }[]) => void
}

/**
 * Register the Vuetify composables as auto-imports, renaming any whose name a
 * framework source already owns.
 *
 * `addImports` cannot be used here: it needs the finished array at module-setup
 * time, whereas the reserved names only become known once `imports:sources`
 * fires on `modules:done`. This registers the same underlying hook that
 * `addImports` does, one step later.
 */
export function registerComposableImports (nuxt: Nuxt, options: RegisterComposableImportsOptions): void {
  const { composables, prefix, toImport, onPrefixed } = options
  let reserved: ReadonlySet<string> = new Set()
  let notified = false

  nuxt.hook('imports:sources', presets => {
    reserved = collectPresetNames(presets)
  })

  nuxt.hook('imports:extend', imports => {
    const resolved = resolveComposableImports({ composables, reserved, prefix })

    if (!notified && onPrefixed) {
      const renames = resolved.filter((entry): entry is Required<ComposableImport> => !!entry.as)
      if (renames.length > 0) {
        notified = true
        onPrefixed(renames.map(({ name, as }) => ({ name, as })))
      }
    }

    imports.push(...resolved.map(entry => toImport(entry)))
  })
}
