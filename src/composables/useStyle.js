import { useStorage } from '@vueuse/core'

const STYLE_OPTIONS = [
  { key: 'default', label: '默认', desc: '无额外风格', preferDark: null },
  { key: 'cyberpunk', label: '赛博朋克', desc: '霓虹色调、未来科技感', preferDark: true },
  { key: 'retro', label: '复古', desc: '温暖怀旧、胶片质感', preferDark: false },
  { key: 'skeuomorphic', label: '拟物', desc: '真实质感、光影层次', preferDark: false }
]

export function useStyle() {
  const currentStyle = useStorage('fast_themeStyle', 'default')

  const setStyle = (key) => {
    currentStyle.value = key
    applyStyle(key)
  }

  const applyStyle = (key) => {
    if (key === 'default') {
      document.documentElement.removeAttribute('data-style')
    } else {
      document.documentElement.setAttribute('data-style', key)
    }
  }

  return {
    currentStyle,
    setStyle,
    STYLE_OPTIONS
  }
}