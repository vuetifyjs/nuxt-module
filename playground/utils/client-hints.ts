import type { RenderResponse } from 'nitropack'

const AcceptCH = [
  'Sec-CH-Prefers-Color-Scheme',
  'Sec-CH-Prefers-Reduced-Motion',
  'Sec-CH-Viewport-Height',
  'Sec-CH-Viewport-Width',
]
const AcceptCHRequestHeader = AcceptCH.map(h => h.toLowerCase())
const CHHeaders = ['Accept-CH', 'Vary', 'Critical-CH']

export function addClientHintResponseHeaders(
  response: RenderResponse,
  filter: (header: string) => boolean = () => true,
) {
  CHHeaders.filter(filter).forEach(key => writeClientHintHeaders(key, response))
}

export function useClientHintsHeaders() {
  const headers = useRequestHeaders()
  return AcceptCHRequestHeader.reduce<Record<string, string>>((acc, key) => {
    acc[key] = headers[key]
    return acc
  }, {})
}

function writeClientHintHeaders(key: string, response: RenderResponse) {
  response.headers[key] = (response.headers[key] ? [response.headers[key]] : []).concat(...AcceptCH).join(', ')
}
