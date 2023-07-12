import Theme from 'vitepress/theme'
import { inBrowser } from 'vitepress'

import './styles/main.css'
import './styles/vars.css'

import 'uno.css'

if (inBrowser)
  import('./pwa')

export default Theme
