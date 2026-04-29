import { defineStore } from "pinia";
import { ref, computed } from 'vue'
import { useDark, useToggle } from '@vueuse/core'



const useDarkStore = defineStore('dark', () => {
  const isDark = useDark()
  const toggleDark = useToggle(isDark)
  const dark = ref(isDark)
  const darkMode = computed(() => {
    return dark.value? 'dark' : 'light'
  })

  const toggleTheme = ($event) => {
    const x = $event.clientX
    const y = $event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )
    document.documentElement.style.setProperty('--x', x + 'px')
    document.documentElement.style.setProperty('--y', y + 'px')
    document.documentElement.style.setProperty('--r', endRadius + 'px')
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        dark.value = toggleDark()
      })
    } else {
      dark.value = toggleDark()
    }
  }

  return {
    dark,
    darkMode,
    toggleTheme
  }
})

export default useDarkStore
