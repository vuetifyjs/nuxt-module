import { describe, expect, it } from 'vitest'
import { isBuiltinDateAdapter, multipleDateAdaptersError } from '../src/utils/module'

describe('multipleDateAdaptersError', () => {
  it('lists the full @date-io adapter names', () => {
    const message = multipleDateAdaptersError(['date-fns', 'luxon'])
    expect(message).toContain('@date-io/date-fns, @date-io/luxon')
    expect(message).not.toContain('@date-io/d, @date-io/l')
  })

  it('keeps the guidance about specifying the adapter option', () => {
    const message = multipleDateAdaptersError(['moment', 'dayjs'])
    expect(message).toBe('Multiple date adapters found: @date-io/moment, @date-io/dayjs, please specify the adapter to use in the "vuetifyOptions.date.adapter" option.')
  })
})

describe('isBuiltinDateAdapter', () => {
  it('treats Vuetify-provided and custom adapters as built-in', () => {
    expect(isBuiltinDateAdapter('vuetify')).toBe(true)
    expect(isBuiltinDateAdapter('string')).toBe(true)
    expect(isBuiltinDateAdapter('custom')).toBe(true)
  })

  it('requires an @date-io package for the rest', () => {
    expect(isBuiltinDateAdapter('date-fns')).toBe(false)
    expect(isBuiltinDateAdapter('luxon')).toBe(false)
  })
})
