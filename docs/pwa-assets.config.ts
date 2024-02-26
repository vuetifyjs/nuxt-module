import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  overrideAssets: false,
  logLevel: 'info',
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    assetName(type, size) {
      switch (type) {
        case 'transparent':
          return `pwa-${size.width}x${size.height}.png`
        case 'maskable':
          return 'maskable-icon.png'
        case 'apple':
          return 'apple-touch-icon.png'
      }
    },
  },
  images: ['public/logo.svg'],
})
