module.exports.defineVuetifyConfiguration = function(...args) {
  return import('./custom-configuration.mjs').then(m => m.defineVuetifyConfiguration.call(this, ...args))
}
