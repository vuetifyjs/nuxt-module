import type { HeadConfig, TransformContext } from 'vitepress'

const firaFont = 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap'
const googleapis = 'https://fonts.googleapis.com'
const gstatic = 'https://fonts.gstatic.com'

export async function transformHead ({ pageData }: TransformContext): Promise<HeadConfig[]> {
  const head: HeadConfig[] = [
    ['link', { rel: 'dns-prefetch', href: googleapis }],
    ['link', { rel: 'dns-prefetch', href: gstatic }],
    ['link', { rel: 'preconnect', crossorigin: 'anonymous', href: googleapis }],
    ['link', { rel: 'preconnect', crossorigin: 'anonymous', href: gstatic }],
    ['link', { rel: 'preload', as: 'style', onload: 'this.onload=null;this.rel=\'stylesheet\'', href: firaFont }],
    ['noscript', {}, `<link rel="stylesheet" crossorigin="anonymous" href="${firaFont}" />`],
    ['link', { rel: 'prefetch', href: '/logo.svg' }],
  ]

  // banner for index page
  if (pageData.relativePath === 'index.md') {
    head.push(['link', { rel: 'prefetch', href: '/animated-logo.svg' }])
  }

  return head
}
