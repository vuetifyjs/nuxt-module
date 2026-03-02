import type { Plugin } from '#app'
import type { UnwrapNestedRefs } from 'vue'
import type { SSRClientHints } from './types'
import { defineNuxtPlugin } from '#imports'
import { reactive } from 'vue'

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
