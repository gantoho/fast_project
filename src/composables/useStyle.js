import { useStorage } from '@vueuse/core'

const STYLE_OPTIONS = [
  { key: 'default', label: '默认', desc: '无额外风格', preferDark: null },
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