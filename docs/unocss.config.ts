import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno({
      dark: 'media',
    }),
    presetIcons({
      scale: 1.2,
    }),
  ],
})
