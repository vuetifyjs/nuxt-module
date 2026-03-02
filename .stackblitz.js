import { promises as fsPromises } from 'node:fs'

removeParcel('./apps/playground/nuxt.config.ts')

async function removeParcel (filename) {
  try {
    const contents = await fsPromises.readFile(filename, 'utf8')
    const updatedContent = contents.replace('watcher: \'parcel\'', 'watcher: \'chokidar-granular\'')
    await fsPromises.writeFile(filename, updatedContent)
  } catch (error) {
    console.error(error)
  }
}
