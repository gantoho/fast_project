import { useStorage } from '@vueuse/core'

// ============================================================
// 强制黑白开关 — 由后端 server/index.js 通过 theme.config.json 控制
//
// 启动时从后端 API 读取配置（失败则回退到 localStorage）
// 切换方式：
//   1. POST http://localhost:3500/api/theme/toggle
//   2. CLI: node server/toggle-cli.js
//   3. 直接编辑 theme.config.json
// ============================================================
export const forceMonochrome = useStorage('fast_forceMonochrome', false)

/** 从后端 API 拉取配置，初始化 forceMonochrome */
export async function fetchConfig() {
  try {
    const res = await fetch('/api/theme/config')
    if (res.ok) {
      const data = await res.json()
      forceMonochrome.value = data.forceMonochrome
      console.log(`[useStyle] 从后端获取配置: forceMonochrome=${forceMonochrome.value}`)
      return
    }
  } catch {
    // fall through
  }
  // 后端不可达时，直接读取静态配置文件
  try {
    const res = await fetch('/theme.config.json')
    if (res.ok) {
      const data = await res.json()
      forceMonochrome.value = data.forceMonochrome
      console.log(`[useStyle] 从静态文件获取配置: forceMonochrome=${forceMonochrome.value}`)
      return
    }
  } catch {
    console.log('[useStyle] 配置文件不可达，使用 localStorage 缓存')
  }
}

/** 通知后端切换并更新前端状态 */
export async function toggleForceMonochrome() {
  try {
    const res = await fetch('/api/theme/toggle')
    if (res.ok) {
      const data = await res.json()
      forceMonochrome.value = data.forceMonochrome
    }
  } catch {
    // 后端不可达，本地切换
    forceMonochrome.value = !forceMonochrome.value
  }
  applyCurrentStyle()
}

function applyCurrentStyle() {
  if (forceMonochrome.value) {
    document.documentElement.setAttribute('data-style', 'monochrome')
  } else {
    const savedStyle = localStorage.getItem('fast_themeStyle')
    const key = savedStyle ? savedStyle.replace(/^"|"$/g, '') : 'skeuomorphic'
    if (key === 'default') {
      document.documentElement.removeAttribute('data-style')
    } else {
      document.documentElement.setAttribute('data-style', key)
    }
  }
}

const STYLE_OPTIONS = [
  { key: 'default', label: '默认', desc: '无额外风格', preferDark: null },
  { key: 'monochrome', label: '黑白', desc: '纯黑白灰、极简克制', preferDark: null },
  { key: 'cyberpunk', label: '赛博朋克', desc: '霓虹色调、未来科技感', preferDark: true },
  { key: 'retro', label: '复古', desc: '温暖怀旧、胶片质感', preferDark: false },
  { key: 'skeuomorphic', label: '拟物', desc: '真实质感、光影层次', preferDark: false },
  { key: 'ocean', label: '海洋', desc: '深邃蔚蓝、静谧清爽', preferDark: false },
  { key: 'sunset', label: '日落', desc: '橙红渐变、温暖柔和', preferDark: false },
  { key: 'forest', label: '森林', desc: '自然翠绿、清新舒适', preferDark: false }
]

export function useStyle() {
  const currentStyle = useStorage('fast_themeStyle', 'skeuomorphic')

  const setStyle = (key) => {
    currentStyle.value = key
    if (!forceMonochrome.value) {
      applyStyle(key)
    }
  }

  const applyStyle = (key) => {
    if (forceMonochrome.value) {
      document.documentElement.setAttribute('data-style', 'monochrome')
      return
    }
    if (key === 'default') {
      document.documentElement.removeAttribute('data-style')
    } else {
      document.documentElement.setAttribute('data-style', key)
    }
  }

  return {
    currentStyle,
    setStyle,
    applyStyle,
    STYLE_OPTIONS,
    forceMonochrome
  }
}