import type { UnwrapNestedRefs } from 'vue'
import { reactive } from 'vue'
import type { SSRClientHints } from './types'
import type { Plugin } from '#app'
import { defineNuxtPlugin } from '#imports'

const plugin: Plugin<{
  ssrClientHints: UnwrapNestedRefs<SSRClientHints>
}> = defineNuxtPlugin(() => {
  return {
    provide: reactive({
      ssrClientHints: {
        firstRequest: false,
        prefersColorSchemeAvailable: false,
        prefersReducedMotionAvailable: false,
        viewportHeightAvailable: false,
        viewportWidthAvailable: false,
      },
    }),
  }
})

export default plugin
