import type { UserConfig } from '@commitlint/types'
import changelogithubConfig from './changelogithub.config'

const types = Object.keys(changelogithubConfig.types)

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', types],
  },
}

export default config
