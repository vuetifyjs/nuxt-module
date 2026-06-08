import { describe, expect, it } from 'vitest'
import { multipleDateAdaptersError } from '../src/utils/module'

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
