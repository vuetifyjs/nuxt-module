import type { HeadConfig, TransformContext } from 'vitepress'

const firaFont = 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap'
const googleapis = 'https://fonts.googleapis.com'
const gstatic = 'https://fonts.gstatic.com'

export async function transformHead({ pageData }: TransformContext): Promise<HeadConfig[]> {
  const head: HeadConfig[] = []

  // prefetch fira font
  head.push(['link', { rel: 'dns-prefetch', href: googleapis }])
  head.push(['link', { rel: 'dns-prefetch', href: gstatic }])
  head.push(['link', { rel: 'preconnect', crossorigin: 'anonymous', href: googleapis }])
  head.push(['link', { rel: 'preconnect', crossorigin: 'anonymous', href: gstatic }])

  // non-blocking css
  head.push(['link', { rel: 'preload', as: 'style', onload: 'this.onload=null;this.rel=\'stylesheet\'', href: firaFont }])
  head.push(['noscript', {}, `<link rel="stylesheet" crossorigin="anonymous" href="${firaFont}" />`])

  // logo images
  head.push(['link', { rel: 'prefetch', href: '/icon_light.svg' }])
  head.push(['link', { rel: 'prefetch', href: '/icon_dark.svg' }])

  // banner for index page
  if (pageData.relativePath === 'index.md') {
    head.push(['link', { rel: 'prefetch', href: '/banner_light.svg' }])
    head.push(['link', { rel: 'prefetch', href: '/banner_dark.svg' }])
  }

  // prompt for update image
  // if (pageData.relativePath === 'guide/prompt-for-update.md')
  //   head.push(['link', { rel: 'prefetch', href: '/prompt-update.png' }])

  return head
}
