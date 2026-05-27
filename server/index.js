import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONFIG_PATH = resolve(__dirname, '..', 'public', 'theme.config.json')

function readConfig() {
  try {
    const raw = readFileSync(CONFIG_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { forceMonochrome: false }
  }
}

function writeConfig(config) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
}

const app = express()
app.use(cors())
app.use(express.json())

// GET  /api/theme/config  — 读取当前配置
app.get('/api/theme/config', (_req, res) => {
  const config = readConfig()
  res.json(config)
})

// GET /api/theme/toggle  — 切换强制黑白
app.get('/api/theme/toggle', (_req, res) => {
  const config = readConfig()
  config.forceMonochrome = !config.forceMonochrome
  writeConfig(config)
  console.log(`[theme-server] forceMonochrome → ${config.forceMonochrome}`)
  res.json(config)
})

// GET /api/theme/set    — 设置为指定值
// query: ?forceMonochrome=true|false
app.get('/api/theme/set', (req, res) => {
  const forceMonochrome = req.query.forceMonochrome === 'true'
  if (!('forceMonochrome' in req.query)) {
    return res.status(400).json({ error: '缺少 query 参数 forceMonochrome（true | false）' })
  }
  const config = readConfig()
  config.forceMonochrome = forceMonochrome
  writeConfig(config)
  console.log(`[theme-server] forceMonochrome → ${config.forceMonochrome}`)
  res.json(config)
})

const PORT = 3500
app.listen(PORT, () => {
  const config = readConfig()
  console.log(`[theme-server] 启动于 http://localhost:${PORT}`)
  console.log(`[theme-server] forceMonochrome = ${config.forceMonochrome}`)
})