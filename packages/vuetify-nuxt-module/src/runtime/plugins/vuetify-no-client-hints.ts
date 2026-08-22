import type { Plugin } from '#app'
import type { SSRClientHints } from './types'
import type { UnwrapNestedRefs } from 'vue'
import { reactive } from 'vue'
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
