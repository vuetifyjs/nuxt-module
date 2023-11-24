import { renameSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

rmSync(resolve('./dist/module.d.mts'))
renameSync(resolve('./dist/module.mjs'), resolve('dist/module.js'))

const cjsModulePath = resolve('./dist/module.cjs')

const cjsModule = readFileSync(cjsModulePath, 'utf-8')
writeFileSync(cjsModulePath, cjsModule.replace('module.exports = module$1;', 'exports.default = module$1;'), { encoding: 'utf-8' })
