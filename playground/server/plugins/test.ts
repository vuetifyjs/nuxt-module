export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    if ('_nitro' in event.context) {
      const routeRules = event.context._nitro.routeRules
      if (routeRules && routeRules.ssr === false) {
        const configured = event.node.res.getHeader('server-timing')
        const serverTiming = ['vtfy-0;desc="no-ssr"', 'vtfy-1;desc="no-ssr"']
        if (typeof configured !== 'undefined') {
          if (Array.isArray(configured))
            serverTiming.unshift(...configured)
          else
            serverTiming.unshift(typeof configured === 'string' ? configured : configured.toString())
        }
        event.node.res.setHeader('server-timing', serverTiming)
      }
    }
  })
})
