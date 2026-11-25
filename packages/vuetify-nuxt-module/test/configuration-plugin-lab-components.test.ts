import { describe, expect, it, vi } from 'vitest'
import { RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION } from '../src/vite/constants'
import { vuetifyConfigurationPlugin } from '../src/vite/vuetify-configuration-plugin'

// Shapes of `vuetify/dist/json/importMap{,-labs}.json` after Vuetify 4.3 promoted
// VAvatarGroup/VHighlight/VProgress from labs to core.
const components = {
  VAvatarGroup: { from: 'components/VAvatarGroup' },
  VBtn: { from: 'components/VBtn' },
  VHighlight: { from: 'components/VHighlight' },
}
const labComponents = {
  VSplitBtn: { from: 'labs/VSplitBtn' },
}

function makeCtx (vuetifyOptions: Record<string, unknown>) {
  return {
    isDev: false,
    isSSR: false,
    i18n: false,
    vuetifyGte: () => true,
    logger: { warn: vi.fn() },
    componentsPromise: Promise.resolve(components),
    labComponentsPromise: Promise.resolve(labComponents),
    vuetifyOptions,
  } as any
}

async function loadModule (ctx: any) {
  const plugin = vuetifyConfigurationPlugin(ctx) as any
  return (await plugin.load(RESOLVED_VIRTUAL_VUETIFY_CONFIGURATION)) as string
}

describe('vuetifyConfigurationPlugin labComponents', () => {
  it('registers lab components from vuetify/labs', async () => {
    const ctx = makeCtx({ labComponents: ['VSplitBtn'] })
    const code = await loadModule(ctx)
    expect(code).toContain('import {VSplitBtn} from \'vuetify/labs/VSplitBtn\'')
    expect(code).toContain('options.components = {VSplitBtn}')
    expect(ctx.logger.warn).not.toHaveBeenCalled()
  })

  it('registers components promoted out of labs from vuetify/components', async () => {
    const ctx = makeCtx({ labComponents: ['VAvatarGroup', 'VHighlight', 'VSplitBtn'] })
    const code = await loadModule(ctx)
    expect(code).toContain('import {VAvatarGroup} from \'vuetify/components/VAvatarGroup\'')
    expect(code).toContain('import {VHighlight} from \'vuetify/components/VHighlight\'')
    expect(code).not.toContain('vuetify/labs/VAvatarGroup')
    expect(code).not.toContain('vuetify/labs/VHighlight')
    expect(code).toContain('options.components = {VAvatarGroup,VHighlight,VSplitBtn}')
    expect(ctx.logger.warn).toHaveBeenCalledTimes(2)
    expect(ctx.logger.warn).toHaveBeenCalledWith(expect.stringContaining('VAvatarGroup has been promoted'))
  })

  it('does not import a promoted component twice when also listed in components', async () => {
    const ctx = makeCtx({ components: ['VHighlight'], labComponents: ['VHighlight'] })
    const code = await loadModule(ctx)
    expect(code.match(/import \{VHighlight\}/g)).toHaveLength(1)
    expect(code).toContain('options.components = {VHighlight}')
  })

  it('still warns for unknown lab components', async () => {
    const ctx = makeCtx({ labComponents: ['VNope'] })
    const code = await loadModule(ctx)
    expect(code).not.toContain('VNope')
    expect(ctx.logger.warn).toHaveBeenCalledExactlyOnceWith('Lab Component VNope not found in Vuetify.')
  })
})
