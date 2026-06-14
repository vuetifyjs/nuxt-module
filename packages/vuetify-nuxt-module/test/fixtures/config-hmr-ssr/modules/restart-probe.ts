import { appendFileSync } from 'node:fs'
import process from 'node:process'
import { defineNuxtModule } from '@nuxt/kit'

// Appends one byte per module setup. Each Nuxt (re)start re-runs module
// setup, so the file length === number of Nuxt boots in the running dev
// process. The path is provided ONLY to the spawned dev server (via the
// `env` option of createTest), so the in-process test build does not write.
export default defineNuxtModule({
  meta: { name: 'restart-probe' },
  setup () {
    const file = process.env.RESTART_PROBE_FILE
    if (file) {
      appendFileSync(file, 'x')
    }
  },
})
