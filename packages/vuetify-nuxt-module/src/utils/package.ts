import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function loadPackageJSON (name: string, parentURL = import.meta.url): Promise<Record<string, any> | null> {
  try {
    const packageJsonUrl = import.meta.resolve(`${name}/package.json`, parentURL)
    const packageJsonPath = fileURLToPath(packageJsonUrl)
    return JSON.parse(await readFile(packageJsonPath, 'utf8')) as Record<string, any>
  } catch {
    return null
  }
}

export function isPackageExists (name: string, parentURL = import.meta.url): boolean {
  try {
    import.meta.resolve(name, parentURL)
    return true
  } catch {
    return false
  }
}
