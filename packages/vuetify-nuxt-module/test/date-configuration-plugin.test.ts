import { describe, expect, it, vi } from 'vitest'
import { RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION } from '../src/vite/constants'
import { vuetifyDateConfigurationPlugin } from '../src/vite/vuetify-date-configuration-plugin'

function makeCtx (localeCode: string | undefined) {
  return {
    dateAdapter: 'date-fns',
    isDev: false,
    i18n: false,
    vuetifyGte: () => true,
    logger: { warn: vi.fn() },
    vuetifyOptions: {
      date: { adapter: 'date-fns' },
      locale: localeCode === undefined ? {} : { locale: localeCode },
    },
  } as any
}

async function loadModule (ctx: any) {
  const plugin = vuetifyDateConfigurationPlugin(ctx) as any
  return (await plugin.load(RESOLVED_VIRTUAL_VUETIFY_DATE_CONFIGURATION)) as string
}

describe('vuetifyDateConfigurationPlugin date-fns locale', () => {
  it('imports a valid date-fns export for a Vuetify code', async () => {
    const ctx = makeCtx('en')
    const code = await loadModule(ctx)
    expect(code).toContain('import { enUS } from \'date-fns/locale\'')
    expect(code).toContain('new Adapter({ locale: enUS })')
    expect(code).not.toContain('import { en } from \'date-fns/locale\'')
    expect(ctx.logger.warn).not.toHaveBeenCalled()
  })

  it('maps divergent codes (zhHans -> zhCN)', async () => {
    const code = await loadModule(makeCtx('zhHans'))
    expect(code).toContain('import { zhCN } from \'date-fns/locale\'')
    expect(code).toContain('new Adapter({ locale: zhCN })')
  })

  it('passes through a locale that matches a date-fns export (de)', async () => {
    const ctx = makeCtx('de')
    const code = await loadModule(ctx)
    expect(code).toContain('import { de } from \'date-fns/locale\'')
    expect(code).toContain('new Adapter({ locale: de })')
    expect(ctx.logger.warn).not.toHaveBeenCalled()
  })

  it('falls back to enUS and warns for an unset locale', async () => {
    const ctx = makeCtx(undefined)
    const code = await loadModule(ctx)
    expect(code).toContain('import { enUS } from \'date-fns/locale\'')
    expect(code).toContain('new Adapter({ locale: enUS })')
    expect(ctx.logger.warn).toHaveBeenCalledExactlyOnceWith(expect.stringContaining('(unset)'))
  })
})
