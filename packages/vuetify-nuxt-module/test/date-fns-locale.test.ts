import { describe, expect, it } from 'vitest'
import { resolveDateFnsLocaleName } from '../src/utils/date-fns-locale'

describe('resolveDateFnsLocaleName', () => {
  it('maps divergent Vuetify codes to date-fns export names', () => {
    expect(resolveDateFnsLocaleName('en')).toEqual({ name: 'enUS', fallback: false })
    expect(resolveDateFnsLocaleName('zhHans')).toEqual({ name: 'zhCN', fallback: false })
    expect(resolveDateFnsLocaleName('zhHant')).toEqual({ name: 'zhTW', fallback: false })
    expect(resolveDateFnsLocaleName('srCyrl')).toEqual({ name: 'sr', fallback: false })
    expect(resolveDateFnsLocaleName('fa')).toEqual({ name: 'faIR', fallback: false })
    expect(resolveDateFnsLocaleName('no')).toEqual({ name: 'nb', fallback: false })
  })

  it('passes through codes that already match a date-fns export', () => {
    expect(resolveDateFnsLocaleName('pt')).toEqual({ name: 'pt', fallback: false })
    expect(resolveDateFnsLocaleName('de')).toEqual({ name: 'de', fallback: false })
    expect(resolveDateFnsLocaleName('srLatn')).toEqual({ name: 'srLatn', fallback: false })
    expect(resolveDateFnsLocaleName('ar')).toEqual({ name: 'ar', fallback: false })
    expect(resolveDateFnsLocaleName('da')).toEqual({ name: 'da', fallback: false })
    expect(resolveDateFnsLocaleName('km')).toEqual({ name: 'km', fallback: false })
  })

  it('falls back to enUS for undefined or unknown codes', () => {
    expect(resolveDateFnsLocaleName(undefined)).toEqual({ name: 'enUS', fallback: true })
    expect(resolveDateFnsLocaleName('')).toEqual({ name: 'enUS', fallback: true })
    expect(resolveDateFnsLocaleName('klingon')).toEqual({ name: 'enUS', fallback: true })
  })
})
