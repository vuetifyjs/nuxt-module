import { readFileSync, writeFileSync } from 'node:fs'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  $fetch,
  createTest,
  setTestContext,
} from '@nuxt/test-utils/e2e'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

const rootDir = fileURLToPath(new URL('../fixtures/config-hmr-ssr', import.meta.url))
const configPath = join(rootDir, 'vuetify.config.ts')

// `$fetch` can hang if a request lands inside a reload window. Race each
// request against a timeout so a stalled request rejects and `expect.poll`
// retries it, instead of stalling the whole test until the suite timeout.
async function fetchWithTimeout (path: string, ms = 4000): Promise<string> {
  return await Promise.race([
    $fetch<string>(path),
    new Promise<string>((_, reject) => setTimeout(() => reject(new Error('fetch timeout')), ms)),
  ])
}

describe('config-hmr-ssr — dev SSR config hot-reload', () => {
  let probeFile = ''
  let originalConfig = ''

  const hooks = createTest({
    rootDir,
    server: true,
    browser: true,
    build: true,
    dev: true,
    env: {
      RESTART_PROBE_FILE: '__PLACEHOLDER__',
    },
  })

  beforeAll(async () => {
    const dir = await mkdtemp(join(tmpdir(), 'vuetify-hmr-'))
    probeFile = join(dir, 'restart-probe')
    writeFileSync(probeFile, '')
    // Inject the resolved probe path into the spawned server env BEFORE the
    // server is spawned by hooks.beforeAll().
    hooks.ctx.options.env = { ...hooks.ctx.options.env, RESTART_PROBE_FILE: probeFile }
    // Defensively normalize the fixture to the baseline color before capturing
    // it: a prior timed-out run may have left the file at the edited (#00ff00)
    // value, which would poison this run's baseline assertion.
    const onDisk = readFileSync(configPath, 'utf8')
    originalConfig = onDisk.replace(/#00ff00/g, '#ff0000')
    if (originalConfig !== onDisk) {
      writeFileSync(configPath, originalConfig)
    }
    setTestContext(hooks.ctx)
    await hooks.beforeAll()
  }, hooks.ctx.options.setupTimeout)

  beforeEach(() => setTestContext(hooks.ctx))

  afterAll(async () => {
    // Always restore the fixture file so the repo/tree stays clean.
    if (originalConfig) {
      writeFileSync(configPath, originalConfig)
    }
    setTestContext(hooks.ctx)
    await hooks.afterAll()
    setTestContext(undefined)
  }, hooks.ctx.options.teardownTimeout)

  it('reflects a config edit in SSR HTML without restarting the dev server', async () => {
    try {
      const before = await fetchWithTimeout('/')
      expect(before).toContain('<div id="primary-probe">#ff0000</div>')

      const bootsBefore = readFileSync(probeFile, 'utf8').length
      expect(bootsBefore).toBeGreaterThanOrEqual(1)

      // Edit the config on disk → green primary.
      writeFileSync(configPath, originalConfig.replace('#ff0000', '#00ff00'))

      // Poll the SSR output until the change is reflected (HMR reload window).
      await expect.poll(
        async () => await fetchWithTimeout('/'),
        { timeout: 20_000, interval: 250 },
      ).toContain('<div id="primary-probe">#00ff00</div>')

      // The dev server must NOT have restarted: boot count is unchanged.
      const bootsAfter = readFileSync(probeFile, 'utf8').length
      expect(bootsAfter, 'dev server restarted (boot count increased)').toBe(bootsBefore)
    } finally {
      // Restore the fixture even if an assertion above failed mid-edit, so a
      // failed run can't poison the next one (in addition to afterAll).
      if (originalConfig) {
        writeFileSync(configPath, originalConfig)
      }
    }
  }, 60_000)
})
