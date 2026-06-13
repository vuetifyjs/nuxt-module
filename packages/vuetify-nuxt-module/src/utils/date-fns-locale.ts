/**
 * Maps Vuetify locale codes to date-fns `locale` export names.
 *
 * Only divergent codes are listed; codes whose Vuetify name already equals the
 * date-fns export name (e.g. `pt`, `de`, `srLatn`) pass through unchanged.
 * date-fns has no bare `en` export — see #318.
 */
const VUETIFY_TO_DATE_FNS: Record<string, string> = {
  en: 'enUS',
  fa: 'faIR',
  no: 'nb',
  srCyrl: 'sr',
  zhHans: 'zhCN',
  zhHant: 'zhTW',
}

/**
 * date-fns export names reachable from Vuetify's supported locale codes.
 * Used to validate the resolved name so we never emit an import for a
 * non-existent export (which would crash the build).
 */
const DATE_FNS_SUPPORTED = new Set<string>([
  'af', 'ar', 'az', 'bg', 'ca', 'ckb', 'cs', 'da', 'de', 'el', 'enUS', 'es',
  'et', 'faIR', 'fi', 'fr', 'he', 'hr', 'hu', 'id', 'it', 'ja', 'km', 'ko',
  'lt', 'lv', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr', 'srLatn',
  'sv', 'th', 'tr', 'uk', 'vi', 'zhCN', 'zhTW',
])

export interface ResolvedDateFnsLocale {
  /** A date-fns `locale` export name guaranteed to exist. */
  name: string
  /** True when the input could not be resolved and `enUS` was substituted. */
  fallback: boolean
}

export function resolveDateFnsLocaleName (code: string | undefined): ResolvedDateFnsLocale {
  if (!code) {
    return { name: 'enUS', fallback: true }
  }

  const candidate = VUETIFY_TO_DATE_FNS[code] ?? code
  if (DATE_FNS_SUPPORTED.has(candidate)) {
    return { name: candidate, fallback: false }
  }

  return { name: 'enUS', fallback: true }
}
