import type { NitroAppPlugin, RenderResponse } from 'nitropack'
import { addClientHintResponseHeaders } from '~/utils/client-hints'

export default <NitroAppPlugin> function (nitro) {
  // send HTTP Client hints for
  nitro.hooks.hook('render:response', (response: RenderResponse) => {
    // todo: add filter for custom headers in nitro or plugin
    addClientHintResponseHeaders(response)
  })
}
