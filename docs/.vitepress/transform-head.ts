import type { HeadConfig, TransformContext } from 'vitepress'

const firaFont = 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap'
const googleapis = 'https://fonts.googleapis.com'
const gstatic = 'https://fonts.gstatic.com'

export async function transformHead(_tc: TransformContext): Promise<HeadConfig[]> {
  const head: HeadConfig[] = []

  // prefetch fira font
  head.push(['link', { rel: 'dns-prefetch', href: googleapis }])
  head.push(['link', { rel: 'dns-prefetch', href: gstatic }])
  head.push(['link', { rel: 'preconnect', crossorigin: 'anonymous', href: googleapis }])
  head.push(['link', { rel: 'preconnect', crossorigin: 'anonymous', href: gstatic }])

  // non-blocking css
  head.push(['link', { rel: 'preload', as: 'style', onload: 'this.onload=null;this.rel=\'stylesheet\'', href: firaFont }])
  head.push(['noscript', {}, `<link rel="stylesheet" crossorigin="anonymous" href="${firaFont}" />`])

  return head
}
