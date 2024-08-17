# SASS Modern Compiler

From version `0.17.0`, this module will configure Nuxt to use the new SASS modern compiler (`modern-compiler`). You don't need to change anything in your configuration to use it:
- update `vite` version to `v5.4.0` or higher (if you're using Nuxt `3.12.4` or higher, you don't need to update `vite`)
- replace your `sass` dependency with `sass-embedded`

If the `sass-embedded` dependency is not installed, the module will configure the `modern` compiler for you. In case you get errors, enable the `disableModernSassCompiler` option in the module configuration to fall back to the `legacy` compiler.
