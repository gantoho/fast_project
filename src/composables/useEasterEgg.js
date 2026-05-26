import { onMounted, onUnmounted, ref } from 'vue'
import { FORCE_MONOCHROME } from './useStyle'

// Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
]

const PARTY_EMOJIS = [
  '🎉', '✨', '🌟', '💫', '🎊', '🎈', '🎀', '🎵',
  '🔥', '💥', '🌈', '🦄', '🍕', '💎', '⚡', '🕺',
  '💃', '🎸', '🎹', '🥁', '👾', '🤖', '👽', '🛸',
  '⭐', '🌙', '☀️', '🌸', '🍀', '💖', '🎯', '🏆'
]

let rainContainer = null

function createEmojiRain() {
  if (rainContainer) return

  rainContainer = document.createElement('div')
  rainContainer.className = 'emoji_rain'

  for (let i = 0; i < 36; i++) {
    const drop = document.createElement('span')
    drop.className = 'emoji_rain_drop'
    drop.textContent = PARTY_EMOJIS[Math.floor(Math.random() * PARTY_EMOJIS.length)]

    const size = 18 + Math.random() * 30
    const left = Math.random() * 100
    const duration = 2.5 + Math.random() * 4.5
    const delay = Math.random() * 5
    const wobble = (Math.random() - 0.5) * 80

    drop.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      --wobble: ${wobble}px;
    `
    rainContainer.appendChild(drop)
  }

  document.body.appendChild(rainContainer)
}

function removeEmojiRain() {
  if (rainContainer) {
    rainContainer.remove()
    rainContainer = null
  }
}

export function useEasterEgg() {
  const isPartyMode = ref(false)
  const keySequence = ref([])
  const footerClicks = ref(0)
  let footerClickTimer = null

  // ===== 1. 控制台欢迎彩蛋 =====
  const printConsoleEgg = () => {
    console.log(
      '%c  ⚡ Fast Project — 快速批量打开网站 ⚡\n' +
      '%c  如果你看到了这条消息，说明你在探索… 👀\n' +
      '%c  试试键盘上的 ↑↑↓↓←→←→BA 吧 ~\n',
      'color: #22c55e; font-size: 15px; font-weight: bold;',
      'color: #888; font-size: 12px;',
      'color: #aaa; font-size: 11px; font-style: italic;'
    )
  }

  // ===== 2. Konami Code 检测 =====
  const handleKeydown = (e) => {
    const tag = e.target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
      return
    }

    keySequence.value.push(e.code)
    if (keySequence.value.length > KONAMI_CODE.length) {
      keySequence.value = keySequence.value.slice(-KONAMI_CODE.length)
    }

    if (
      keySequence.value.length === KONAMI_CODE.length &&
      keySequence.value.every((k, i) => k === KONAMI_CODE[i])
    ) {
      activatePartyMode()
      keySequence.value = []
    }
  }

  // ===== 3. 底部文字连击 =====
  const handleFooterClick = () => {
    footerClicks.value++
    clearTimeout(footerClickTimer)
    footerClickTimer = setTimeout(() => {
      footerClicks.value = 0
    }, 800)

    if (footerClicks.value >= 5) {
      activatePartyMode()
      footerClicks.value = 0
    }
  }

  // ===== 派对模式 =====
  const activatePartyMode = () => {
    if (FORCE_MONOCHROME) {
      console.log('%c🔒 黑白强制模式下彩蛋不可用', 'color: #888;')
      return
    }

    if (isPartyMode.value) {
      document.documentElement.removeAttribute('data-easter-egg')
      removeEmojiRain()
      isPartyMode.value = false
      console.log('%c🎬 霓虹派对已关闭', 'color: #888;')
      return
    }

    document.documentElement.setAttribute('data-easter-egg', 'party')
    createEmojiRain()
    isPartyMode.value = true

    console.log(
      '%c 🎉 恭喜！你发现了隐藏彩蛋 — 霓虹派对模式！🎉\n' +
      '%c 再次触发可关闭',
      'color: #ff00ff; font-size: 16px; font-weight: bold;',
      'color: #888; font-size: 12px;'
    )
  }

  onMounted(() => {
    printConsoleEgg()
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    removeEmojiRain()
    clearTimeout(footerClickTimer)
  })

  return {
    isPartyMode,
    handleFooterClick,
    activatePartyMode,
    partyOff: () => {
      document.documentElement.removeAttribute('data-easter-egg')
      removeEmojiRain()
      isPartyMode.value = false
    }
  }
}