import { promises as fsPromises } from 'node:fs'

removeParcel('./playground/nuxt.config.ts')

async function removeParcel(filename) {
  try {
    const contents = await fsPromises.readFile(filename, 'utf-8')
    const updatedContent = contents.replace('watcher: \'parcel\'', 'watcher: \'chokidar-granular\'')
    await fsPromises.writeFile(filename, updatedContent)
  }
  catch (err) {
    console.error(err)
  }
}
