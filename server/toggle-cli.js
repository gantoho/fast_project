import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONFIG_PATH = resolve(__dirname, '..', 'public', 'theme.config.json')

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
config.forceMonochrome = !config.forceMonochrome
writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')

const status = config.forceMonochrome ? 'ON (强制黑白)' : 'OFF (风格可选)'
console.log(`forceMonochrome → ${status}`)
console.log('刷新页面即可生效。')